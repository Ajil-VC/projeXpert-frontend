import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient) { }

  public curProject = new Subject();
  public currentPro$ = this.curProject.asObservable();

  public tasksSubject = new Subject();
  public taskSub$ = this.tasksSubject.asObservable();

  getTasksInProject(): Observable<any> {
    const projectId = localStorage.getItem('projectId');
    return this.http.get(`${environment.apiUserUrl}tasks?projectId=${projectId}`);
  }

  getTeamMembers(): Observable<any> {
    const projectId = localStorage.getItem('projectId');
    return this.http.get(`${environment.apiUserUrl}team?projectId=${projectId}`);
  }

}
