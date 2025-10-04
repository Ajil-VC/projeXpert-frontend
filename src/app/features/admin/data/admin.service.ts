import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SummaryCard } from '../../workspace/pages/dashboard/domain/dashboard.domain';
import { Company } from '../../../core/domain/entities/company.model';
import { User } from '../../../core/domain/entities/user.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);


  companySubject = new BehaviorSubject(null);
  company$ = this.companySubject.asObservable();

  getDashBoardData(): Observable<{
    status: boolean,
    result: {
      barChartData: number[],
      summaryCards: SummaryCard[],
      doughnutChart: {
        data: number[],
        labels: string[]
      },
      top5Companiesdata: {
        totalAmount: number,
        subscriptionCount: number,
        companyId: any,
        companyName: string
      }[],
      largestEmployer: {
        employerCount: number,
        email: string,
        companyName: string
      }[]
    }
  }> {
    return this.http.get<{
      status: boolean,
      result: {
        barChartData: number[],
        summaryCards: SummaryCard[],
        doughnutChart: {
          data: number[],
          labels: string[]
        },
        top5Companiesdata: {
          totalAmount: number,
          subscriptionCount: number,
          companyId: any,
          companyName: string
        }[],
        largestEmployer: {
          employerCount: number,
          email: string,
          companyName: string
        }[]
      }
    }>(`${environment.apiAdminUrl}dashboard`);
  }

  blockOrUnblockUser(userId: string, status: boolean): Observable<any> {
    return this.http.put(`${environment.apiAdminUrl}change-user-status`, { userId, status });
  }

  blockOrUnblockCompany(companyId: string, status: boolean): Observable<any> {
    return this.http.put(`${environment.apiAdminUrl}change-company-status`, { companyId, status });
  }

  getSubscriptionDetails(searchTerm: string, sort: 1 | -1, page: number): Observable<{
    status: boolean, result: { subscriptions: any, totalPage: number }
  }> {
    return this.http.get<{
      status: boolean,
      result: {
        subscriptions: any,
        totalPage: number
      }
    }>(`${environment.apiAdminUrl}subscriptions?searchTerm=${searchTerm}&sort=${sort}&page=${page}`);
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
    return this.http.post(`${environment.apiAdminUrl}plans`, { billingCycle, description, name, price, maxWorkspace, maxProjects, maxMembers, canUseVideoCall });
  }

  deletePlan(planId: string): Observable<{ status: boolean, message: string }> {
    return this.http.delete<{ status: boolean, message: string }>(`${environment.apiAdminUrl}plans?plan_id=${planId}`);
  }

  getAvailablePlans(pageNum: number, searchTerm = ''): Observable<any> {
    return this.http.get(`${environment.apiAdminUrl}plans?page_num=${pageNum}&searchTerm=${searchTerm}`);
  }

  changePlanStatus(planId: string): Observable<any> {
    return this.http.patch(`${environment.apiAdminUrl}plans`, { planId });
  }

  getRevenueReport(filter: 'month' | 'year' | 'date', plans: string[], startDate?: Date, endDate?: Date): Observable<any> {
    return this.http.get(`${environment.apiAdminUrl}revenue?filter=${filter}&startDate=${startDate}&endDate=${endDate}&plans=${plans}`);
  }

  getCompleteCompanyDetails(pageNum = 1, searchTerm = ''): Observable<{
    message: string,
    companyData: {
      companyDetails: Company,
      users: User[],
      companyId: string
    }[],
    totalPages: number,
    status: boolean
  }> {
    return this.http.get<{
      message: string,
      companyData: {
        companyDetails: Company,
        users: User[],
        companyId: string
      }[],
      totalPages: number,
      status: boolean
    }>(`${environment.apiAdminUrl}admin-init?page_num=${pageNum}&searchTerm=${searchTerm}`);
  }

}

