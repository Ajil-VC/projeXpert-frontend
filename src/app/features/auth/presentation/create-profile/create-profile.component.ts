import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthFlowService, AuthService } from '../../data/auth.service';
import { SignupUseCase } from '../../domain/auth.domain';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.css',
  providers: [
    { provide: SignupUseCase, useExisting: AuthService }
  ]
})
export class CreateProfileComponent {

  showPassword: boolean = false;
  isBtnDisabled: boolean = true;
  createProfileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private getEmail: AuthFlowService,
    private createProfileInterface: SignupUseCase,
    private router: Router
  ) {

    this.createProfileForm = this.fb.group({
      username: [''],
      password: [''],
    })
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // onPhotoSelect(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // Handle photo upload logic
  //     console.log('File selected:', file.name);
  //   }
  // }

  onSubmit(): void {

    const userName = this.createProfileForm.value.username;
    const passWord = this.createProfileForm.value.password;
    const email = this.getEmail.getEmail();

    this.createProfileInterface.createProfile(email, userName, passWord).subscribe({

      next: (res) => {

        if (res.status) {

          console.log(res);
          this.router.navigate(['user/dashboard']);

        }
      },
      error: (err) => {
        console.log(err);
      }

    })

  }

}
