import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterUseCase } from '../../domain/auth.domain';
import { AuthFlowService, AuthService } from '../../data/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  providers: [
    { provide: RegisterUseCase, useExisting: AuthService }
  ]
})
export class SignupComponent {

  signUpForm: FormGroup;
  isEmailExists: boolean = false;
  constructor(
    private fb: FormBuilder,
    private signupuseCaseInterface: RegisterUseCase,
    private router: Router,
    private setEmail: AuthFlowService) {

    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  // This method is used for handling error msgs in the view.
  get emailControl() {
    return this.signUpForm.get('email');
  }

  isBtnDisabled: boolean = false;

  onContinue(): void {
    // Handle form submission

    this.isBtnDisabled = true;
    this.setEmail.setEmail(this.signUpForm.value.email);

    this.signupuseCaseInterface.signup(this.signUpForm.value.email).subscribe({
      next: (res) => {

        this.router.navigate([`verify-otp`]);
      },
      error: (err) => {
        if (err.status == 409) {
          this.isEmailExists = true;
        }
        this.isBtnDisabled = false;
        console.error("Signup Error: ", err)
      }
    })

  }

  continueWithGoogle(): void {
    // Handle Google OAuth
    console.log('Continue with Google');
  }

}
