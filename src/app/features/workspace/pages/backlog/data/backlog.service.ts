import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { StoryPoint, Task } from '../../../../../core/domain/entities/task.model';
import { Sprint } from '../../../../../core/domain/entities/sprint.model';
import { LayoutService } from '../../../../../shared/services/layout.service';
import { NotificationService } from '../../../../../core/data/notification.service';

@Injectable({
  providedIn: 'root'
})
export class BacklogService {

  constructor(private http: HttpClient, private layoutSer: LayoutService, private toast: NotificationService) { }

  createOrUpdateEpic(title: string, description: string, startDate: string, endDate: string, status: string, epic: Task | null): Observable<any> {

    if (!epic) {
      const projectId = this.layoutSer.getProjectId();
      return this.http.post(`${environment.apiUserUrl}epic`, { title, description, startDate, endDate, projectId });
    } else {
      return this.http.put(`${environment.apiUserUrl}epic`, { title, description, startDate, endDate, status, epicId: epic._id });
    }
  }


  createIssue(projectId: string, issueType: string, issueName: string, taskGroup: string, epicId: string = ''): Observable<any> {
    return this.http.post(`${environment.apiUserUrl}issue`, { projectId, issueType, issueName, taskGroup, epicId });
  }

  //This subject will be used to retrieve sprint data on the creation from backlog
  public addSprintSubject = new Subject<Sprint>();
  public addSprint$ = this.addSprintSubject.asObservable();

  //This subject will be used to pass the retrieved sprint array to backlog component
  public sprintSubject = new Subject<Sprint[]>();
  public sprint$ = this.sprintSubject.asObservable();

  getSprints(projectId: string | null = null): Observable<{ status: boolean, result: Sprint[] }> {
    if (!projectId) {
      projectId = localStorage.getItem('projectId');
    }
    if (!projectId) {
      this.toast.showInfo("Create or select a project");
      return new Observable<{ status: boolean, result: Sprint[] }>(observer => {
        observer.next({ status: false, result: [] });
        observer.complete();
      });
    }
    return this.http.get<{ status: boolean, result: Sprint[] }>(`${environment.apiUserUrl}sprints/${projectId}`);
  }

  public addIssueSubject = new Subject<Task>();
  public addIssue$ = this.addIssueSubject.asObservable();

  private selectedEpicsSubject = new BehaviorSubject<Set<string>>(new Set());
  selectedEpics$ = this.selectedEpicsSubject.asObservable();

  setEpicIds(epics: Set<string>) {
    this.selectedEpicsSubject.next(epics);
  }


  assignIssue(issueId: string, assigneeId: string): Observable<any> {
    return this.http.patch(`${environment.apiUserUrl}issue`, { issueId, assigneeId });
  }

  createSprint(issueIds: Array<string>): Observable<any> {
    const projectId = localStorage.getItem('projectId');
    return this.http.post(`${environment.apiUserUrl}sprints`, { projectId, issueIds });
  }

  dragDropUpdation(prevContainerId: string, containerId: string, movedTaskId: string): Observable<any> {
    return this.http.put(`${environment.apiUserUrl}update-task`, { prevContainerId, containerId, movedTaskId });
  }

  updateIssueStatus(taskId: string, status: string): Observable<any> {
    return this.http.put(`${environment.apiUserUrl}change-taskstatus`, { taskId, status });
  }

  startSprint(sprintId: string, sprintName: string, duration: number, startDate: Date, goal: string, description: string): Observable<any> {
    const projectId = this.layoutSer.getProjectId();
    return this.http.put(`${environment.apiUserUrl}sprints`, { sprintId, sprintName, duration, startDate, projectId, goal, description });
  }

  updateStoryPoint(storyPoints: number, taskId: string): Observable<{ status: boolean, message: string, result: Task }> {
    return this.http.put<{ status: boolean, message: string, result: Task }>(`${environment.apiUserUrl}story-points`, { storyPoints, taskId });
  }

}
