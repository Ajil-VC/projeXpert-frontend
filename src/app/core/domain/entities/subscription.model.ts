
export interface Subscription {

    _id: string;
    companyId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    plan: 'Pro' | 'Enterprise';
    status: 'active' | 'canceled' | 'past_due' | 'other';
    billingCycle: 'month' | 'year';
    currentPeriodEnd: Date;

    createdAt?: Date;
    updatedAt?: Date;

}