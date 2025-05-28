import { NotificationRecords } from "../../models/notificationRecords.model";
import { CreateNotificationRecordsInput } from "./notificationRecords.interface";

const NotificationRecordsController = {
  createNotificationRecords: async (
    userId: number,
    input: CreateNotificationRecordsInput
  ) => {
    try {
      if (!userId) throw new Error("Authentication required");

      const data = await NotificationRecords.create({
        ...input,
        senderId: userId,
      });

      return data;
    } catch (error) {
      console.error("Error creating notification Records:", error);
      throw new Error("Failed to create notification Records");
    }
  },

  getNotificationRecords: async () => {
    try {
      const datas = await NotificationRecords.findAll({
        order: [["createdAt", "DESC"]],
      });

      if (datas.length === 0) {
        throw new Error("No notification Records found");
      }

      return datas;
    } catch (error: any) {
      console.error("Error in fetching notification Records:", error.message);
      throw new Error(error.message);
    }
  },
};

export default NotificationRecordsController;
