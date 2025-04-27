import { Injectable } from '@angular/core';
import { OtpUseCase, RegisterUseCase } from '../domain/auth.domain';
import { User } from '../../../core/domain/entities/user.model';
import { Workspace } from '../../../core/domain/entities/workspace.model';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthResponse } from '../domain/auth.domain';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements RegisterUseCase {


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
    localStorage.setItem('role', user.role);
  }

  isAdmin() {
    const role = localStorage.getItem('role');
    return role === 'admin';
  }

  getWorkSpace(): Workspace | null {
    return this.currentWorkspace;
  }
  setCurrentWorkSpace(workspace: Workspace): void {

    this.workspaceSubject.next(workspace);
    this.currentWorkspace = workspace;
  }
  //** For Initial loading **//
  //******************************//



  constructor(private http: HttpClient, private router: Router) { }

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
    return this.http.post<AuthResponse>(`${environment.apiUserUrl}login`, { email, passWord })
      .pipe(
        tap(response => {

          if (!response.token) throw new Error('Token Missing');

          localStorage.setItem('authToken', response.token);
        })
      )
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);

    this.currentUser = null;
    this.currentWorkspace = null;

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

  changePassword(passWord: string): Observable<any> {
    return this.http.post(`${environment.apiUserUrl}change-password`, { passWord });
  }

}