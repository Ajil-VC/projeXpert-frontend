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

export type StoryPoint = 0 | 1 | 2 | 3 | 5 | 8 | 13 | 21;

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

    storyPoints: StoryPoint;

    createdBy?: string | User;
    progress?: number;

    sprintId: string | Sprint;     // Logical grouping for sprints
    parentId: string | Task;     // for subtasks
    subtasks: Task[];
    projectId: string;
    createdAt: Date;
    updatedAt: Date;
    attachments?: Attachment[];
}