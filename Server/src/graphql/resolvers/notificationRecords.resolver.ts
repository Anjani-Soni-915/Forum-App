import NotificationRecordsController from "../../controller/Notifications/notificationRecords.controller";
import { CreateNotificationRecordsInput } from "../../controller/Notifications/notificationRecords.interface";

export default {
  Query: {
    getNotificationRecords: async (_: any, __: any) => {
      try {
        return await NotificationRecordsController.getNotificationRecords();
      } catch (error: any) {
        console.error("Error in fetch:", error.message);
        throw new Error(
          error.message || "Failed to fetch notification Records"
        );
      }
    },
  },

  Mutation: {
    createNotificationRecords: async (
      _: any,
      { input }: { input: CreateNotificationRecordsInput },
      context: any
    ) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }

        const userId = context.user.id;

        const newNotificationRecords =
          await NotificationRecordsController.createNotificationRecords(
            userId,
            input
          );

        return {
          message: "Notification created successfully",
          notificationRecords: newNotificationRecords,
        };
      } catch (error: any) {
        console.error("Error in createNotificationRecords:", error.message);
        throw new Error(
          error.message || "Failed to create notification Records"
        );
      }
    },
  },
};
