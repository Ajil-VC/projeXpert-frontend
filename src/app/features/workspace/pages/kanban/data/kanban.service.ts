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

  updateTaskDetails(formData: FormData): Observable<any> {

    return this.http.put(`${environment.apiUserUrl}update-task-details`, formData);
  }

  getAvailableSprints(): Observable<any> {
    const projectId = localStorage.getItem('projectId');
    return this.http.get(`${environment.apiUserUrl}get-sprints/${projectId}`);
  }


  completeSprint(completingSprintId: string, movingSprintId: string | null): Observable<any> {

    const projectId = localStorage.getItem('projectId');
    return this.http.put(`${environment.apiUserUrl}complete-sprint`, { completingSprintId, movingSprintId, projectId });
  }


  deleteAttachmentFromCloudinary(publicId: string, taskId: string): Observable<any> {
    return this.http.delete(`${environment.apiUserUrl}delete-attachment?publicId=${publicId}&taskId=${taskId}`);
  }

}
