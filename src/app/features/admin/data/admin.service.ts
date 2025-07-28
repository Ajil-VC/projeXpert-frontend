import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SubscriptionPlan } from '../../../core/domain/entities/subscription.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  constructor(private http: HttpClient) { }

  companySubject = new BehaviorSubject(null);
  company$ = this.companySubject.asObservable();


  blockOrUnblockUser(userId: string, status: boolean): Observable<any> {
    return this.http.put(`${environment.apiAdminUrl}change-user-status`, { userId, status });
  }

  blockOrUnblockCompany(companyId: string, status: boolean): Observable<any> {
    return this.http.put(`${environment.apiAdminUrl}change-company-status`, { companyId, status });
  }

  getSubscriptionDetails(): Observable<any> {
    return this.http.get(`${environment.apiAdminUrl}get-subscriptions`);
  }

  createSubscriptionPlan(
    billingCycle: string,
    description: string,
    name: string,
    price: number,
    maxWorkspace: number,
    maxProjects: number,
    maxMembers: number,
    canUseVideoCall: string
  ): Observable<any> {
    return this.http.post(`${environment.apiAdminUrl}create-plan`, { billingCycle, description, name, price, maxWorkspace, maxProjects, maxMembers, canUseVideoCall });
  }

  deletePlan(planId: string): Observable<any> {
    return this.http.delete(`${environment.apiAdminUrl}delete-plan?plan_id=${planId}`);
  }

  getAvailablePlans(pageNum: number): Observable<any> {
    return this.http.get(`${environment.apiAdminUrl}get-plans?page_num=${pageNum}`);
  }

  changePlanStatus(planId: string): Observable<any> {
    return this.http.patch(`${environment.apiAdminUrl}change-plan-status`, { planId });
  }

}
