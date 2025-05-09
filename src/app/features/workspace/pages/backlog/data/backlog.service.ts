import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Task } from '../../../../../core/domain/entities/task.model';

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

  private selectedEpicsSubject = new BehaviorSubject<Set<string>>(new Set());
  selectedEpics$ = this.selectedEpicsSubject.asObservable();

  public addIssueSubject = new Subject<Task>();
  public addIssue$ = this.addIssueSubject.asObservable();

  setEpicIds(epics : Set<string>){
    this.selectedEpicsSubject.next(epics);
  }
}
