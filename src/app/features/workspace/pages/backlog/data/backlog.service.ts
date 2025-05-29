import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Task } from '../../../../../core/domain/entities/task.model';
import { Sprint } from '../../../../../core/domain/entities/sprint.model';

@Injectable({
  providedIn: 'root'
})
export class BacklogService {

  constructor(private http: HttpClient) { }

  createEpic(epicName: string, projectId: string): Observable<any> {

    return this.http.post(`${environment.apiUserUrl}create-epic`, { epicName, projectId });
  }


  createIssue(projectId: string, issueType: string, issueName: string, taskGroup: string, epicId: string = ''): Observable<any> {
    return this.http.post(`${environment.apiUserUrl}create-issue`, { projectId, issueType, issueName, taskGroup, epicId });
  }

  //This subject will be used to retrieve sprint data on the creation from backlog
  public addSprintSubject = new Subject<Sprint>();
  public addSprint$ = this.addSprintSubject.asObservable();

  //This subject will be used to pass the retrieved sprint array to backlog component
  public sprintSubject = new Subject<Sprint[]>();
  public sprint$ = this.sprintSubject.asObservable();

  getSprints(projectId: any = null): Observable<{ status: boolean, result: Sprint[] }> {
    if (!projectId) {
      projectId = localStorage.getItem('projectId');
    }
    return this.http.get<{ status: boolean, result: Sprint[] }>(`${environment.apiUserUrl}get-sprints/${projectId}`);
  }

  public addIssueSubject = new Subject<Task>();
  public addIssue$ = this.addIssueSubject.asObservable();

  private selectedEpicsSubject = new BehaviorSubject<Set<string>>(new Set());
  selectedEpics$ = this.selectedEpicsSubject.asObservable();

  setEpicIds(epics: Set<string>) {
    this.selectedEpicsSubject.next(epics);
  }


  assignIssue(issueId: string, assigneeId: string): Observable<any> {
    return this.http.patch(`${environment.apiUserUrl}assign-issue`, { issueId, assigneeId });
  }

  createSprint(issueIds: Array<string>): Observable<any> {
    const projectId = localStorage.getItem('projectId');
    return this.http.post(`${environment.apiUserUrl}create-sprint`, { projectId, issueIds });
  }

  dragDropUpdation(prevContainerId: string, containerId: string, movedTaskId: string): Observable<any> {
    return this.http.put(`${environment.apiUserUrl}update-task`, { prevContainerId, containerId, movedTaskId });
  }

  updateIssueStatus(taskId: string, status: string): Observable<any> {
    return this.http.put(`${environment.apiUserUrl}change-taskstatus`, { taskId, status });
  }

  startSprint(sprintId: string, sprintName: string, duration: number, startDate: Date): Observable<any> {
    return this.http.put(`${environment.apiUserUrl}start-sprint`, { sprintId, sprintName, duration, startDate });
  }

}
