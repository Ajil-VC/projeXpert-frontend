import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Team } from '../../core/domain/entities/team.model';
import { Project } from '../../core/domain/entities/project.model';
import { Task } from '../../core/domain/entities/task.model';
import { NotificationService } from '../../core/data/notification.service';
import { Sprint } from '../../core/domain/entities/sprint.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private reloadSubject = new Subject<boolean>();
  reload$ = this.reloadSubject.asObservable();

  reloadPage() {
    this.reloadSubject.next(true);
  }

  constructor(private http: HttpClient, private toast: NotificationService) { }

  activeChatUserId: string = '';

  public curProject = new BehaviorSubject<Project | null>(null);
  public currentPro$ = this.curProject.asObservable();

  setProject(projectId: string) {
    if (!projectId) {
      localStorage.removeItem('projectId');
      return;
    }
    localStorage.setItem('projectId', projectId);
  }

  public tasksSubject = new Subject<Task>();
  public taskSub$ = this.tasksSubject.asObservable();
  public taskUpdateSubject = new Subject<Task>();
  public taskUpdate$ = this.taskUpdateSubject.asObservable();

  getTasksInProject(): Observable<any> {
    const projectId = localStorage.getItem('projectId');
    if (!projectId) {
      this.toast.showInfo('Create or select a project');
      return of({ status: false, result: [] });
    }
    return this.http.get(`${environment.apiUserUrl}tasks?projectId=${projectId}`);
  }

  getTasksInActiveSprints(): Observable<any> {

    const projectId = localStorage.getItem('projectId');
    if (!projectId) {
      this.toast.showInfo('Create or select a project');
      return of({ status: false, result: null });;
    }

    return this.http.get(`${environment.apiUserUrl}tasks/kanban?projectId=${projectId}`);

  }

  completedSprintData(): Observable<{ status: boolean, message: string, result: Array<Sprint> | null }> {

    const projectId = localStorage.getItem('projectId');
    if (!projectId) {
      this.toast.showInfo('Create or select a project');
      return of({ status: false, message: '', result: null });
    }
    return this.http.get<{ status: boolean, message: string, result: Array<Sprint> | null }>(`${environment.apiUserUrl}completed-sprints?projectId=${projectId}`);
  }

  getSprintWithTasks(sprintId: string, activeSprint?: boolean): Observable<{ status: boolean, message: string, result: Sprint, code:  string }> {

    let projectId = null;
    if (activeSprint) {
      projectId = localStorage.getItem('projectId');
      sprintId = 'active_sprint'
    }

    return this.http.get<{
      status: boolean,
      message: string,
      result: Sprint,
      code:  string
    }>(`${environment.apiUserUrl}tasks/sprint/${sprintId}?projectId=${projectId}`);
  }


  private teamMembersSubject = new BehaviorSubject<{ status: boolean, message: string, data: Team[] }>({ status: false, message: 'No team data', data: [] });
  teamMembers$ = this.teamMembersSubject.asObservable();

  fetchTeamMembers() {

    const projectId = localStorage.getItem('projectId');
    if (!projectId) {
      this.toast.showInfo('Create or select a project');
      return;
    }
    this.http.get(`${environment.apiUserUrl}team?projectId=${projectId}`)
      .subscribe(data => this.teamMembersSubject.next(data as { status: boolean, message: string, data: Team[] }));
  }

  getTeamMembers(): Observable<{ status: boolean, message: string, data: Team[] }> {
    const projectId = localStorage.getItem('projectId');
    if (!projectId) {
      this.toast.showInfo('Create or select a project');
      return new Observable<any>(observer => observer.complete());
    }
    return this.http.get<{ status: boolean, message: string, data: Team[] }>(`${environment.apiUserUrl}team?projectId=${projectId}`)

  }


}
