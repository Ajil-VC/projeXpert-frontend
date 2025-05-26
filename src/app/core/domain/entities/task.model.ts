import { Team } from "./team.model";


export interface Task {

    _id: string;
    title: string;
    description: string;
    type: "task" | "epic" | "story" | "subtask" | "bug";
    status: "in-progress" | "todo" | "done";
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignedTo: string | Team;
    epicId: string;       // Refers to a parent epic if any
    sprintId: string;     // Logical grouping for sprints
    parentId: string;     // for subtasks
    projectId: string;
    createdAt: Date;
    updatedAt: Date;

}