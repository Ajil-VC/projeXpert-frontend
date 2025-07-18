import { Workspace } from "./workspace.model";


export interface Attachment {
    public_id: string;
    url: string;
}

export interface User {
    _id: string;
    name: string;
    profilePicUrl: Attachment;
    email: string;
    plan: string;
    role: string;
    isBlocked: boolean;
    defaultWorkspace: Workspace;
    workSpaces: Array<Workspace>;
    forceChangePassword?: boolean;
}