import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../../features/auth/domain/auth.domain';
import { AuthService } from '../../features/auth/data/auth.service';
import { Project } from '../domain/entities/project.model';

@Injectable({
  providedIn: 'root'
})
export class GuardsService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getWorkSpaceData() {

    return this.http.get<AuthResponse>(`${environment.apiUserUrl}init-data`);
  }


  getProjectData() {


    const workSpace = this.authService.getWorkSpace();
    const workSpaceId = workSpace?._id;

    return this.http.get<{status:boolean, projects : Array<Project> | null}>(`${environment.apiUserUrl}init-projects?workspace_id=${workSpaceId}`);
  }
}
