import { Component } from '@angular/core';
import { TeamMemberListComponent } from "../team-member-list/team-member-list.component";
import { MessageAreaComponent } from "../message-area/message-area.component";
import { SharedService } from '../../../../../shared/services/shared.service';
import { Team } from '../../../../../core/domain/entities/team.model';
import { AuthService } from '../../../../auth/data/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-page',
  imports: [TeamMemberListComponent, MessageAreaComponent, FormsModule, CommonModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent {

  constructor(private shared: SharedService, private authSer: AuthService) { }

  teamMembers!: Team[];
  currentUserObj: { id: string } = { id: '' };
  isChatOpened: boolean = false;

  ngOnInit() {


    this.shared.getTeamMembers().subscribe({
      next: (res) => {
        if (res.status) {

          this.teamMembers = res.data;
        }
      },
      error: (err) => {
        console.error('Error occured while trying to get team members.');
      }
    });

    this.authSer.user$.subscribe({
      next: (res) => {
        this.currentUserObj = { id: res?._id || '' };
      },
      error: (err) => {
        console.error('Error occured while getting current user', err);
      }
    })

  }

  handleEvent(event: any) {
    this.isChatOpened = event;
  }


}
