import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamManagementService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {

    return this.http.get(`${environment.apiUserUrl}get-users`);
  }

  controlUser(userId: string, status: boolean | null, userRole: string): Observable<any> {
    return this.http.patch(`${environment.apiUserUrl}control-user`, { userId, status,userRole });
  }
}