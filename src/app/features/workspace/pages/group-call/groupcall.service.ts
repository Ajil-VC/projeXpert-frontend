import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Meeting } from '../../../../core/domain/entities/meeting.model';

@Injectable({
  providedIn: 'root'
})
export class GroupcallService {

  constructor(private http: HttpClient) { }

  getZegoToken(): Observable<any> {
    return this.http.get(`${environment.apiUserUrl}get-zegotoken`);
  }

  createRoom(FormData: {
    roomName: any; meetingDate: any; meetingTime: any; description: any; members: string[], roomId: string, url: string;
  }): Observable<any> {
    return this.http.post(`${environment.apiUserUrl}create-room`, FormData);
  }

  upcomingMeetings(): Observable<{ status: boolean, data: Array<Meeting> }> {

    return this.http.get<{ status: boolean, data: Array<Meeting> }>(`${environment.apiUserUrl}get-upcoming-meetings`);
  }

  removeMeeting(meetId: string): Observable<any> {
    return this.http.delete(`${environment.apiUserUrl}remove-meeting?meetId=${meetId}`, {
      observe: 'response',
    });
  }

}
