import { NotificationType } from "../../models/notificationType.model";
import { CreateNotificationTypeInput } from "./notificationType.interface";

const notificationTypeController = {
  createNotificationType: async (input: CreateNotificationTypeInput) => {
    try {
      const data = await NotificationType.create({ ...input });
      return {
        message: "Notification type created successfully",
        notificationType: data,
      };
    } catch (error) {
      console.error("Error creating notification type:", error);
      throw new Error("Failed to create notification type");
    }
  },

  getNotificationType: async () => {
    try {
      const datas = await NotificationType.findAndCountAll({
        order: [["createdAt", "DESC"]],
      });

      if (datas.rows.length === 0) {
        throw new Error("No notification type found");
      }

      return datas.rows;
    } catch (error: any) {
      console.error("Error in notification type:", error.message);
      throw new Error(error.message);
    }
  },
};

export default notificationTypeController;
