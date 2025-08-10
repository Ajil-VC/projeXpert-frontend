import { ChangeDetectorRef, Component, ElementRef, Input, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';


import { ChatService } from '../data/chat.service';
import { Message } from '../../../../../core/domain/entities/message.model';
import { Conversation } from '../../../../../core/domain/entities/conversation.model';
import { AuthService } from '../../../../auth/data/auth.service';
import { User } from '../../../../../core/domain/entities/user.model';
import { SocketService } from '../../../../../shared/services/socket.service';
import { Team } from '../../../../../core/domain/entities/team.model';
import { SharedService } from '../../../../../shared/services/shared.service';


@Component({
  selector: 'app-message-area',
  imports: [CommonModule, FormsModule],
  templateUrl: './message-area.component.html',
  styleUrl: './message-area.component.css'
})
export class MessageAreaComponent {

  currentUser: User | null = null;
  messages: Message[] = [];
  messageText: string = '';
  chat!: Conversation;
  reciever!: Team | undefined;
  isChatOpened: boolean = false;

  onlineUsers = new Set<string>();
  onlieStatus: boolean = false;

  private destroy$ = new Subject<void>();
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(
    private chatSer: ChatService,
    private authSer: AuthService,
    private socketService: SocketService,
    private router: Router,
    private sharedSer: SharedService
  ) { }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  openVideoChat() {
    this.router.navigate(['user/video-call'], {
      queryParams: {
        isCaller: true
      },
      state: {
        signal: this.chat,
        from: 'caller'
      }
    });
  }

  get isUserOnline() {
    if (!this.reciever?._id) return false;
    return this.onlineUsers.has(this.reciever?._id);
  }


  ngOnInit() {

    this.chatSer.isChatOpened$.subscribe({
      next: (res) => {
        this.isChatOpened = res;
      }
    })

    //Connected to socket in layout component as it is the root component of all pages.
    this.socketService.receiveMessage().pipe(
      takeUntil(this.destroy$)
    ).subscribe((msg: any) => {
      if (this.sharedSer.activeChatUserId === msg.senderId) {

        this.messages.push(msg);
      }
    });

    this.socketService.onlineStatus().pipe(
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      this.onlineUsers.add(data);
    });
    this.socketService.userOffline().pipe(
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      this.onlineUsers.delete(data);
    })

    //Getting the current user.
    this.authSer.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: User | null) => {
        if (res) {

          this.currentUser = res;
        }
      },
      error: (err) => {
        console.error('Error occured while getting current user', err);
      }
    })

    //Getting all the messages in the chat
    this.chatSer.messages$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.messages = res;
        } else {
          this.messages = [];
        }

      },
      error: (err) => {
        console.error('Error occured while retrieving messages.', err);
      }
    });

    //Identifying the chat.
    this.chatSer.chat$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.chat = res as Conversation;
        if (!this.chat.participants) {
          this.chatSer.isChatOpened.next(false);
          return;
        }
        this.reciever = this.chat.participants.find(user => this.currentUser!._id !== user._id);
      },
      error: (err) => {
        console.error('Error occured while retrieving chat details.', err);
      }
    });

  }



  sendMessage() {
    if (!this.messageText.trim() || this.currentUser == null) {
      return;
    }
    if (!this.chat || !this.chat.participants) {
      throw new Error('Chat or participants not available.');
    }

    if (!this.reciever?._id) throw new Error('Reciever Id not available.');
    this.chatSer.sendMessage(this.chat._id, this.reciever._id, this.messageText).subscribe({
      next: (res) => {
        this.messages.push(res.result);

        this.messageText = '';
      },
      error: (err) => {
        console.error('Error occured while sending message.', err);
      }
    })
  }


  ngOnDestroy() {
    this.chatSer.chatSubject.next(false);
    this.destroy$.next();
    this.destroy$.complete();
    this.sharedSer.activeChatUserId = '';
  }

}
