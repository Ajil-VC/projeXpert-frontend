import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';
import { Notification } from '../../core/domain/entities/notification.model';
import { LayoutService } from './layout.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket!: Socket;
  private readonly URL = environment.ultraBaseURL;
  constructor(private sharedSer: SharedService, private layoutSer: LayoutService) { }

  connect() {

    const token = localStorage.getItem('authToken');

    this.socket = io(this.URL, {
      transports: ['websocket'],
      auth: {
        token: token
      }
    });

    //Im autherizing user while connecting to socket. So dont need to register again.
    // this.socket.on('connect', () => {
    //   console.log('Socket connected:', this.socket.id);
    //   if (token) {
    //     this.socket.emit('register', token);
    //   }
    // });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

  }

  //For text messages
  sendMessage(message: any) {
    this.socket.emit('send-message', message);
  }
  receiveMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('receive-message', (data) => {
        observer.next(data);
      });
    });
  }
  notification(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('notification', (data: Notification) => {

        if (this.sharedSer.activeChatUserId === data.senderId && data.type === 'message') {

          this.layoutSer.makeNotificationsAsRead(data._id).subscribe();

        } else {

          observer.next(data);
        }
      })
    })
  }

  //For Video calls
  sendSignal(signal: any) {
    this.socket.emit('video-signal', signal);
  }
  onSignal(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('video-signal', (data) => {
        observer.next(data);
      });
    });
  }


  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

}
