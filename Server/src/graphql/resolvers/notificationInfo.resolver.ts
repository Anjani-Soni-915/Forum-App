import NotificationInfoController from "../../controller/Notifications/notificationInfo.controller";
import {
  CreateNotificationInfoInput,
  UpdateNotificationInfoInput,
} from "../../controller/Notifications/notificationInfo.interface";

export default {
  Query: {
    getNotificationInfo: async (_: any, __: any, context: any) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }

        const userId = context.user.id;
        const result = await NotificationInfoController.getNotificationInfo(
          userId
        );
        return result;
      } catch (error: any) {
        console.error("Error in fetch:", error.message);
        throw new Error(error.message || "Failed to fetch notification info");
      }
    },
  },

  Mutation: {
    createNotificationInfo: async (
      _: any,
      { input }: { input: CreateNotificationInfoInput },
      context: any
    ) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }

        const userId = context.user.id;
        const newNotificationInfo =
          await NotificationInfoController.createNotificationInfo(
            userId,
            input
          );

        return {
          message: "Notification created successfully",
          notificationInfo: newNotificationInfo,
        };
      } catch (error: any) {
        console.error("Error in createNotificationInfo:", error.message);
        throw new Error(error.message || "Failed to create notification info");
      }
    },
    updateNotificationinfo: async (
      _: any,
      { id, input }: { id: number; input: UpdateNotificationInfoInput }
    ) => {
      try {
        return await NotificationInfoController.updateNotification(id, input);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error updating topic: ${error.message}`);
      }
    },
  },
};
