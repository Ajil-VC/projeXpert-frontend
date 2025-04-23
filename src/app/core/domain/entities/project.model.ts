export interface Project{

    _id: String;
    name: String;
    workSpace: String;
    companyId: String;
    members: Array<String>;
    status: 'active' | 'archived' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'critical';

    createdAt?: Date;
    updatedAt?: Date;
}