import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthFlowService } from '../../data/auth.service';
import { OtpUseCase } from '../../domain/auth.domain';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css',
  providers: [
    { provide: OtpUseCase, useExisting: AuthFlowService }
  ]
})
export class OtpComponent implements OnInit {
  private fb = inject(FormBuilder);
  private getEmail = inject(AuthFlowService);
  private otpUseCaseInterface = inject(OtpUseCase);
  private router = inject(Router);


  timeLeft = 15;
  timerInterval: any;
  isBtnDisabled = false;
  isLinkVisible = true;
  otpForm: FormGroup;
  isValideOtp = false;
  otpMsg = 'Enter OTP below';

  constructor() {
    this.otpForm = this.fb.group({
      otp: []
    })
  }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft < 1) {
        clearInterval(this.timerInterval)
        this.isBtnDisabled = true;
        this.isLinkVisible = false;
      }
    }, 1000)

  }

  resendOtp() {

    this.isLinkVisible = true;
    this.isBtnDisabled = false;
    this.timeLeft = 15;

    this.otpUseCaseInterface.resendOtp(this.getEmail.getEmail()).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error('Didnt get response after resending otp', err);
      }
    })

    this.startTimer();
  }

  onConfirm() {

    const otp = this.otpForm.value.otp;
    const email = this.getEmail.getEmail();
    this.otpUseCaseInterface.validateOtp(email, otp).subscribe({
      next: (res) => {
        if (res.status) {
          this.router.navigate(['create-company']);
        }
      },
      error: (err) => {
        console.error(err);
        this.isValideOtp = true;
        this.otpMsg = 'Enter valid OTP';
      }
    })

  }

}
