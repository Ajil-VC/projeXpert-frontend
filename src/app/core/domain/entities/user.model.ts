import { Workspace } from "./workspace.model"; 

export interface User {
    name: string;
    profileUrl: string;
    email: string;
    plan: string;
    role: string;
    workSpaces: Array<Workspace>;
}