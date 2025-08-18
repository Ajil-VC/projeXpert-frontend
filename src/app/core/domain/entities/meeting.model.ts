

import { User } from "./user.model";

export interface Meeting {
    _id: string;
    companyId: string;
    roomName: string;
    meetingDate: Date;
    meetingTime: string;
    recurring: boolean;
    description: string;
    members: User[];
    status: 'upcoming' | 'ongoing' | 'completed';
    createdBy: User;

    url: string;
    roomId: string;

    createdAt?: Date;
    updatedAt?: Date;
}