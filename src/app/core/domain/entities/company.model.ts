import { Workspace } from "./workspace.model";

export interface Company {

    _id : string;
    name: String;
    email: String;
    plan: 'Free' | 'Pro' | 'Enterprise';
    defaultWorkspace: Workspace;
    workspaces: Array<Workspace>;

    isBlocked : boolean,

    createdAt?: Date;
    updatedAt?: Date;

}