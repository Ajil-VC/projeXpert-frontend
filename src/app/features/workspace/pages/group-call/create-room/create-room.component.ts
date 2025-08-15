import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../../core/domain/entities/user.model';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../../../../shared/services/shared.service';
import { NotificationService } from '../../../../../core/data/notification.service';
import { Team } from '../../../../../core/domain/entities/team.model';
import { GroupcallService } from '../groupcall.service';
import { AuthService } from '../../../../auth/data/auth.service';

@Component({
  selector: 'app-create-room',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.css'
})
export class CreateRoomComponent {

  roomForm!: FormGroup;
  isSubmitting = false;
  minDate: string;
  minTime: string;

  availableUsers: Team[] = [];
  selectedMembers: Team[] = [];
  filteredUsers: Team[] = [];
  searchQuery = '';
  showUserDropdown = false;

  constructor(
    public dialogRef: MatDialogRef<CreateRoomComponent>,
    private fb: FormBuilder,
    private sharedSer: SharedService,
    private toast: NotificationService,
    private callSer: GroupcallService,
    private authSer: AuthService
  ) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    // Set minimum time to current time if date is today
    this.minTime = today.toTimeString().slice(0, 5);
  }

  ngOnInit(): void {

    this.initializeForm();
    this.loadAvailableUsers();

    this.authSer.logout$.subscribe({
      next: () => this.dialogRef.close(null)
    })
  }

  private initializeForm(): void {
    this.roomForm = this.fb.group({
      roomName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      meetingDate: ['', Validators.required],
      meetingTime: ['', Validators.required],
      description: ['', [Validators.maxLength(500)]],
      members: [[], Validators.required] // Array of selected user IDs
    });

    // Watch for date changes to update time validation
    this.roomForm.get('meetingDate')?.valueChanges.subscribe(() => {
      this.updateTimeValidation();
    });
  }

  private updateTimeValidation(): void {
    const selectedDate = this.roomForm.get('meetingDate')?.value;
    const today = new Date().toISOString().split('T')[0];

    if (selectedDate === today) {
      // If today is selected, set minimum time to current time
      const now = new Date();
      this.minTime = now.toTimeString().slice(0, 5);
    } else {
      // If future date is selected, reset minimum time
      this.minTime = '00:00';
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.roomForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.roomForm.get(fieldName);

    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
    }

    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'roomName': 'Room name',
      'meetingDate': 'Meeting date',
      'meetingTime': 'Meeting time',
      'description': 'Description',
      'members': 'Meeting members'
    };

    return displayNames[fieldName] || fieldName;
  }

  // Load mock users - replace with actual API call
  private loadAvailableUsers(): void {

    this.sharedSer.getTeamMembers().subscribe({
      next: (res) => {
        if (res.status) {
          this.availableUsers = res.data || [];
          this.filteredUsers = [...this.availableUsers];
        }
      },
      error: (err) => {
        this.toast.showError('Couldnt retrieve team members.');
      }
    })
  }

  // Member search functionality
  onSearchMembers(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value.toLowerCase();
    this.showUserDropdown = true;

    if (this.searchQuery.trim() === '') {
      this.filteredUsers = [...this.availableUsers];
    } else {
      this.filteredUsers = this.availableUsers.filter(user =>
        user.name.toLowerCase().includes(this.searchQuery) ||
        user.email.toLowerCase().includes(this.searchQuery)
      );
    }
  }

  // Add member to selection
  addMember(user: Team): void {
    if (!this.isMemberSelected(user)) {
      this.selectedMembers.push(user);
      this.updateMembersFormControl();
      this.searchQuery = '';
      this.showUserDropdown = false;
      this.filteredUsers = [...this.availableUsers];
    }
  }

  // Remove member from selection
  removeMember(userId: string): void {
    this.selectedMembers = this.selectedMembers.filter(member => member._id !== userId);
    this.updateMembersFormControl();
  }

  // Check if user is already selected
  isMemberSelected(user: Team): boolean {
    return this.selectedMembers.some(member => member._id === user._id);
  }

  // Update form control with selected member IDs
  private updateMembersFormControl(): void {
    const memberIds = this.selectedMembers.map(member => member._id);
    this.roomForm.get('members')?.setValue(memberIds);
  }

  // Hide dropdown when clicking outside
  onSearchBlur(): void {
    // Delay hiding to allow for click events on dropdown items
    setTimeout(() => {
      this.showUserDropdown = false;
    }, 200);
  }

  // Show dropdown when focusing search
  onSearchFocus(): void {
    this.showUserDropdown = true;
    if (this.searchQuery.trim() === '') {
      this.filteredUsers = [...this.availableUsers];
    }
  }

  // Get user avatar initials
  getUserInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  private isValidDateTime(): boolean {
    const dateValue = this.roomForm.get('meetingDate')?.value;
    const timeValue = this.roomForm.get('meetingTime')?.value;

    if (!dateValue || !timeValue) return false;

    const selectedDateTime = new Date(`${dateValue}T${timeValue}`);
    const now = new Date();

    return selectedDateTime > now;
  }


  generateRoomId(): string {
    const randomStr = Math.random().toString(36).substr(2, 6);
    return `room-${randomStr}`;
  }

  onSubmit(): void {
    if (this.roomForm.valid && this.isValidDateTime()) {
      this.isSubmitting = true;

      const ROOM_ID = this.generateRoomId();

      const formData = {
        roomName: this.roomForm.get('roomName')?.value,
        meetingDate: this.roomForm.get('meetingDate')?.value,
        meetingTime: this.roomForm.get('meetingTime')?.value,
        description: this.roomForm.get('description')?.value || '',
        members: this.selectedMembers.map(mem => mem._id),
        roomId: ROOM_ID,
        url: '/user/room/' + ROOM_ID
      };

      this.callSer.createRoom(formData).subscribe({
        next: (res) => {

          this.isSubmitting = false;
          this.dialogRef.close(res.createdMeeting);
        },
        error: (err) => {
          this.toast.showError('Couldnt create room');
        }
      })

    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.roomForm.controls).forEach(key => {
        this.roomForm.get(key)?.markAsTouched();
      });

      if (!this.isValidDateTime()) {
        this.toast.showError('Please select a future date and time for the meeting.');
      }
    }
  }

  onCancel(): void {
    this.roomForm.reset();
    this.selectedMembers = [];
    this.searchQuery = '';
    this.showUserDropdown = false;
    this.filteredUsers = [...this.availableUsers];
    this.dialogRef.close();
  }


}
