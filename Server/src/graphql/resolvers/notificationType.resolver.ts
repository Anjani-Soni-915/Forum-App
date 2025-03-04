import notificationTypeController from "../../controller/Notifications/notificationType.controller";
import { CreateNotificationTypeInput } from "../../controller/Notifications/notificationType.interface";

export default {
  Query: {
    getNotificationType: async (_: any, __: any) => {
      try {
        return await notificationTypeController.getNotificationType();
      } catch (error: any) {
        console.error("Error in fetch:", error.message);
        throw new Error(error.message || "Failed to fetch notification type");
      }
    },
  },
  Mutation: {
    createNotificationType: async (
      _: any,
      { input }: { input: CreateNotificationTypeInput }
    ) => {
      try {
        const newNotificationType =
          await notificationTypeController.createNotificationType(input);
        console.log("New NotificationType:", newNotificationType);

        return newNotificationType;
      } catch (error: any) {
        console.error("Error in createNotificationType:", error.message);
        throw new Error(error.message || "Failed to create notification type");
      }
    },
  },
};
