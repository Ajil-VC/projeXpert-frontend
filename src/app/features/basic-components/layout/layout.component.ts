import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { SocketService } from '../../../shared/services/socket.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IncomingCallComponent } from '../../workspace/pages/video-call/incoming-call/incoming-call.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, HeaderComponent, RouterOutlet, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit, OnDestroy {
  private shared = inject(SharedService);
  private socketService = inject(SocketService);
  private route = inject(ActivatedRoute);
  dialog = inject(MatDialog);


  systemRole!: string;
  isCollapsed!: boolean;
  constructor() {

    this.systemRole = this.route.snapshot.data['systemRole'];
  }

  dialogRef?: MatDialogRef<IncomingCallComponent>;

  ngOnInit() {

    //Connecting to socket
    this.socketService.connect();

    if (this.systemRole === 'company-user') {
      //Fetching Teammembers 
      this.shared.fetchTeamMembers();
    }


    this.socketService.onSignal().subscribe((signal) => {

      if (signal.type === 'offer') {

        this.dialogRef = this.dialog.open(IncomingCallComponent, {
          data: {
            from: signal.from,
            signal: signal
          },
          disableClose: true
        });
      } else if (signal.type === 'call-ended') {

        if (this.dialogRef) {
          this.dialogRef.close();
          this.dialogRef = undefined;
        }

      }
    });

  }

  handleIsCollapsed(response: boolean) {
    this.isCollapsed = response;
  }


  ngOnDestroy() {
    this.socketService.disconnect();
  }

}
