import { Injectable } from '@angular/core';
import { OtpUseCase, SignupUseCase, User, Workspace } from '../domain/auth.domain';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthResponse } from '../domain/auth.domain';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements SignupUseCase {


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
    this.currentUser = user;
  }

  getWorkSpace(): Workspace | null {
    return this.currentWorkspace;
  }
  setCurrentWorkSpace(workspace: Workspace): void {
    this.currentWorkspace = workspace;
  }
  //** For Initial loading **//
  //******************************//



  constructor(private http: HttpClient) { }

  signup(email: string): Observable<any> {

    return this.http.post(`${environment.apiUserUrl}signup`, { email });

  }

  createProfile(email: string, userName: string, passWord: string): Observable<any> {

    return this.http.post<AuthResponse>(`${environment.apiUserUrl}create-profile`, { email, userName, passWord })
      .pipe(
        tap(response => {
          localStorage.setItem('authToken', response.token);

          this.setCurrentUser(response.user);
          this.setCurrentWorkSpace(response.workSpace);

          this.userSubject.next(response.user);
          this.workspaceSubject.next(response.workSpace);

        })
      )
  }

  login(email: string, passWord: string): Observable<any> {
    return this.http.post<AuthResponse>(`${environment.apiUserUrl}login`, { email, passWord })
      .pipe(
        tap(response => {
          localStorage.setItem('authToken', response.token);
        })
      )
  }

}


@Injectable({
  providedIn: 'root'
})
export class AuthFlowService implements OtpUseCase {

  private email: string = '';

  constructor(private http: HttpClient) { }

  resendOtp(email: string): Observable<any> {
    return this.http.post(`${environment.apiUserUrl}resend-otp`, { email });
  }

  validateOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${environment.apiUserUrl}validate-otp`, { email, otp });
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