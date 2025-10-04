import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Task } from '../../../../../core/domain/entities/task.model';
import { NotificationService } from '../../../../../core/data/notification.service';

interface projectStatType {
  status: boolean,
  result: {
    completed: Task[],
    dueSoon: Task[],
    epics: Task[],
    openTasks: Task[],
    overdue: Task[],
    unscheduled: Task[]
  }
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private toast = inject(NotificationService);


  getProjectStats(): Observable<projectStatType> {

    const projectId = localStorage.getItem('projectId');
    if (!projectId) {
      this.toast.showInfo('Create or select a project');
      return new Observable<projectStatType>(observer => observer.complete());
    }
    return this.http.get<projectStatType>(`${environment.apiUserUrl}dashboard/${projectId}`);
  }

  getActivities(): Observable<any> {

    const projectId = localStorage.getItem('projectId');
    return this.http.get(`${environment.apiUserUrl}activity?projectId=${projectId}`);
  }
}
