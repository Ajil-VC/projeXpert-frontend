import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Team } from '../../../../../core/domain/entities/team.model';

import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../data/chat.service';
import { Conversation } from '../../../../../core/domain/entities/conversation.model';
import { Message } from '../../../../../core/domain/entities/message.model';
import { AuthService } from '../../../../auth/data/auth.service';
import { User } from '../../../../../core/domain/entities/user.model';
import { combineLatest, debounceTime, distinctUntilChanged, startWith, Subject, takeUntil, tap } from 'rxjs';
import { SocketService } from '../../../../../shared/services/socket.service';
import { SharedService } from '../../../../../shared/services/shared.service';

@Component({
  selector: 'app-team-member-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './team-member-list.component.html',
  styleUrl: './team-member-list.component.css'
})
export class TeamMemberListComponent {

  @Input() teamMembers: Team[] = [];
  filteredTeamMembers!: Team[];

  currentUser: any;
  searchText: string = '';
  availableChatIds = new Set();
  chatStartedUserId = new Set();
  searchControl = new FormControl('');

  chats: Conversation[] = [];
  filteredChats: Conversation[] = [];
  activeChat: any;

  private destroy$ = new Subject<void>();


  constructor(private sharedSer: SharedService, private chatService: ChatService, private authSer: AuthService, private socketService: SocketService) {

  }


  ngOnChanges() {
    this.filteredTeamMembers = this.getUsersHaventStartedChat();
  }
  ngOnInit() {

    this.socketService.receiveMessage().pipe(
      takeUntil(this.destroy$)
    ).subscribe((msg: any) => {

      this.chats = this.chats.map(member => {
        if (member._id === msg.conversationId) {
          return { ...member, lastMessage: msg.message, lastActivityType: 'msg' }
        }

        return member;
      })
    });

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

    this.refreshChatView();

    this.sharedSer.currentPro$.subscribe((project) => {

      this.refreshChatView();

    })


  }


  searchTerm$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    takeUntil(this.destroy$)
  ).subscribe(searchTerm => {

    const term = searchTerm?.toLowerCase();
    if (!term) {
      this.filteredChats = this.chats;
      this.filteredTeamMembers = this.getUsersHaventStartedChat();
      return;
    }

    this.filteredChats = this.chats.filter(chat => {
      const user: Team = chat.participants.filter(mem => mem._id !== this.currentUser._id)[0];
      return user.email.toLowerCase().includes(term);
    });

    this.filteredTeamMembers = this.getUsersHaventStartedChat().filter(mem => mem.email.toLowerCase().includes(term));

  })


  refreshChatView() {

    this.chatService.getAvailableConversations().subscribe({
      next: (res: { status: boolean, message: string, result: Conversation[] }) => {

        if (res.status) {
          this.chats = res.result;
          this.filteredChats = this.chats;
          this.chats.forEach((item) => {
            this.availableChatIds.add(item._id);
            for (let user of item.participants) {
              this.chatStartedUserId.add(user._id);
            }
          });
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
  getUsersHaventStartedChat() {
    if (!this.teamMembers) return [];
    return this.teamMembers.filter(member =>
      !this.chatStartedUserId.has(member._id) &&
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
            this.chatStartedUserId.add(member._id);
            this.sharedSer.activeChatUserId = res.result._id;
            this.filteredTeamMembers = this.getUsersHaventStartedChat();
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
        this.sharedSer.activeChatUserId = chat.participants.find(ele => {
          return ele._id !== this.currentUser._id
        })?._id || '';

        this.chatService.isChatOpened.next(true);
      },
      error: (err) => {
        console.error('Error occured while retrieving messages.', err);
      }
    });

  }



  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
