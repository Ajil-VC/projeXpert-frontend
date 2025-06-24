

export interface Message {

    _id: string,
    conversationId: string,
    senderId: string,
    receiverId: string,
    projectId: string,
    message: string,
    seen: boolean,

    type: 'text' | 'call',
    callStatus: 'started' | 'ended' | 'missed',
    duration: number,

    createdAt?: Date;
    updatedAt?: Date;

}