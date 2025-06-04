import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  companySubject = new BehaviorSubject(null);
  company$ = this.companySubject.asObservable();


  blockOrUnblockUser(userId: string, status: boolean): Observable<any> {
    return this.http.put(`${environment.apiAdminUrl}change-user-status`, { userId, status });
  }

}
