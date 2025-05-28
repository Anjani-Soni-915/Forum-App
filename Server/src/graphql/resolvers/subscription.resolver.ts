import subscriptionController from "../../controller/Subscription/subscription.controller";
import {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
} from "../../controller/Subscription/subscription.interface";

export default {
  Query: {
    getSubscriptions: async (_: any, __: any, context: any) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }
        return await subscriptionController.getSubscriptions();
      } catch (error: any) {
        console.error("Error in fetch:", error.message);
        throw new Error(error.message || "Failed to fetch subscriptions");
      }
    },

    getSubscriptionById: async (
      _: any,
      { id }: { id: number },
      context: any
    ) => {
      if (!context.user) throw new Error("Unauthorized");
      try {
        return await subscriptionController.getSubscriptionById(id);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error fetching subscription by ID: ${error.message}`);
      }
    },
  },
  Mutation: {
    createSubscription: async (
      _: any,
      { input }: { input: CreateSubscriptionInput },
      context: any
    ) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }

        const userId = context.user.id;
        return await subscriptionController.createSubscription(userId, input);
      } catch (error: any) {
        console.error("Error in createSubscription:", error.message);
        throw new Error(error.message || "Failed to create subscription");
      }
    },

    updateSubscription: async (
      _: any,
      { id, input }: { id: number; input: UpdateSubscriptionInput },
      context: any
    ) => {
      if (!context.user) throw new Error("Unauthorized");

      try {
        return await subscriptionController.updateSubscription(id, input);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error updating subscription: ${error.message}`);
      }
    },
  },
};
