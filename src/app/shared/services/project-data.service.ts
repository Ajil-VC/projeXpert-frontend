import { Injectable } from '@angular/core';
import { Project } from '../../core/domain/entities/project.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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

  public delProject = new Subject<Project>();
  public delProject$ = this.delProject.asObservable();

  // setProjects(projects: Array<Project> | null): void {

  //   this.projects = projects;
  // }
  getProjectData(page: number = 1, filter: {
    active: boolean,
    archived: boolean,
    completed: boolean
  }) {

    const workSpace = this.service.getWorkSpace();
    const workSpaceId = workSpace?._id;

    return this.http.get<{ status: boolean, projects: Array<Project> | null, totalPages: number }>(`${environment.apiUserUrl}init-projects?workspace_id=${workSpaceId}&page=${page}&active=${filter.active}&archived=${filter.archived}&completed=${filter.completed}`);
  }

  updateProject(projectData: Project): Observable<{ status: boolean, data: Project }> {

    if (this.projects === null) {
      this.projects = []
    };

    const workSpaceId = this.service.getWorkSpace()?._id;
    return this.http.put<{ status: boolean, data: Project }>(`${environment.apiUserUrl}update-project`, { projectData, workSpaceId });

  }

  deleteProject(projectId: string): Observable<any> {
    const currWorkSpaceId = this.service.getWorkSpace()?._id;
    return this.http.delete(`${environment.apiUserUrl}delete-project/${projectId}/${currWorkSpaceId}`);
  }

  removeProject(project: Project) {

    const curProj = localStorage.getItem('projectId');
    if (curProj === project._id) {
      localStorage.removeItem('projectId');
    }

    this.delProject.next(project);

  }


}
