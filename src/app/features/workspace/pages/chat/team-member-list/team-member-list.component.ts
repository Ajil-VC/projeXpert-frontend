import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Team } from '../../../../../core/domain/entities/team.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../data/chat.service';
import { Conversation } from '../../../../../core/domain/entities/conversation.model';
import { Message } from '../../../../../core/domain/entities/message.model';
import { AuthService } from '../../../../auth/data/auth.service';
import { User } from '../../../../../core/domain/entities/user.model';

@Component({
  selector: 'app-team-member-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './team-member-list.component.html',
  styleUrl: './team-member-list.component.css'
})
export class TeamMemberListComponent {

  @Input() teamMembers: Team[] = [];
  @Output() isChatOpen = new EventEmitter();

  currentUser: any;
  searchText: string = '';
  availableChatIds = new Set(); //Just to ensure duplicates are not adding into the chats array.
  chats: Conversation[] = [];
  activeChat: any;

  constructor(private chatService: ChatService, private authSer: AuthService) { }

  ngOnInit() {

    //Getting the current user
    this.authSer.user$.subscribe({
      next: (res: User | null) => {
        if (res) {

          this.currentUser = res;

        }
      },
      error: (err) => {
        console.error('Error occured while getting current user', err);
      }
    });

    this.chatService.getAvailableConversations().subscribe({
      next: (res: { status: boolean, message: string, result: Conversation[] }) => {

        if (res.status) {
          this.chats = res.result;
          this.chats.forEach((item) => {
            this.availableChatIds.add(item._id);
          })
        }
      },
      error: (err) => {
        console.error('Error Occured while retrieving conversations', err);
      }
    })
  }


  getUserEmail(users: Array<Team>) {

    const userData = users.find(user => user._id !== this.currentUser._id);
    return userData?.email;
  }

  filteredMembers() {
    if (!this.searchText) return;
    return this.teamMembers.filter(member =>
      member.email.toLowerCase().includes(this.searchText.toLowerCase()) &&
      member.email !== this.currentUser.email
    );
  }

  startConversation(member: Team) {

    this.chatService.startConversation(member._id).subscribe({
      next: (res: { status: boolean, message: string, result: Conversation }) => {
        if (res.status) {

          this.searchText = '';
          if (!this.availableChatIds.has(res.result._id)) {
            this.availableChatIds.add(res.result._id);
            this.chats.push(res.result);

            //Open the particular chat.
          } else {
            //THe message shwoing for the particular chat
          }

        }
      },
      error: (err) => {
        console.error('Error Occured while starting conversation', err);
      }

    })

  }

  openChat(chat: Conversation) {

    this.chatService.retrieveMessages(chat._id).subscribe({
      next: (res: { status: boolean, message: string, result: Message[] }) => {
        this.activeChat = chat._id;
        this.chatService.messagesSubject.next(res.result);
        this.chatService.chatSubject.next(chat);
        this.isChatOpen.emit(true);
      },
      error: (err) => {
        console.error('Error occured while retrieving messages.', err);
      }
    });

  }

}
