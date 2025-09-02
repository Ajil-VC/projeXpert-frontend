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
    roomName: any; meetingDate: any; meetingTime: any; recurring: boolean; description: any; members: string[], roomId: string, url: string;
  }): Observable<any> {
    return this.http.post(`${environment.apiUserUrl}create-room`, FormData);
  }

  upcomingMeetings(pageNum: number = 1, searchTerm: string = ''): Observable<{ status: boolean, meetings: Array<Meeting>, totalPages: number }> {

    return this.http.get<{ status: boolean, meetings: Array<Meeting>, totalPages: number }>(`${environment.apiUserUrl}get-upcoming-meetings?page_num=${pageNum}&searchTerm=${searchTerm}`);
  }

  removeMeeting(meetId: string): Observable<any> {
    return this.http.delete(`${environment.apiUserUrl}remove-meeting?meetId=${meetId}`, {
      observe: 'response',
    });
  }

}
