export interface SubscriptionResponse {
  createSubscription: {
    message: string;
    subscription: {
      id: string;
      userId: string;
      topicId: string;
      status: boolean;
    };
  };
}

export interface CreateSubInput {
  topicId: number;
}
