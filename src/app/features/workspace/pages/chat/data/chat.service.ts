import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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

  startConversation(userId: string): Observable<any> {
    const projectId = localStorage.getItem('projectId');
    return this.http.post(`${environment.apiUserUrl}start-conversation`, { userId, projectId });
  }

  getAvailableConversations(): Observable<any> {
    const projectId = localStorage.getItem('projectId');
    return this.http.get(`${environment.apiUserUrl}get-chats/${projectId}`);
  }

  retrieveMessages(convoId: string): Observable<any> {

    return this.http.get(`${environment.apiUserUrl}get-messages/${convoId}`);
  }

  sendMessage(convoId: string, recieverId: string, message: string): Observable<any> {
    const projecId = localStorage.getItem('projectId');
    return this.http.post(`${environment.apiUserUrl}send-message`, { projecId, convoId, recieverId, message });
  }

}
