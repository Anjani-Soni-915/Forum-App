import { Subscription } from "../../models/subscription.model";
import { User } from "../../models/user.model";
import { Topic } from "../../models/topics.model";
import {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
} from "./subscription.interface";

const subscriptionController = {
  createSubscription: async (
    userId: number,
    input: CreateSubscriptionInput
  ) => {
    try {
      if (!userId) {
        throw new Error("Authentication required");
      }

      const subscription = await Subscription.create({
        ...input,
        userId,
      });

      return {
        message: "Subscription created successfully",
        subscription,
      };
    } catch (error: any) {
      console.error("Error in createSubscription:", error.message);
      throw new Error(error.message || "Failed to create subscription");
    }
  },

  getSubscriptionById: async (id: number) => {
    try {
      const data = await Subscription.findOne({
        where: { id, status: true },
        include: [
          { model: User, as: "userData" },
          { model: Topic, as: "topicData" },
        ],
      });
      if (!data) {
        throw new Error("Subscription not found");
      }
      return data;
    } catch (error: any) {
      console.error("Error in getSubscriptionById:", error.message);
      throw new Error(error.message);
    }
  },

  getSubscriptions: async () => {
    try {
      const datas = await Subscription.findAll({
        where: { status: true },
        include: [
          { model: User, as: "userData" },
          { model: Topic, as: "topicData" },
        ],
      });
      if (datas.length === 0) {
        throw new Error("No subscriptions found");
      }
      return datas;
    } catch (error: any) {
      console.error("Error in getSubscriptions:", error.message);
      throw new Error(error.message);
    }
  },

  updateSubscription: async (id: number, input: UpdateSubscriptionInput) => {
    try {
      const data = await Subscription.findByPk(id);
      if (!data) {
        throw new Error("Subscription not found");
      }

      const updatedData = await data.update(input);

      return {
        message: "Subscription updated successfully",
        subscription: updatedData,
      };
    } catch (error: any) {
      console.error("Error in updateSubscription:", error.message);
      throw new Error(error.message);
    }
  },
};

export default subscriptionController;
