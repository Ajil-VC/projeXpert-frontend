import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Team } from '../../core/domain/entities/team.model';
import { Project } from '../../core/domain/entities/project.model';
import { Task } from '../../core/domain/entities/task.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient) { }

  activeChatUserId: string = '';

  public curProject = new BehaviorSubject<Project | null>(null);
  public currentPro$ = this.curProject.asObservable();

  public tasksSubject = new Subject<Task>();
  public taskSub$ = this.tasksSubject.asObservable();

  getTasksInProject(): Observable<any> {
    const projectId = localStorage.getItem('projectId');
    return this.http.get(`${environment.apiUserUrl}tasks?projectId=${projectId}`);
  }

  getTasksInActiveSprints(): Observable<any> {

    const projectId = localStorage.getItem('projectId');
    return this.http.get(`${environment.apiUserUrl}tasks/kanban?projectId=${projectId}`);

  }


  private teamMembersSubject = new BehaviorSubject<{ status: boolean, message: string, data: Team[] }>({ status: false, message: 'No team data', data: [] });
  teamMembers$ = this.teamMembersSubject.asObservable();

  fetchTeamMembers() {
    const projectId = localStorage.getItem('projectId');
    this.http.get(`${environment.apiUserUrl}team?projectId=${projectId}`)
      .subscribe(data => this.teamMembersSubject.next(data as { status: boolean, message: string, data: Team[] }));
  }

  getTeamMembers(): Observable<{ status: boolean, message: string, data: Team[] }> {
    const projectId = localStorage.getItem('projectId');
    return this.http.get<{ status: boolean, message: string, data: Team[] }>(`${environment.apiUserUrl}team?projectId=${projectId}`)
    // .subscribe(data => this.teamMembersSubject.next(data as { status: boolean, message: string, data: Team[] }));
  }


}
