import { User } from "./user.model";


export interface Activity {
    _id: string;
    companyId: string;
    projectId: string;
    user: User;
    action: string;
    target: string;
    createdAt?: Date;
    updatedAt?: Date;
}