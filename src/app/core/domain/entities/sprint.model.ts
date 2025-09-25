import { Task } from "./task.model";
import { Team } from "./team.model";


interface BurndownEntry {
    date: Date;
    remainingPoints: number;
}

interface Challenge {
    _id: string,
    reportedBy: string,
    description: string,
    impact: string,
    proposedSolution: string,
    status: 'open' | 'resolved',
    createdAt: Date
}

export interface Sprint extends Document {

    _id: String;
    sprintCount: Number;
    name: String;
    description?: String;
    goal?: string,
    startDate?: Date;
    endDate?: Date;
    status: 'not-started' | 'active' | 'completed';
    projectId: String;
    createdBy: string | Team;
    tasks: Array<string> | Array<Task>;
    createdAt?: Date;
    updatedAt?: Date;

    plannedPoints?: Number,
    completedPoints?: Number,
    velocity?: Number,
    velocitySnapshot?: Number,
    burndownData?: BurndownEntry[],
    challenges?: Challenge[]

}

//It will be usec in kanban
export interface SprintTaskGroup {
    sprint: Sprint
    tasks: Task[];
}
