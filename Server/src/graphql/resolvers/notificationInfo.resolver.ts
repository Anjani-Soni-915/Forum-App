import NotificationInfoController from "../../controller/Notifications/notificationInfo.controller";
import { CreateNotificationInfoInput } from "../../controller/Notifications/notificationInfo.interface";

export default {
  Query: {
    getNotificationInfo: async (_: any, __: any) => {
      try {
        return await NotificationInfoController.getNotificationInfo();
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
  },
};
