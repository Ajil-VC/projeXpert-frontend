export interface Workspace {
    _id: String;
    name: String;
    members: Array<String>;
    companyId: String;
    projects: Array<string>;
    currentProject: String;
}