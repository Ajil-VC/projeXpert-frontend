import { Injectable } from '@angular/core';
import { Comment } from '../../../../core/domain/entities/task.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getCommentsForTask(taskId: string): Observable<any> {

    return this.http.get(`${environment.apiUserUrl}comments?task_id=${taskId}`);
  }

  addComment(comment: Comment): Observable<any> {
    const projectId = localStorage.getItem('projectId');
    return this.http.post(`${environment.apiUserUrl}comments`, { taskId: comment.taskId, content: comment.content, projectId });
  }

}
