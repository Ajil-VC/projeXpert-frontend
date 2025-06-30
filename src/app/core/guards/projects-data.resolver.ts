import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { GuardsService } from "../data/guards.service";
import { ProjectDataService } from "../../shared/services/project-data.service";
import { catchError, Observable, of, tap } from "rxjs";
import { NotificationService } from "../data/notification.service";


@Injectable({ providedIn: 'root' })
export class ProjectsData implements Resolve<any> {

    constructor(private guardService: GuardsService, private projectService: ProjectDataService, private toast: NotificationService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        return this.guardService.getProjectData().pipe(

            tap((res) => {

                this.projectService.setProjects(res.projects);
            }),
            catchError((err) => {

                this.toast.showError('Failed to fetch the project data');
                return of(null);

            })

        )

    }

}
