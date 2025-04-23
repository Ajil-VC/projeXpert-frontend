import { Injectable } from '@angular/core';
import { Project } from '../../core/domain/entities/project.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {

  constructor() { }

  private projects! : Array<Project> | null;
  private projectSubject = new BehaviorSubject<Array<Project> | null>(null);
  project$ = this.projectSubject.asObservable();

  setProjects(projects : Array<Project> | null): void {

    this.projectSubject.next(projects);
    this.projects = projects;
  }

}
