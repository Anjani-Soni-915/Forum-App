import { Subscription } from "../../models/subscription.model";
import { User } from "../../models/user.model";
import { io } from "../../app";
import { Topic } from "../../models/topics.model";
import {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
} from "./subscription.interface";
import { NotificationInfo } from "../../models/notificationInfo.model";
import { NotificationRecords } from "../../models/notificationRecords.model";
import { NotificationType } from "../../models/notificationType.model";

const subscriptionController = {
  // createSubscription: async (
  //   userId: number,
  //   input: CreateSubscriptionInput
  // ) => {
  //   try {
  //     if (!userId) {
  //       throw new Error("Authentication required");
  //     }

  //     // Check if the subscription already exists
  //     let existingSubscription = await Subscription.findOne({
  //       where: { userId, topicId: input.topicId },
  //     });

  //     const topic = await Topic.findOne({ where: { id: input.topicId } });
  //     const user = await User.findOne({ where: { id: userId } });

  //     if (!topic || !user) {
  //       throw new Error("Topic or user not found");
  //     }

  //     if (existingSubscription) {
  //       // Toggle subscription status
  //       existingSubscription.status = !existingSubscription.status;
  //       await existingSubscription.save();

  //       // **Send notification when user re-subscribes**
  //       if (existingSubscription.status) {
  //         io.emit(`subscription:${topic.userId}`, {
  //           message: `🔔 ${user.fName} ${user.lName} re-subscribed to your topic "${topic.title}"`,
  //           topicId: topic.id,
  //           topicName: topic.title,
  //         });
  //       }

  //       return {
  //         message: `Subscription ${
  //           existingSubscription.status ? "enabled" : "disabled"
  //         } successfully`,
  //         subscription: existingSubscription,
  //       };
  //     }

  //     // Create new subscription
  //     const subscription = await Subscription.create({
  //       ...input,
  //       userId,
  //       status: true,
  //     });

  //     // **Send notification for new subscribers**
  //     io.emit(`subscription:${topic.userId}`, {
  //       message: `🔔 ${user.fName} ${user.lName} subscribed to your topic "${topic.title}"`,
  //       topicId: topic.id,
  //       topicName: topic.title,
  //     });

  //     return {
  //       message: "Subscription created successfully",
  //       subscription,
  //     };
  //   } catch (error: any) {
  //     console.error("Error in createSubscription:", error.message);
  //     throw new Error(error.message || "Failed to create subscription");
  //   }
  // },

  createSubscription: async (
    userId: number,
    input: CreateSubscriptionInput
  ) => {
    try {
      if (!userId) {
        throw new Error("Authentication required");
      }

      let existingSubscription = await Subscription.findOne({
        where: { userId, topicId: input.topicId },
      });

      const topic = await Topic.findOne({ where: { id: input.topicId } });
      const user = await User.findOne({ where: { id: userId } });
      const notificationType = await NotificationType.findOne({
        where: { action: "subscribed" },
      });

      if (!topic || !user || !notificationType) {
        throw new Error("Topic, user, or notification type not found");
      }

      let actionMessage = "";

      if (existingSubscription) {
        // Toggle subscription status
        existingSubscription.status = !existingSubscription.status;
        await existingSubscription.save();

        if (!existingSubscription.status) {
          return {
            message: "Subscription disabled successfully",
            subscription: existingSubscription,
          };
        }
      } else {
        // Create new subscription
        existingSubscription = await Subscription.create({
          ...input,
          userId,
          status: true,
        });
      }

      actionMessage = notificationType.content.replace(
        "${user}",
        `${user.fName} ${user.lName}`
      );
      // .replace("${title}", topic.title);

      if (existingSubscription.status == true) {
        const notificationRecord = await NotificationRecords.create({
          senderId: user.id,
          isRead: false,
          content: actionMessage,
          status: true,
        });

        await NotificationInfo.create({
          topicId: topic.id,
          subscribedId: existingSubscription.id,
          actionTypeId: notificationType.id,
          receiverId: topic.userId,
          notificationRecordId: notificationRecord.id,
          isRead: false,
          status: true,
        });
      }

      // **Emit WebSocket Notification**
      io.emit(`subscription:${topic.userId}`, {
        message: actionMessage,
        topicId: topic.id,
        title: topic.title,
        actionType: notificationType.action,
      });

      return {
        message: "Subscription created successfully",
        subscription: existingSubscription,
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
