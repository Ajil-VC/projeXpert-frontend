import { Team } from "./team.model";

export interface Conversation {

    _id: string,
    participants: Array<Team>,
    lastMessage: string,
    projectId : string,
    createdAt?: Date;
    updatedAt?: Date;

}