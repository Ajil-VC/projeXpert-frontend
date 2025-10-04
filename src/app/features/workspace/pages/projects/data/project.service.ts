import { Injectable, inject } from '@angular/core';
import { ProjectsUseCase } from '../domain/projects.domain';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService implements ProjectsUseCase {
  private http = inject(HttpClient);



  createProject(projectName: string, workSpace: string, priority: string): Observable<any> {
    return this.http.post(`${environment.apiUserUrl}project`, { projectName, workSpace, priority });
  }


  getProjectInitializingData(): Observable<any> {
    return this.http.get(`${environment.apiUserUrl}projects-initials`);
  }

}
