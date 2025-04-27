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

  removeMember(email: string, projectId: string): Observable<any> {

    return this.http.patch(`${environment.apiUserUrl}remove-member`, { email, projectId });
  }

  addMember(email: string, projectId: string, workSpaceId: string): Observable<any> {

    return this.http.post(`${environment.apiUserUrl}add-member`, { email, projectId, workSpaceId });

  }

}
