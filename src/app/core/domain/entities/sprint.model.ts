import { Task } from "./task.model";
import { Team } from "./team.model";



export interface Sprint extends Document {

    _id: String;
    sprintCount: Number;
    name: String;
    description: String;
    startDate?: Date;
    endDate?: Date;
    status: 'not-started' | 'active' | 'completed';
    projectId: String;
    createdBy: String | Team;
    tasks: Array<string> | Array<Task>;
    createdAt?: Date;
    updatedAt?: Date;
}

//It will be usec in kanban
export interface SprintTaskGroup {
    sprint: Sprint
    tasks: Task[];
}
