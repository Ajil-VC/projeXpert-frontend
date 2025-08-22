import { Sprint } from "./sprint.model";
import { Team } from "./team.model";
import { User } from "./user.model";



export interface Comment {

    taskId: string,
    userId?: string | User,
    content: string,
    createdAt?: Date;
    updatedAt?: Date;
}


export interface Attachment {
    public_id: string;
    url: string;
}

export interface Task {

    _id: string;
    title: string;
    description: string;
    type: "task" | "epic" | "story" | "subtask" | "bug";
    status: "in-progress" | "todo" | "done";
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignedTo: string | Team;

    epicId: string | Task;       // Refers to a parent epic if any
    startDate?: Date; // Only for epics (epic timeframe)
    endDate?: Date;   // Only for epics

    createdBy?: string | User;
    progress?: number;

    sprintId: string | Sprint;     // Logical grouping for sprints
    parentId: string | Task;     // for subtasks
    projectId: string;
    createdAt: Date;
    updatedAt: Date;
    attachments?: Attachment[];
}