import { Team } from "./team.model";

export interface Conversation {

    _id: string,
    participants: Array<Team>,
    lastActivityType: 'call' | 'msg',
    callStatus: 'missed' | 'started' | 'ended',
    lastMessage: string,
    callerId: string,
    projectId: string,
    createdAt?: Date;
    updatedAt?: Date;

}