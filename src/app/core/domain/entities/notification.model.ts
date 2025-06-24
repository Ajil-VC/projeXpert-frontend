

export interface Notification {
    _id: string,
    senderId: string,
    recieverId: string,
    type: "task" | "message",
    message: string,
    link: string,
    data: Object,
    read: boolean,
    createdAt: Date
}