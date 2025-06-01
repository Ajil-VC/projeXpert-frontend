import { ChangeDetectorRef, Component, ElementRef, Input, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { ChatService } from '../data/chat.service';
import { Message } from '../../../../../core/domain/entities/message.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conversation } from '../../../../../core/domain/entities/conversation.model';
import { AuthService } from '../../../../auth/data/auth.service';
import { User } from '../../../../../core/domain/entities/user.model';
import { SocketService } from '../../../../../shared/services/socket.service';

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

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(private chatSer: ChatService, private authSer: AuthService, private socketService: SocketService) { }

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


  ngOnInit() {

    //Connected to socket in layout component as it is the root component of all pages.
    this.socketService.receiveMessage().subscribe((msg: any) => {
      console.log(msg,'from socket');
      this.messages.push(msg);
    });

    //Getting the current user.
    this.authSer.user$.subscribe({
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
    this.chatSer.messages$.subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.messages = res;
          console.log(this.messages)
        } else {
          this.messages = [];
        }

      },
      error: (err) => {
        console.error('Error occured while retrieving messages.', err);
      }
    });

    //Identifying the chat.
    this.chatSer.chat$.subscribe({
      next: (res) => {
        this.chat = res as Conversation;

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

    const reciever = this.chat.participants.find(user => this.currentUser!._id !== user._id);
    if (!reciever?._id) throw new Error('Reciever Id not available.');
    this.chatSer.sendMessage(this.chat._id, reciever._id, this.messageText).subscribe({
      next: (res) => {
        this.messages.push(res.result);
        this.messageText = '';
      },
      error: (err) => {
        console.error('Error occured while sending message.', err);
      }
    })
  }

}
