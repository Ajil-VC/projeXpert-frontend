export interface Workspace {
    _id: string;
    name: string;
    members: string[];
    companyId: string;
    projects: string[];
    currentProject: string;
}