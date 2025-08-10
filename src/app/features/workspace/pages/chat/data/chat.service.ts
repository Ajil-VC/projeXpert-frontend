import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  messagesSubject = new Subject();
  messages$ = this.messagesSubject.asObservable();

  chatSubject = new Subject();
  chat$ = this.chatSubject.asObservable();

  isChatOpened = new BehaviorSubject<boolean>(false);
  isChatOpened$ = this.isChatOpened.asObservable();

  startConversation(userId: string): Observable<any> {
    return this.http.post(`${environment.apiUserUrl}start-conversation`, { userId });
  }

  getAvailableConversations(): Observable<any> {

    return this.http.get(`${environment.apiUserUrl}get-chats`);
  }

  retrieveMessages(convoId: string): Observable<any> {

    return this.http.get(`${environment.apiUserUrl}get-messages/${convoId}`);
  }

  sendMessage(convoId: string, recieverId: string, message: string): Observable<any> {
    return this.http.post(`${environment.apiUserUrl}send-message`, { convoId, recieverId, message });
  }




}
