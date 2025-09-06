import { Injectable } from '@angular/core';
import { OtpUseCase, RegisterUseCase } from '../domain/auth.domain';
import { User } from '../../../core/domain/entities/user.model';
import { Workspace } from '../../../core/domain/entities/workspace.model';
import { BehaviorSubject, Observable, of, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthResponse } from '../domain/auth.domain';
import { Router } from '@angular/router';
import { LayoutService } from '../../../shared/services/layout.service';
import { Project } from '../../../core/domain/entities/project.model';
import { SharedService } from '../../../shared/services/shared.service';
import { Permissions, Roles } from '../../../core/domain/entities/roles.model';
import { PermissionsService } from '../../../shared/utils/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements RegisterUseCase {

  private logoutSubject = new Subject<void>();
  logout$ = this.logoutSubject.asObservable();

  //******************************//
  //** For Initial loading **//
  private currentUser: User | null = null;
  private currentWorkspace: Workspace | null = null;

  private userSubject = new BehaviorSubject<User | null>(null);
  private workspaceSubject = new BehaviorSubject<Workspace | null>(null);


  user$ = this.userSubject.asObservable();
  workSpace$ = this.workspaceSubject.asObservable();

  getCurrentUser(): User | null {
    return this.currentUser;
  }
  setCurrentUser(user: User): void {
    this.userSubject.next(user);
    this.currentUser = user;
    this.permission.setPermissions((user.role as unknown as Roles).permissions)
  }


  getWorkSpace(): Workspace | null {
    return this.currentWorkspace;
  }
  setCurrentWorkSpace(workspace: Workspace): void {

    this.workspaceSubject.next(workspace);
    this.currentWorkspace = workspace;

    const currentProjectId = localStorage.getItem('projectId');

    if (!currentProjectId) {
      const curProj = workspace.projects[0] as unknown as Project || null;

      if (curProj) {
        localStorage.setItem('projectId', curProj._id as string);
      }

      this.shared.curProject.next(curProj);
      return;
    }

    const workspaceWithProjects = (workspace.projects as unknown as Project[])
      .filter(ele => ele._id === currentProjectId);
    this.shared.curProject.next(workspaceWithProjects[0]);

  }
  //** For Initial loading **//
  //******************************//



  constructor(private http: HttpClient, private router: Router, private shared: SharedService, private permission: PermissionsService) { }

  signup(email: string): Observable<any> {

    return this.http.post(`${environment.apiCompanyUrl}register`, { email });

  }

  createCompany(email: string, companyName: string, passWord: string): Observable<any> {

    return this.http.post<AuthResponse>(`${environment.apiCompanyUrl}create-company`, { email, companyName, passWord })
      .pipe(
        tap(response => {

          if (!response.token) throw new Error('Token Missing');
          localStorage.setItem('authToken', response.token);
        })
      )
  }

  login(email: string, passWord: string): Observable<any> {
    return this.http.post<AuthResponse>(`${environment.apiUserUrl}login`, { email, passWord }, { withCredentials: true })
      .pipe(
        tap(response => {
          if (!response.token) throw new Error('Token Missing');

          localStorage.setItem('forceChangePass', String(response.forceChangePassword));
          localStorage.setItem('authToken', response.token);

        })
      )
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${environment.apiUserUrl}refresh-token`, null, {
      withCredentials: true
    }).pipe(
      tap((res: any) => {
        localStorage.setItem('authToken', res.token)
      })
    )
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('forceChangePass');
    localStorage.removeItem('role');
    localStorage.removeItem('projectId');
    this.permission.clear();
    this.router.navigate(['/login']);

    this.currentUser = null;
    this.currentWorkspace = null;
    this.logoutSubject.next();
    this.userSubject.next(null);
  }

}


@Injectable({
  providedIn: 'root'
})
export class AuthFlowService implements OtpUseCase {

  private email: string = '';

  constructor(private http: HttpClient) { }

  resendOtp(email: string): Observable<any> {
    return this.http.post(`${environment.apiCompanyUrl}resend-otp`, { email });
  }

  validateOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${environment.apiCompanyUrl}validate-otp`, { email, otp });
  }


  setEmail(email: string) {
    this.email = email;
  }

  getEmail() {
    return this.email;
  }

  clearEmail() {
    this.email = '';
  }
}

@Injectable({
  providedIn: 'root'
})
export class PswdChangeService {

  constructor(private http: HttpClient) { }

  changePassword(oldPassword: string, passWord: string): Observable<any> {
    return this.http.post(`${environment.apiUserUrl}change-password`, { passWord, oldPassword });
  }

}