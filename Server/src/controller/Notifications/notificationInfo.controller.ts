import { Model } from "sequelize";
import { NotificationInfo } from "../../models/notificationInfo.model";
import { NotificationRecords } from "../../models/notificationRecords.model";
import { Reply } from "../../models/reply.model";
import { Topic } from "../../models/topics.model";
import {
  CreateNotificationInfoInput,
  UpdateNotificationInfoInput,
} from "./notificationInfo.interface";
import { User } from "../../models/user.model";

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

  getNotificationInfo: async (userId: number) => {
    try {
      const datas = await NotificationInfo.findAll({
        where: { receiverId: userId },
        include: [
          { model: Topic, as: "topicData" },
          { model: Reply, as: "replyData" },
          { model: NotificationRecords, as: "notificationRecords" },
          { model: User, as: "receiver" },
        ],
        order: [["createdAt", "DESC"]],
      });

      const count = await NotificationInfo.count({
        where: { receiverId: userId },
      });

      if (datas.length === 0) {
        throw new Error("No notification info found");
      }
      console.log("count", count);
      return datas;
    } catch (error: any) {
      console.error("Error in fetching notification info:", error.message);
      throw new Error(error.message);
    }
  },

  // updateNotification: async (
  //   id: number,
  //   input: UpdateNotificationInfoInput
  // ) => {
  //   try {
  //     console.log("sahgaahjhajsk----------");
  //     const data = await NotificationInfo.findByPk(id);
  //     if (!data) {
  //       throw new Error("data not found");
  //     }

  //     const updatedData = await data.update(input);

  //     return {
  //       message: "data updated successfully",
  //       notificationInfo: updatedData,
  //     };
  //   } catch (error: any) {
  //     console.error("Error in updatedata:", error.message);
  //     throw new Error(error.message);
  //   }
  // },

  updateNotification: async (
    ids: number[],
    input: UpdateNotificationInfoInput
  ) => {
    try {
      const notifications = await NotificationInfo.findAll({
        where: { id: ids },
      });

      if (notifications.length === 0) {
        throw new Error("No notifications found for the given IDs.");
      }

      const updatePromises = notifications.map((notification) =>
        notification.update(input)
      );

      const updatedNotifications = await Promise.all(updatePromises);

      return {
        message: `${updatedNotifications.length} notifications updated successfully`,
        notificationInfo: updatedNotifications,
      };
    } catch (error: any) {
      console.error("Error updating notifications:", error.message);
      throw new Error(error.message);
    }
  },
};

export default NotificationInfoController;
