import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../auth/data/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePswrdComponent } from '../change-pswrd/change-pswrd.component';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, HeaderComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  private destroy$ = new Subject<void>();
  constructor(private authSer: AuthService, public dialog: MatDialog) { }
  ngOnInit() {

    this.authSer.user$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {

        if (!res) throw new Error('Something went wront, user not found');
        if (res.forceChangePassword) {

          const dialogRef = this.dialog.open(ChangePswrdComponent, {
            width: '500px',
            disableClose: true,
            data: { isPassWordChanged: false, email: res.email }
          });

        }

      },
      error: (err) => {
        console.error('Error occured', err)
      }
    });


  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
