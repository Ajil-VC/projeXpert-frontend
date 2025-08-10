import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { SharedService } from './shared.service';
import { Notification } from '../../core/domain/entities/notification.model';
import { LayoutService } from './layout.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket!: Socket;
  private readonly URL = environment.ultraBaseURL;
  private videoSignalSubject = new Subject<any>();
  private lastOfferSignal: any = null;

  constructor(private sharedSer: SharedService, private layoutSer: LayoutService) {

  }

  handleSignal(signal: any) {
    if (signal.type == 'offer') {
      this.lastOfferSignal = signal;
    }

    this.videoSignalSubject.next(signal);
  }

  getLastOfferSignal() {
    return this.lastOfferSignal;
  }


  connect() {

    if (this.socket && this.socket.connected) {
      return;
    }

    const token = localStorage.getItem('authToken');

    this.socket = io(this.URL, {
      transports: ['websocket'],
      auth: {
        token: token
      }
    });


    this.socket.on('video-signal', (data) => {
      this.handleSignal(data);
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

  }


  userOffline(): Observable<any> {

    return new Observable(observer => {
      this.socket.on('user_offline', (data) => {
        observer.next(data);
      })
    })
  };
  onlineStatus(): Observable<any> {
    return new Observable(observer => {

      this.socket.on('user_online', (data) => {
        observer.next(data);
      });

      this.socket.on('online-users', (data: any[]) => {
        if (Array.isArray(data)) {
          data.forEach(user => {
            observer.next(user);
          });
        }
      });

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
    return this.videoSignalSubject.asObservable();
  }


  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

}
