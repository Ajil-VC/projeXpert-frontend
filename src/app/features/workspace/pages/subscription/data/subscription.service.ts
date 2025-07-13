import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient) { }

  checkout(priceId: string): Observable<any> {

    return this.http.post(`${environment.apiUserUrl}checkout`, { priceId });
  }

  getSessionDetails(sessionId: string): Observable<any> {

    return this.http.get(`${environment.apiUserUrl}stripe/session/${sessionId}`);
  }

  getSubscriptionDetails(): Observable<any> {
    return this.http.get(`${environment.apiUserUrl}subscription`);
  }
}
