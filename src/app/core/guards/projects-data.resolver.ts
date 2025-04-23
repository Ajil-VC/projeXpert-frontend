import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { GuardsService } from "../data/guards.service";
import { ProjectDataService } from "../../shared/services/project-data.service";


@Injectable({ providedIn: 'root' })
export class ProjectsData implements Resolve<any> {

    constructor(private guardService: GuardsService, private projectService: ProjectDataService) { }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        this.guardService.getProjectData().subscribe({
            next: (res) => {
                this.projectService.setProjects(res.projects);
            },
            error: (err) => {
                console.error(err);
            }
        })

    }

}
