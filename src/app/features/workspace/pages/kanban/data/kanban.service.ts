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

  updateTaskDetails(formData: FormData, skipStatus?: boolean): Observable<any> {

    return this.http.put(`${environment.apiUserUrl}update-task-details?skipStatus=${skipStatus}`, formData);
  }

  createSubTask(title: string, parentId: string): Observable<{ status: boolean, result: Task }> {
    const projectId = localStorage.getItem('projectId');
    return this.http.post<{ status: boolean, result: Task }>(`${environment.apiUserUrl}subtask`, { title, parentId, projectId });
  }

  removeSubtask(subtaskId: string): Observable<{ status: boolean }> {
    return this.http.delete<{ status: boolean }>(`${environment.apiUserUrl}task/${subtaskId}`);
  }

  getSubtasks(parentId: string): Observable<{ status: boolean, result: Task[] }> {
    return this.http.get<{ status: boolean, result: Task[] }>(`${environment.apiUserUrl}subtask/${parentId}`);
  }

  getAvailableSprints(): Observable<any> {
    const projectId = localStorage.getItem('projectId');
    return this.http.get(`${environment.apiUserUrl}sprints/${projectId}`);
  }


  completeSprint(completingSprintId: string, movingSprintId: string | null): Observable<any> {

    const projectId = localStorage.getItem('projectId');
    return this.http.put(`${environment.apiUserUrl}complete-sprint`, { completingSprintId, movingSprintId, projectId });
  }


  deleteAttachmentFromCloudinary(publicId: string, taskId: string): Observable<any> {
    return this.http.delete(`${environment.apiUserUrl}delete-attachment?publicId=${publicId}&taskId=${taskId}`);
  }

  assignIssue(issueId: string, assigneeId: string): Observable<{ data: Task, message: string, status: boolean }> {
    return this.http.patch<{ data: Task, message: string, status: boolean }>(`${environment.apiUserUrl}issue`, { issueId, assigneeId });
  }

  updateIssueStatus(taskId: string, status: string): Observable<{ status: boolean, message: string, result: Task }> {
    return this.http.put<{ status: boolean, message: string, result: Task }>(`${environment.apiUserUrl}change-taskstatus`, { taskId, status });
  }

  getTaskHistory(taskId: string): Observable<any> {
    return this.http.get(`${environment.apiUserUrl}task-history?taskId=${taskId}`);
  }

}
