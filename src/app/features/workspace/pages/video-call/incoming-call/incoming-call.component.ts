import { Component, inject } from '@angular/core';
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
  data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<IncomingCallComponent>>(MatDialogRef);
  private router = inject(Router);
  private socketService = inject(SocketService);


  caller!: User;
  constructor() {
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
