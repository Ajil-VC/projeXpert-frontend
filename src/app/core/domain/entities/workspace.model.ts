import { Project } from "./project.model";

export interface Workspace<TPopulated extends boolean = false> {
    _id: string;
    name: string;
    members: string[];
    companyId: string;
    projects: TPopulated extends true ? Project[] : string[];
    currentProject: string;
}