import { NotificationInfo } from "../../models/notificationInfo.model";
import { CreateNotificationInfoInput } from "./notificationInfo.interface";

const NotificationInfoController = {
  createNotificationInfo: async (
    userId: number,
    input: CreateNotificationInfoInput
  ) => {
    try {
      if (!userId) throw new Error("Authentication required");

      const data = await NotificationInfo.create({
        ...input,
        receiverId: userId,
      });

      return data;
    } catch (error) {
      console.error("Error creating notification info:", error);
      throw new Error("Failed to create notification info");
    }
  },

  getNotificationInfo: async () => {
    try {
      const datas = await NotificationInfo.findAll({
        order: [["createdAt", "DESC"]],
      });

      if (datas.length === 0) {
        throw new Error("No notification info found");
      }

      return datas;
    } catch (error: any) {
      console.error("Error in fetching notification info:", error.message);
      throw new Error(error.message);
    }
  },
};

export default NotificationInfoController;
