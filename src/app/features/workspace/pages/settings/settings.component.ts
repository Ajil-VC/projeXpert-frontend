import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/data/auth.service';
import { User } from '../../../../core/domain/entities/user.model';
import { SettingsService } from './settings.service';
import { NotificationService } from '../../../../core/data/notification.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  user!: User;
  isEditingName = false;
  tempName = '';
  selectedFile: File | null = null;
  isLoading = false;
  userLoaded = false;
  systemRole!: string;

  constructor(private auth: AuthService, private setting: SettingsService, private toast: NotificationService, private route: ActivatedRoute) { }

  ngOnInit(): void {


    this.systemRole = this.route.snapshot.data['systemRole'];

    this.auth.user$.subscribe({
      next: (res) => {
        if (res) {
          this.user = res;
          this.tempName = this.user.name;
          this.userLoaded = true;
        }
      }
    })
  }

  get profilePic() {
    if (this.user && this.user.profilePicUrl) {
      return this.user.profilePicUrl.url;
    }
    return 'assets/images/avatar.jpg';
  }

  onProfilePictureError(event: any) {
    if (this.user && this.user.profilePicUrl)
      this.user.profilePicUrl.url = 'assets/images/avatar.jpg';
  }

  toggleEditName(): void {
    if (!this.userLoaded) return;

    this.isEditingName = !this.isEditingName;
    if (this.isEditingName) {
      this.tempName = this.user.name;

      setTimeout(() => {
        const input = document.getElementById('nameInput') as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }, 0);
    }
  }

  saveName(): void {
    if (this.tempName.trim() && this.userLoaded) {
      this.user.name = this.tempName.trim();
      this.isEditingName = false;
    }
  }

  cancelEdit(): void {
    if (this.userLoaded) {
      this.tempName = this.user.name;
      this.isEditingName = false;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.toast.showWarning('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.toast.showWarning('File size must be less than 5MB');
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.user) {
          if (!this.user.profilePicUrl) {
            this.user.profilePicUrl = { public_id: '', url: '' };
          }
          this.user.profilePicUrl.url = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveName();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  saveProfile(): void {
    if (this.isLoading || !this.userLoaded) return;

    this.isLoading = true;

    const formData = new FormData();
    formData.append('name', this.user.name);

    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    }

    this.setting.updateProfile(formData, this.systemRole === 'platform-admin')
      .subscribe({
        next: (response: any) => {
          this.toast.showSuccess('Profile updated successfully');
          console.log(response);
          this.isLoading = false;
          this.selectedFile = null;
        },
        error: (error) => {
          this.toast.showError('Failed to update profile. Please try again.');
          this.isLoading = false;
        }
      });
  }

  getFormData(): FormData {
    const formData = new FormData();
    if (this.userLoaded) {
      formData.append('name', this.user.name);

      if (this.selectedFile) {
        formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
      }
    }
    return formData;
  }

  logFormData(): void {
    const formData = this.getFormData();
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  }

  resetForm(): void {
    if (this.userLoaded) {

      this.auth.user$.subscribe({
        next: (originalUser) => {
          if (originalUser) {
            this.user.name = originalUser.name;
            if (this.user.profilePicUrl && originalUser.profilePicUrl) {
              this.user.profilePicUrl.url = originalUser.profilePicUrl.url;
            }
          }
        }
      });
      this.selectedFile = null;
      this.isEditingName = false;
      this.tempName = this.user.name;
    }
  }

}
