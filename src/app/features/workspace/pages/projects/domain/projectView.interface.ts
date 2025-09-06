import { Roles } from "../../../../../core/domain/entities/roles.model"


interface projectMember {
    _id: string,
    email: string,
    role: Roles
}

export interface projectView {
    _id?: string,
    name: string,
    status: string,
    priority: string,
    members: projectMember[]
};