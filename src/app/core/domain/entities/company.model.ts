import { SubscriptionPlan } from "./subscription.model";
import { Workspace } from "./workspace.model";

export interface Company {

    _id: string;
    name: String;
    email: String;

    subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'other';
    plan?: SubscriptionPlan;
    currentPeriodEnd?: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;

    defaultWorkspace: Workspace;
    workspaces: Array<Workspace>;

    isBlocked: boolean,

    createdAt?: Date;
    updatedAt?: Date;

}