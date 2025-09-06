import { Injectable } from '@angular/core';
import { EditProjectUseCase } from '../domain/projectEditing.domain';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Project } from '../../../../../core/domain/entities/project.model';

@Injectable({
  providedIn: 'root'
})
export class EditProjectService implements EditProjectUseCase {

  constructor(private http: HttpClient) { }

  removeMember(userId: string, projectId: string): Observable<any> {

    return this.http.patch(`${environment.apiUserUrl}member`, { userId, projectId });
  }

  addMember(email: string, projectId: string, workSpaceId: string, roleId: string): Observable<{ status: boolean, message: string, updatedProjectData: Project }> {

    return this.http.post<{
      status: boolean,
      message: string,
      updatedProjectData: Project
    }>(`${environment.apiUserUrl}member`, { email, projectId, workSpaceId, roleId });

  }

  getProjectData(projectId: string): Observable<any> {
    return this.http.get(`${environment.apiUserUrl}project?project_id=${projectId}`);
  }

}
