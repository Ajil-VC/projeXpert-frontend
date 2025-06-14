import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Task } from '../../../../../core/domain/entities/task.model';

@Injectable({
  providedIn: 'root'
})
export class KanbanService {

  constructor(private http: HttpClient) { }

  updateTaskDetails(taskData: Task, assigneeId: string): Observable<any> {

    return this.http.put(`${environment.apiUserUrl}update-task-details`, { taskData, assigneeId });
  }

  getAvailableSprints(): Observable<any> {
    const projectId = localStorage.getItem('projectId');
    return this.http.get(`${environment.apiUserUrl}get-sprints/${projectId}`);
  }


  completeSprint(completingSprintId: string, movingSprintId: string | null): Observable<any> {

    const projectId = localStorage.getItem('projectId');
    return this.http.put(`${environment.apiUserUrl}complete-sprint`, { completingSprintId, movingSprintId, projectId });
  }

}
