import { User } from "./user.model";

export interface TaskHistory {
    taskId: string,
    updatedBy: User,
    actionType: "ASSIGN" | "STATUS_CHANGE" | "DELETE_SUBTASK" | "CREATE_SUBTASK" | "UPDATED",
    details: {
        assignedTo?: User,
        oldStatus?: string,
        newStatus?: string,
        subtaskId?: string,
        subtaskTitle?: string,
        subtaskAssignee?: string
    },
    createdAt: Date
}