import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupUseCase } from '../../domain/auth.domain';
import { AuthFlowService, AuthService } from '../../data/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [
    { provide: SignupUseCase, useExisting: AuthService }
  ]
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private signupuseCaseInterface: SignupUseCase,
    private router: Router) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  // This method is used for handling error msgs in the view.
  get emailControl() {
    return this.loginForm.get('email');
  }

  isBtnDisabled: boolean = false;
  errorMsg! : string;

  onContinue(): void {
    // Handle form submission

    this.isBtnDisabled = true;

    const { email, password } = this.loginForm.value;
    this.signupuseCaseInterface.login(email, password).subscribe({
      next: (res) => {
        if (res.status) {

          console.log("From login resp", res);
          this.router.navigate(['user/dashboard']);
        }
      },
      error: (err) => {
        this.errorMsg = err.error.message;
        this.isBtnDisabled = false;
        console.log("Error in login response ", err);
      }
    })

  }

  continueWithGoogle(): void {
    // Handle Google OAuth
    console.log('Continue with Google');
  }

}
