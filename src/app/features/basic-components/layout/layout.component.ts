import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/data/auth.service';
import { SharedService } from '../../../shared/services/shared.service';
import { SocketService } from '../../../shared/services/socket.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IncomingCallComponent } from '../../workspace/pages/video-call/incoming-call/incoming-call.component';


@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, HeaderComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  systemRole!: string;
  constructor(
    private shared: SharedService,
    private socketService: SocketService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {

    this.systemRole = this.route.snapshot.data['systemRole'];
  }

  dialogRef?: MatDialogRef<IncomingCallComponent>;

  ngOnInit() {

    //Connecting to socket
    // this.socketService.connect();

    if (this.systemRole === 'company-user') {
      //Fetching Teammembers 
      this.shared.fetchTeamMembers();
    }


    // this.socketService.onSignal().subscribe((signal) => {
    //   if (signal.type === 'offer') {

    //     this.dialogRef = this.dialog.open(IncomingCallComponent, {
    //       data: {
    //         from: signal.from,
    //         signal: signal
    //       },
    //       disableClose: true
    //     });
    //   } else if (signal.type === 'call-ended') {

    //     if (this.dialogRef) {
    //       this.dialogRef.close();
    //       this.dialogRef = undefined;
    //     }

    //   }
    // });

  }


  ngOnDestroy() {
    // this.socketService.disconnect();
  }

}
