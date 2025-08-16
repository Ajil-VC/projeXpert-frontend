import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { User } from '../../../../core/domain/entities/user.model';

@Injectable({
  providedIn: 'root'
})
export class TeamManagementService {

  constructor(private http: HttpClient) { }

  getUsers(
    page: number,
    searchTerm: string = '',
    role: string = '',
    status: string = ''
  ): Observable<{ status: boolean, result: { users: User[], totalPages: number } }> {

    return this.http.get<{
      status: boolean,
      result: {
        users: User[],
        totalPages: number
      }
    }>(`${environment.apiUserUrl}get-users?page=${page}&searchTerm=${searchTerm}&role=${role}&status=${status}`);

  }

  controlUser(userId: string, status: boolean | null, userRole: string): Observable<any> {
    return this.http.patch(`${environment.apiUserUrl}control-user`, { userId, status, userRole });
  }
}