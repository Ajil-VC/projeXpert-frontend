import { Component, Inject, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { AuthService, PswdChangeService } from '../../../auth/data/auth.service';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-pswrd',
  imports: [
    FormsModule,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatDialogActions,
    MatInputModule,
    CommonModule
  ],
  templateUrl: './change-pswrd.component.html',
  styleUrl: './change-pswrd.component.css'
})
export class ChangePswrdComponent {

  passWord!: string;
  @ViewChild('passWordField') passWordField!: NgModel;
  constructor(
    public dialogRef: MatDialogRef<ChangePswrdComponent>,
    private pswdService: PswdChangeService,
    private authService: AuthService
  ) { }

  onPasswordChange(): void {
    // Triggering form control validation
    if (this.passWordField) {
      this.passWordField?.control?.markAsTouched();
      this.passWordField?.control?.updateValueAndValidity();
    }
  }


  onSave() {

    this.pswdService.changePassword(this.passWord).subscribe({
      next: (res) => {
        console.log(res, 'from change password');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error on changing password', err);
      }
    })

  }

  logOut() {
    this.authService.logout();
    this.dialogRef.close(true);
  }
}
