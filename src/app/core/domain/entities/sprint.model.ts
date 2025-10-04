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

    _id: string;
    sprintCount: number;
    name: string;
    description?: string;
    goal?: string,
    startDate?: Date;
    endDate?: Date;
    status: 'not-started' | 'active' | 'completed';
    projectId: string;
    createdBy: string | Team;
    tasks: string[] | Task[];
    createdAt?: Date;
    updatedAt?: Date;

    plannedPoints?: number,
    completedPoints?: number,
    velocity?: number,
    velocitySnapshot?: number,
    burndownData?: BurndownEntry[],
    challenges?: Challenge[]

}

//It will be usec in kanban
export interface SprintTaskGroup {
    sprint: Sprint
    tasks: Task[];
}
