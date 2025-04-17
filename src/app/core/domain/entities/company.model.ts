import { Workspace } from "./workspace.model";

export interface Company {

    name: String;
    email: String;
    plan: 'Free' | 'Pro' | 'Enterprise';
    defaultWorkspace: Workspace;
    workspaces: Array<Workspace>;

    createdAt?: Date;
    updatedAt?: Date;

}