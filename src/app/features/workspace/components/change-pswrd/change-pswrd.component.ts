import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService, PswdChangeService } from '../../../auth/data/auth.service';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../../../core/domain/entities/canCompoDecativate';

@Component({
  selector: 'app-change-pswrd',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './change-pswrd.component.html',
  styleUrl: './change-pswrd.component.css'
})
export class ChangePswrdComponent implements CanComponentDeactivate {
  passWord!: string;
  oldPassWord!: string;
  passwordChanged: boolean = false;
  errorMsg!: string;

  @ViewChild('passWordField') passWordField!: NgModel;

  constructor(
    private pswdService: PswdChangeService,
    private authService: AuthService,
    private router: Router
  ) { }

  onPasswordChange(): void {
    if (this.passWordField?.control) {
      this.errorMsg = '';
      this.passWordField.control.markAsTouched();
      this.passWordField.control.updateValueAndValidity();
    }
  }

  onSave(): void {

    this.pswdService.changePassword(this.oldPassWord, this.passWord).subscribe({
      next: () => {

        this.passwordChanged = true;
        this.router.navigate(['/user/dashboard']);
      },
      error: (err) => {
        this.errorMsg = err.error.message;
        console.error('Error changing password:', err);
      }
    });
    
  }

  logOut(): void {
    this.authService.logout();
    this.passwordChanged = true;
  }

  canDeactivate(): boolean {
    if (!this.passwordChanged) {
      return false;
    }
    return true;
  }

}