import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../features/auth/data/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private http: HttpClient, private authSer: AuthService) { }

  public prSubject = new Subject()
  public pro$ = this.prSubject.asObservable();

  setProjectId(projectId: string): void {
    localStorage.setItem('projectId', projectId);
  }

  getProjectId() {
    return localStorage.getItem('projectId');
  }

  getProject(projectId: string): Observable<any> {

    const workSpaceId = this.authSer.getWorkSpace()?._id || '';
    return this.http.get(`${environment.apiUserUrl}get-project?project_id=${projectId}&workspace_id=${workSpaceId}`);
  }

  //The bottom method is not shared one. It will be just used to create workspace.
  createWorkspace(workspaceName: string): Observable<any> {
    return this.http.post(`${environment.apiUserUrl}workspace`, { workspaceName });
  }

  selectWorkspace(workspaceId: string): Observable<any> {
    return this.http.get(`${environment.apiUserUrl}workspace?workspace_id=${workspaceId}`);
  }


  getNotifications(systemRole: string) {

    if (systemRole === 'company-user') {
      return this.http.get(`${environment.apiUserUrl}notifications`);

    } else {
      return this.http.get(`${environment.apiAdminUrl}notifications`);
    }
  }

  makeNotificationsAsRead(notificaionId: string | null = null, removeAll: boolean = false) {
    return this.http.patch(`${environment.apiUserUrl}notifications`, { notificaionId, removeAll });
  }
}
