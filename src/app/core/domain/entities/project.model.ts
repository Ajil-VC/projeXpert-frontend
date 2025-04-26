export interface Project {

    _id: String;
    name: String;
    workSpace: String;
    companyId: String;
    members: Array<String> | Array<{ email: string, role: "admin" | "user" }>;
    status: 'active' | 'archived' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'critical';

    createdAt?: Date;
    updatedAt?: Date;
}