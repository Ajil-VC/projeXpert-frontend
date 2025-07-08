import { User } from "./user.model";

export interface Project {

    _id: String;
    name: String;
    workSpace: String;
    companyId: String;
    // members: Array<String> | Array<{ id: string, email: string, role: "admin" | "user" }>;
    members: Array<String> | Array<User>;
    status: 'active' | 'archived' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'critical';

    createdAt?: Date;
    updatedAt?: Date;
}