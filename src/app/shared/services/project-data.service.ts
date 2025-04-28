import { Injectable } from '@angular/core';
import { Project } from '../../core/domain/entities/project.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../features/auth/data/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {

  constructor(
    private http: HttpClient,
    private service: AuthService
  ) { }

  private projects!: Array<Project> | null;
  private projectSubject = new BehaviorSubject<Array<Project> | null>(null);
  project$ = this.projectSubject.asObservable();

  setProjects(projects: Array<Project> | null): void {

    this.projectSubject.next(projects);
    this.projects = projects;
  }

  updateProject(projectData: Project): Observable<any> {

    if (this.projects === null) {
      this.projects = []
    };

    const workSpaceId = this.service.getWorkSpace()?._id;
    return this.http.put(`${environment.apiUserUrl}update-project`, { projectData, workSpaceId });

  }

  deleteProject(projectId : string):Observable<any>{
    const currWorkSpaceId  = this.service.getWorkSpace()?._id;
    return this.http.delete(`${environment.apiUserUrl}delete-project/${projectId}/${currWorkSpaceId}`);
  }


  

}
