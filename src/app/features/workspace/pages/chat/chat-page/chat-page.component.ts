import { Component } from '@angular/core';
import { TeamMemberListComponent } from "../team-member-list/team-member-list.component";
import { MessageAreaComponent } from "../message-area/message-area.component";
import { SharedService } from '../../../../../shared/services/shared.service';
import { Team } from '../../../../../core/domain/entities/team.model';
import { AuthService } from '../../../../auth/data/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { NotificationService } from '../../../../../core/data/notification.service';

@Component({
  selector: 'app-chat-page',
  imports: [TeamMemberListComponent, MessageAreaComponent, FormsModule, CommonModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent {

  private destroy$ = new Subject<void>();
  constructor(private shared: SharedService, private authSer: AuthService, private toast: NotificationService) { }

  teamMembers!: Team[];
  currentUserObj: { id: string } = { id: '' };
  isChatOpened: boolean = false;

  ngOnInit() {


    // Get current user once
    this.authSer.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.currentUserObj = { id: res?._id || '' };
      },
      error: (err) => {
        console.error('Error occurred while getting current user', err);
      }
    });

    // Initial load
    this.loadTeamMembers();

    // Listen for project changes and reload team members
    this.shared.currentPro$.pipe(
      switchMap(() => this.shared.getTeamMembers()),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        if (res.status) {
          this.teamMembers = res.data;
        }
      },
      error: (err) => {
        console.error('Error occurred while trying to get team members.');
      }
    });

  }



  private loadTeamMembers() {
    this.shared.getTeamMembers().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        if (res.status) {
          this.teamMembers = res.data;
        }
      },
      error: (err) => {
        this.toast.showError('Error occurred while trying to get team members.');
      }
    });
  }


  handleEvent(event: any) {
    this.isChatOpened = event;
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
