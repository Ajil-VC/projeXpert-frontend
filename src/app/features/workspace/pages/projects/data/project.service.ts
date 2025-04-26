import { Injectable } from '@angular/core';
import { ProjectsUseCase } from '../domain/projects.domain';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService implements ProjectsUseCase {

  constructor(
    private http: HttpClient) { }

  createProject(projectName: String, workSpace: String, priority: String): Observable<any> {
    return this.http.post(`${environment.apiUserUrl}create-project`, { projectName, workSpace, priority });
  }


  getProjectInitializingData(): Observable<any> {
    return this.http.get(`${environment.apiUserUrl}projects-initials`);
  }

}
