import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Meeting } from '../../../../core/domain/entities/meeting.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateRoomComponent } from './create-room/create-room.component';
import { GroupcallService } from './groupcall.service';
import { NotificationService } from '../../../../core/data/notification.service';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../../../core/presentation/loader/loader.component';
import { HeaderConfig } from '../../../../core/domain/entities/UI Interface/header.interface';
import { ContentHeaderComponent } from '../../../reusable/content-header/content-header.component';
import { ButtonType } from '../../../../core/domain/entities/UI Interface/button.interface';
import { ConfirmDialogComponent } from '../../../reusable/confirm-dialog/confirm-dialog.component';




@Component({
  selector: 'app-group-call',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderComponent,
    ContentHeaderComponent

  ],
  templateUrl: './group-call.component.html',
  styleUrl: './group-call.component.css',

})
export class GroupCallComponent {

  headerConfig: HeaderConfig = {

    title: 'Upcoming Meetings',
    icon: '📅',
    subtitle: 'Manage your scheduled group calls and meetings',
    placeHolder: 'Search meetings, members, or descriptions...',
    searchQuery: '',
    buttons: [
      {
        type: 'main',
        label: '+ Create New Room',
      },
    ]

  }

  handleSearchEvent(event: string) {
    this.searchQuery = event.toLowerCase();
    this.filterMeetings();
  }
  handlebuttonClick(btn: ButtonType) {
    if (btn.triggeredFor === this.headerConfig.title) {
      if (btn.type === 'main') {
        this.onCreateRoom();
      }
    }
  }


  @Output() createRoomClicked = new EventEmitter<void>();

  meetings: Meeting[] = [];
  filteredMeetings: Meeting[] = [];
  searchQuery = '';
  selectedFilter = 'all';
  isLoading = false;

  constructor(
    public dialog: MatDialog,
    private callService: GroupcallService,
    private toast: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMeetings();
  }

  private loadMeetings(): void {
    this.isLoading = true;

    this.callService.upcomingMeetings().subscribe({
      next: (res) => {
        if (res.status) {
          this.meetings = res.data;
          this.filteredMeetings = [...this.meetings];
          this.isLoading = false;
        }

      },
      error: (err) => {
        this.toast.showError('Couldnt retrieve upcoming meetings.');
      }
    })

  }

  onCreateRoom(): void {
    const dialogRef = this.dialog.open(CreateRoomComponent, {
      width: '1000px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.meetings.push(result);
        this.filterMeetings();

      }
    });
  }


  private filterMeetings(): void {
    let filtered = [...this.meetings];

    if (this.searchQuery.trim() !== '') {
      filtered = filtered.filter(meeting =>
        meeting.roomName.toLowerCase().includes(this.searchQuery) ||
        meeting.description.toLowerCase().includes(this.searchQuery) ||
        meeting.createdBy.email.toLowerCase().includes(this.searchQuery) ||
        meeting.members.some(member =>
          member.name.toLowerCase().includes(this.searchQuery) ||
          member.email.toLowerCase().includes(this.searchQuery)
        )
      );
    }

    this.filteredMeetings = filtered;

  }

  formatDate(dateString: Date | undefined): string {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (this.isSameDay(date, today)) {
      return 'Today';
    } else if (this.isSameDay(date, tomorrow)) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  }

  formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  getUserInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getTimeUntilMeeting(date: Date, time: string): string {
    const [hours, minutes] = time.split(':').map(Number);

    // Clone date and set time
    const meetingDateTime = new Date(date);
    meetingDateTime.setHours(hours);
    meetingDateTime.setMinutes(minutes);
    meetingDateTime.setSeconds(0);
    meetingDateTime.setMilliseconds(0);

    const now = new Date();
    const diffMs = meetingDateTime.getTime() - now.getTime();

    if (diffMs <= 0) {
      return 'Meeting time passed';
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
    } else if (diffHours > 0) {
      return `in ${diffHours} hour${diffHours === 1 ? '' : 's'}`;
    } else {
      return `in ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`;
    }
  }


  joinMeeting(meeting: Meeting): void {

    this.router.navigateByUrl(meeting.url);

  }

  editMeeting(meeting: Meeting): void {
    console.log('Editing meeting:', meeting);
    // Implement edit meeting logic
    alert(`Editing meeting: ${meeting.roomName}`);
  }

  deleteMeeting(meeting: Meeting): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Heads Up!!!',
        message: `Are you sure you want to delete ${meeting.roomName}? This action cannot be undone.`,
        confirmButton: 'Delete',
        cancelButton: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.callService.removeMeeting(meeting._id).subscribe({
          next: (res) => {

            const indexOfMeet = this.meetings.findIndex(ele => ele._id === meeting._id);
            this.meetings.splice(indexOfMeet, 1);
            this.filterMeetings();
            this.isLoading = false;
          },
          error: (err) => {
            this.toast.showError('Couldnt remove the meeting.');
            this.isLoading = false;
          }
        });
      }
    });

  }


}
