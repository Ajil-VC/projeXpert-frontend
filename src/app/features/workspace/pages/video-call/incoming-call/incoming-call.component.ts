import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from '../../../../../core/domain/entities/user.model';
import { SocketService } from '../../../../../shared/services/socket.service';

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
    private router: Router,
    private socketService: SocketService
  ) {
    this.caller = this.data.signal.caller;
  }

  accept() {

    this.dialogRef.close();
    this.router.navigate(['/user/video-call'], {
      queryParams: {
        from: this.data.signal.to,
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
    this.socketService.sendSignal({
      type: 'call-ended',
      from: this.data.signal.to,
      to: this.data.from,
      // messageId: this.msgId
    })

  }

}
