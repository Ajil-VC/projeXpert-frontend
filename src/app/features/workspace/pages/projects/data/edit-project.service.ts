import { Injectable } from '@angular/core';
import { EditProjectUseCase } from '../domain/projectEditing.domain';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EditProjectService implements EditProjectUseCase {

  constructor(private http: HttpClient) { }

  removeMember(userId: string, projectId: string): Observable<any> {

    return this.http.patch(`${environment.apiUserUrl}member`, { userId, projectId });
  }

  addMember(email: string, projectId: string, workSpaceId: string): Observable<any> {

    return this.http.post(`${environment.apiUserUrl}member`, { email, projectId, workSpaceId });

  }

  getProjectData(projectId: string): Observable<any> {
    return this.http.get(`${environment.apiUserUrl}project?project_id=${projectId}`);
  }

}
