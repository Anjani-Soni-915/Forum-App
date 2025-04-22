import { io } from "../../app";
import { NotificationInfo } from "../../models/notificationInfo.model";
import { NotificationRecords } from "../../models/notificationRecords.model";
import { NotificationType } from "../../models/notificationType.model";
import { Reply } from "../../models/reply.model";
import { ReplyLikes } from "../../models/replyLikes.model";
import { Subscription } from "../../models/subscription.model";
import { Topic } from "../../models/topics.model";
import { User } from "../../models/user.model";
import { CreateReplyInput, UpdateReplyInput } from "./reply.interface";

const replyController = {
  createReply: async (userId: number, input: CreateReplyInput) => {
    try {
      console.log("input---->", input);
      if (!userId) throw new Error("Authentication required");

      const { topicId } = input;

      const reply = await Reply.create({ ...input, userId });

      // Increment the replies count in the topic
      await Topic.increment({ repliesCount: 1 }, { where: { id: topicId } });

      // Fetch the newly created reply with user data
      const replyWithUser = await Reply.findOne({
        where: { id: reply.id },
        include: [
          {
            model: User,
            as: "userData",
            attributes: ["id", "fName", "lName", "image"],
          },
        ],
      });
      //------------------------------------

      const user = await User.findByPk(userId);
      if (!user) throw new Error("User not found");

      const topicData = await Topic.findByPk(topicId);
      if (!topicData) throw new Error("Topic not found");

      // Notify the topic owner if the reply is not from them

      const notificationType = await NotificationType.findOne({
        where: { action: "reply" },
      });
      if (!notificationType) throw new Error("Notification type not found");

      const actionMessage = notificationType.content.replace(
        "${user}",
        `${user.fName} ${user.lName}`
      );

      // Create the notification record for the topic owner
      const notificationRecord = await NotificationRecords.create({
        senderId: user.id,
        isRead: false,
        content: actionMessage,
        status: true,
      });

      // Create the notification info for the reply
      await NotificationInfo.create({
        replyId: reply.id,
        actionTypeId: notificationType.id,
        receiverId: topicData.userId,
        notificationRecordId: notificationRecord.id,
        isRead: false,
        status: true,
      });

      // Emit notification to the topic owner
      if (reply.userId !== topicData.userId) {
        io.emit(`notification:${topicData.userId}`, {
          message: actionMessage,
          replyId: reply.id,
          title: reply.text,
          actionType: notificationType.action,
        });
      } else {
        console.log("not working---------------->>>>>");
      }

      //------------------------------------

      // Send notification to all subscribers
      // const notificationTypeForSubscribers = await NotificationType.findOne({
      //   where: { action: "subscribedReply" },
      // });

      // if (!notificationTypeForSubscribers)
      //   throw new Error("Notification type not found");

      // const subscribers = await Subscription.findAll({
      //   where: { topicId },
      // });

      // for (const subscriber of subscribers) {
      //   const subscriberActionMessage =
      //     notificationTypeForSubscribers.content.replace(
      //       "${user}",
      //       `${user.fName} ${user.lName}`
      //     );

      //   const notificationRecordForSubscriber =
      //     await NotificationRecords.create({
      //       senderId: user.id,
      //       isRead: false,
      //       content: subscriberActionMessage,
      //       status: true,
      //     });

      //   await NotificationInfo.create({
      //     replyId: reply.id,
      //     actionTypeId: notificationTypeForSubscribers.id,
      //     receiverId: subscriber.userId,
      //     notificationRecordId: notificationRecordForSubscriber.id,
      //     isRead: false,
      //     status: true,
      //   });

      //   // Emit notification to the subscriber
      //   if (subscriber.userId !== userId) {
      //     io.emit(`notification:${subscriber.userId}`, {
      //       message: subscriberActionMessage,
      //       replyId: reply.id,
      //       title: reply.text,
      //     });
      //   } else {
      //     console.log("Not working------------->>>>>>>>>>>.");
      //   }
      // }

      //-------------------------------------
      const notificationTypeForSubscribers = await NotificationType.findOne({
        where: { action: "subscribedReply" },
      });

      if (!notificationTypeForSubscribers)
        throw new Error("Notification type not found");

      const subscribers = await Subscription.findAll({
        where: { topicId },
      });

      if (subscribers.length === 0) return;

      const subscriberActionMessage =
        notificationTypeForSubscribers.content.replace(
          "${user}",
          `${user.fName} ${user.lName}`
        );

      const notificationRecordForSubscriber = await NotificationRecords.create({
        senderId: user.id,
        isRead: false,
        content: subscriberActionMessage,
        status: true,
      });

      const notificationInfoRecords = subscribers.map((subscriber) => ({
        replyId: reply.id,
        actionTypeId: notificationTypeForSubscribers.id,
        receiverId: subscriber.userId,
        notificationRecordId: notificationRecordForSubscriber.id,
        isRead: false,
        status: true,
      }));

      // Bulk insert notification info records
      await NotificationInfo.bulkCreate(notificationInfoRecords);

      // Emit notifications to each subscriber
      for (const subscriber of subscribers) {
        if (subscriber.userId !== user.id) {
          io.emit(`notification:${subscriber.userId}`, {
            message: subscriberActionMessage,
            replyId: reply.id,
            title: reply.text,
            actionType: notificationTypeForSubscribers.action,
          });
        }
      }
      //--------------------------------------------------
      return {
        message: "Reply created successfully",
        reply: replyWithUser,
      };
    } catch (error: any) {
      console.error("Error in createReply:", error.message);
      throw new Error(error.message || "Failed to create reply");
    }
  },

  getReplyById: async (id: number) => {
    try {
      const data = await Reply.findOne({
        where: { id, status: true },
        include: [
          { model: User, as: "userData" },
          { model: Topic, as: "topicData" },
          { model: ReplyLikes, as: "replyLikesData" },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (!data) {
        throw new Error("Reply not found");
      }
      return data;
    } catch (error: any) {
      console.error("Error in getReplyById:", error.message);
      throw new Error(error.message);
    }
  },

  getReplies: async () => {
    try {
      const datas = await Reply.findAll({
        where: { status: true },
        include: [
          { model: User, as: "userData" },
          { model: Topic, as: "topicData" },
          { model: ReplyLikes, as: "replyLikesData" },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (datas.length === 0) {
        throw new Error("No replies found");
      }
      return datas;
    } catch (error: any) {
      console.error("Error in getReplies:", error.message);
      throw new Error(error.message);
    }
  },

  updateReply: async (id: number, input: UpdateReplyInput) => {
    try {
      const data = await Reply.findByPk(id);
      if (!data) {
        throw new Error("Reply not found");
      }

      const updatedData = await data.update(input);

      return {
        message: "Reply updated successfully",
        reply: updatedData,
      };
    } catch (error: any) {
      console.error("Error in updateReply:", error.message);
      throw new Error(error.message);
    }
  },

  deleteReply: async (id: number) => {
    try {
      const data = await Reply.findOne({ where: { id, status: true } });
      if (!data) {
        throw new Error("Reply not found");
      }

      await data.update({ status: false });

      return "Reply deleted successfully";
    } catch (error: any) {
      console.error("Error in deleteReply:", error.message);
      throw new Error(error.message);
    }
  },
};

export default replyController;
