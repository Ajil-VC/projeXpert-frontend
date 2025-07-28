
export interface SubscriptionPlan {

    _id: string;
    name: string;
    price: number;
    description?: string;
    isActive: boolean;
    billingCycle: 'month' | 'year';

    stripePriceId: string;
    stripeProductId: string;

    maxWorkspace: number;
    maxProjects: number;
    maxMembers: number;
    canUseVideoCall: boolean;

    createdAt?: Date;
    updatedAt?: Date;

}