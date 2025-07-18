import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root',

})


export abstract class EditProjectUseCase {

    abstract addMember(email: string, projectId: string, workSpaceId: string): Observable<any>;

    abstract removeMember(userId: string, projectId: string): Observable<any>;

    abstract getProjectData(projectId: string): Observable<any>;
}

