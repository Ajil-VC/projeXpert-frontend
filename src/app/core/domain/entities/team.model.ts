import { Roles } from "./roles.model";


export interface Team {

    _id: string;
    name: string;
    email: string,

    profilePicUrl: string,
    role: Roles,

    createdAt?: Date,
    updatedAt?: Date,

}