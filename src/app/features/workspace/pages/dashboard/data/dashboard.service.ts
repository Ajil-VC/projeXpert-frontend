import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Task } from '../../../../../core/domain/entities/task.model';
import { NotificationService } from '../../../../../core/data/notification.service';

interface projectStatType {
  status: boolean,
  result: {
    completed: Array<Task>,
    dueSoon: Array<Task>,
    epics: Array<Task>,
    openTasks: Array<Task>,
    overdue: Array<Task>,
    unscheduled: Array<Task>
  }
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private toast: NotificationService) { }

  getProjectStats(): Observable<projectStatType > {

    const projectId = localStorage.getItem('projectId');
    if (!projectId) {
      this.toast.showInfo('Create or select a project');
      return new Observable<projectStatType>(observer => observer.complete());
    }
    return this.http.get<projectStatType>(`${environment.apiUserUrl}dashboard/${projectId}`);
  }
}
