import { User } from "./user.model";

export interface Project {

    _id: string;
    name: string;
    workSpace: string;
    companyId: string;
    members: string[] | User[];
    status: 'active' | 'archived' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'critical';

    createdAt?: Date;
    updatedAt?: Date;
}