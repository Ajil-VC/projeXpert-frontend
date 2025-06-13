import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from '../../../../../core/domain/entities/user.model';

@Component({
  selector: 'app-incoming-call',
  imports: [],
  templateUrl: './incoming-call.component.html',
  styleUrl: './incoming-call.component.css'
})
export class IncomingCallComponent {

  caller!: User;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<IncomingCallComponent>,
    private router: Router
  ) {
    this.caller = this.data.signal.caller;
  }

  accept() {

    this.dialogRef.close();
    this.router.navigate(['/user/video-call'], {
      queryParams: {
        from: this.data.to,
        to: this.data.from,
        isCaller: false
      },
      state: {
        signal: this.data.signal
      }
    });

  }

  decline() {

    this.dialogRef.close();

  }

}
