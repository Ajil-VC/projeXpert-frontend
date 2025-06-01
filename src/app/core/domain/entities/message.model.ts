

export interface Message {

    _id: string,
    conversationId: string,
    senderId: string,
    receiverId: string,
    projectId: string,
    message: string,
    seen: boolean
    createdAt?: Date;
    updatedAt?: Date;

}