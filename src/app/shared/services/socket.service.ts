import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket!: Socket;
  private readonly URL = environment.ultraBaseURL;
  constructor() { }

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

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

}
