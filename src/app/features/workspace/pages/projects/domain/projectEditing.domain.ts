import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Project } from "../../../../../core/domain/entities/project.model";


@Injectable({
    providedIn: 'root',

})


export abstract class EditProjectUseCase {

    abstract addMember(email: string, projectId: string, workSpaceId: string, roleId: string): Observable<{ status: boolean, message: string, updatedProjectData: Project }>;

    abstract removeMember(userId: string, projectId: string): Observable<any>;

    // abstract getProjectData(projectId: string): Observable<any>;
}

