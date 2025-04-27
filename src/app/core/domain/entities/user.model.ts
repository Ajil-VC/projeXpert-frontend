import { Workspace } from "./workspace.model";

export interface User {
    _id : string;
    name: string;
    profileUrl: string;
    email: string;
    plan: string;
    role: string;
    defaultWorkspace: Workspace;
    workSpaces: Array<Workspace>;
    forceChangePassword?: boolean;
}