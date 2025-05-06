import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterUseCase } from '../../domain/auth.domain';
import { AuthService } from '../../data/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [
    { provide: RegisterUseCase, useExisting: AuthService }
  ]
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registerUseCaseInterface: RegisterUseCase,
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
  errorMsg!: string;

  onContinue(): void {
    // Handle form submission

    this.isBtnDisabled = true;

    const { email, password } = this.loginForm.value;
    this.registerUseCaseInterface.login(email, password).subscribe({
      next: (res: {
        forceChangePassword: boolean,
        status: boolean,
        token: string
      }) => {
        if (res.status) {

          if (!res.forceChangePassword) {

            this.router.navigate(['user/dashboard']);
          } else {
            this.router.navigate(['user/change-password']);
          }
        }
      },
      error: (err) => {
        this.errorMsg = err.message;
        this.isBtnDisabled = false;
        console.log("Error in login response ", err);
      }
    })

  }

}
