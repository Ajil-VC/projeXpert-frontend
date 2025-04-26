import { Injectable } from "@angular/core";
import { Observable } from "rxjs";



@Injectable({
    providedIn: 'root',

})


export abstract class ProjectsUseCase {

    abstract getProjectInitializingData(): Observable<any>;
    abstract createProject(projectName: String, workSpace: String, priority: String): Observable<any>;
}   