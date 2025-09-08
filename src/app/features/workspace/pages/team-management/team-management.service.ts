import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { User } from '../../../../core/domain/entities/user.model';
import { Roles } from '../../../../core/domain/entities/roles.model';

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

  updateUserRoleAndStatus(userId: string, userRole: string, blockedStatus: boolean | null = null): Observable<any> {
    return this.http.patch(`${environment.apiUserUrl}control-user`, { userId, userRole, blockedStatus });
  }

  createOrUpdateRole(
    formData: { roleName: string, permissions: Array<string>, description: string },
    role: Roles | null): Observable<{ message: string, result: Roles, status: boolean }> {

    if (!role) {

      return this.http.post<{ message: string, result: Roles, status: boolean }>(`${environment.apiUserUrl}roles`, formData);
    } else {
      return this.http.put<{ message: string, result: Roles, status: boolean, updated: boolean }>(`${environment.apiUserUrl}roles`, { formData, roleId: role._id });
    }
  }

  getRoles(): Observable<{ message: string, result: Array<Roles>, status: boolean }> {
    return this.http.get<{ message: string, result: Array<Roles>, status: boolean }>(`${environment.apiUserUrl}roles`);
  }

  deleteRole(roleId: string): Observable<{ status: boolean, message: string }> {
    return this.http.delete<{ status: boolean, message: string }>(`${environment.apiUserUrl}roles?roleId=${roleId}`);
  }

}