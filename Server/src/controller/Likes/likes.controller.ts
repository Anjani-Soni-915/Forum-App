import { TopicLikes } from "../../models/topicLikes.model";
import { ReplyLikes } from "../../models/replyLikes.model";
import { Op } from "sequelize";
import {
  CreateReplyLikesInput,
  CreateTopicLikesInput,
  UpdateReplyLikesInput,
  UpdateTopicLikesInput,
} from "./likes.interface";
import { User } from "../../models/user.model";
import { Topic } from "../../models/topics.model";
import { Reply } from "../../models/reply.model";
import { io } from "../../app";
import { isConstValueNode } from "graphql";
import { NotificationType } from "../../models/notificationType.model";
import { NotificationRecords } from "../../models/notificationRecords.model";
import { NotificationInfo } from "../../models/notificationInfo.model";
import { Subscription } from "../../models/subscription.model";

const topicLikesController = {
  // createTopicLikes: async (userId: number, input: CreateTopicLikesInput) => {
  //   try {
  //     // console.log("userId--------------->", userId);
  //     if (!userId) throw new Error("Authentication required");

  //     const { topicId } = input;
  //     let topicLike = await TopicLikes.findOne({ where: { userId, topicId } });

  //     const newStatus = topicLike ? !topicLike.status : true;
  //     if (topicLike) await topicLike.update({ status: newStatus });
  //     else
  //       topicLike = await TopicLikes.create({ ...input, userId, status: true });

  //     if (newStatus) {
  //       await Topic.increment({ likes: 1 }, { where: { id: topicId } });
  //     } else {
  //       await Topic.decrement(
  //         { likes: 1 },
  //         { where: { id: topicId, likes: { [Op.gt]: 0 } } }
  //       );
  //     }

  //     return {
  //       message: newStatus ? "Topic liked" : "Topic unliked",
  //       topicLikes: topicLike,
  //     };
  //   } catch (error: any) {
  //     console.error("Error in createTopicLikes:", error.message);
  //     throw new Error(error.message || "Failed to update topic like");
  //   }
  // },

  // createTopicLikes: async (userId: number, input: CreateTopicLikesInput) => {
  //   try {
  //     if (!userId) throw new Error("Authentication required");

  //     const { topicId } = input;
  //     let topicLike = await TopicLikes.findOne({ where: { userId, topicId } });

  //     const newStatus = topicLike ? !topicLike.status : true;

  //     if (topicLike) {
  //       await topicLike.update({ status: newStatus });
  //     } else {
  //       topicLike = await TopicLikes.create({ ...input, userId, status: true });
  //     }

  //     // Increment or decrement the topic's like count
  //     if (newStatus) {
  //       await Topic.increment({ likes: 1 }, { where: { id: topicId } });
  //     } else {
  //       await Topic.decrement(
  //         { likes: 1 },
  //         { where: { id: topicId, likes: { [Op.gt]: 0 } } }
  //       );
  //     }

  //     const topic = await Topic.findByPk(topicId);
  //     if (!topic) throw new Error("Topic not found");

  //     const user = await User.findByPk(userId);
  //     if (!user) throw new Error("User not found");

  //     const notificationType = await NotificationType.findOne({
  //       where: { action: "topicLike" },
  //     });

  //     if (!topic || !user || !notificationType) {
  //       throw new Error("Topic, user, or notification type not found");
  //     }
  //     let actionMessage = "";
  //     actionMessage = notificationType.content.replace(
  //       "${user}",
  //       `${user.fName} ${user.lName}`
  //     );
  //     // .replace("${title}", topic.title);

  //     if (newStatus) {
  //       const notificationRecord = await NotificationRecords.create({
  //         senderId: user.id,
  //         isRead: false,
  //         content: actionMessage,
  //         status: true,
  //       });

  //       await NotificationInfo.create({
  //         topicId: topic.id,
  //         actionTypeId: notificationType.id,
  //         receiverId: topic.userId,
  //         notificationRecordId: notificationRecord.id,
  //         isRead: false,
  //         status: true,
  //       });
  //     }

  //     // Emit a notification event when status is true
  //     if (newStatus) {
  //       io.emit(`notification:${topic.userId}`, {
  //         message: actionMessage,
  //         topicId,
  //         title: topic.title,
  //       });
  //     }

  //     return {
  //       message: newStatus ? "Topic liked" : "Topic unliked",
  //       topicLikes: topicLike,
  //     };
  //   } catch (error: any) {
  //     console.error("Error in createTopicLikes:", error.message);
  //     throw new Error(error.message || "Failed to update topic like");
  //   }
  // },

  createTopicLikes: async (userId: number, input: CreateTopicLikesInput) => {
    try {
      if (!userId) throw new Error("Authentication required");

      const { topicId } = input;
      let topicLike = await TopicLikes.findOne({ where: { userId, topicId } });

      const newStatus = topicLike ? !topicLike.status : true;

      if (topicLike) {
        await topicLike.update({ status: newStatus });
      } else {
        topicLike = await TopicLikes.create({ ...input, userId, status: true });
      }

      // Increment or decrement the topic's like count
      if (newStatus) {
        await Topic.increment({ likes: 1 }, { where: { id: topicId } });
      } else {
        await Topic.decrement(
          { likes: 1 },
          { where: { id: topicId, likes: { [Op.gt]: 0 } } }
        );
      }

      const topic = await Topic.findByPk(topicId);
      if (!topic) throw new Error("Topic not found");
      const updatedLikeCount = topic.likes;

      const user = await User.findByPk(userId);
      if (!user) throw new Error("User not found");

      const notificationType = await NotificationType.findOne({
        where: { action: "topicLike" },
      });

      if (!topic || !user || !notificationType) {
        throw new Error("Topic, user, or notification type not found");
      }

      let actionMessage = notificationType.content.replace(
        "${user}",
        `${user.fName} ${user.lName}`
      );

      if (newStatus) {
        // Notify the topic owner
        const notificationRecord = await NotificationRecords.create({
          senderId: user.id,
          isRead: false,
          content: actionMessage,
          status: true,
        });

        await NotificationInfo.create({
          topicId: topic.id,
          actionTypeId: notificationType.id,
          receiverId: topic.userId,
          notificationRecordId: notificationRecord.id,
          isRead: false,
          status: true,
        });
        if (topic.userId !== user.id) {
          io.emit(`notification:${topic.userId}`, {
            message: actionMessage,
            topicId,
            title: topic.title,
            likeCount: updatedLikeCount,
            actionType: notificationType.action,
          });
        }

        // Notify all subscribers of this topic
        //   const notificationTypeForSub = await NotificationType.findOne({
        //     where: { action: "subscribedTopicLike" },
        //   });

        //   if (!topic || !user || !notificationTypeForSub) {
        //     throw new Error("Topic, user, or notification type not found");
        //   }

        //   let actionMessageForSub = notificationTypeForSub.content.replace(
        //     "${user}",
        //     `${user.fName} ${user.lName}`
        //   );

        //   const subscribers = await Subscription.findAll({
        //     where: { topicId },
        //   });

        //   for (const subscriber of subscribers) {
        //     if (subscriber.userId !== userId) {
        //       const subNotificationRecord = await NotificationRecords.create({
        //         senderId: user.id,
        //         isRead: false,
        //         content: actionMessageForSub,
        //         status: true,
        //       });

        //       await NotificationInfo.create({
        //         topicId: topic.id,
        //         actionTypeId: notificationType.id,
        //         receiverId: subscriber.userId,
        //         notificationRecordId: subNotificationRecord.id,
        //         isRead: false,
        //         status: true,
        //       });

        //       if (topic.userId !== subscriber?.userId) {
        //         io.emit(`notification:${subscriber.userId}`, {
        //           message: actionMessageForSub,
        //           topicId,
        //           title: topic.title,
        //         });
        //       }
        //     }
        //   }

        const notificationTypeForSub = await NotificationType.findOne({
          where: { action: "subscribedTopicLike" },
        });

        if (!topic || !user || !notificationTypeForSub) {
          throw new Error("Topic, user, or notification type not found");
        }

        let actionMessageForSub = notificationTypeForSub.content.replace(
          "${user}",
          `${user.fName} ${user.lName}`
        );

        const subscribers = await Subscription.findAll({
          where: { topicId },
        });

        if (subscribers.length === 0) return;

        const subNotificationRecord = await NotificationRecords.create({
          senderId: user.id,
          isRead: false,
          content: actionMessageForSub,
          status: true,
        });

        const notificationInfoRecords = subscribers.map((subscriber) => ({
          topicId: topic.id,
          actionTypeId: notificationTypeForSub.id,
          receiverId: subscriber.userId,
          notificationRecordId: subNotificationRecord.id,
          isRead: false,
          status: true,
        }));

        await NotificationInfo.bulkCreate(notificationInfoRecords);

        for (const subscriber of subscribers) {
          if (subscriber.userId !== user.id) {
            io.emit(`notification:${subscriber.userId}`, {
              message: actionMessageForSub,
              topicId,
              title: topic.title,
              likeCount: updatedLikeCount,
              actionType: notificationTypeForSub.action,
            });
          }
        }

        io.emit(`likeUpdated:${topicId}`, {
          topicId,
          likeCount: updatedLikeCount,
        });
      }

      return {
        message: newStatus ? "Topic liked" : "Topic unliked",
        topicLikes: topicLike,
      };
    } catch (error: any) {
      console.error("Error in createTopicLikes:", error.message);
      throw new Error(error.message || "Failed to update topic like");
    }
  },

  getTopicLikes: async () => {
    try {
      const likes = await TopicLikes.findAll({
        where: { status: true },
        include: [
          { model: User, as: "userData" },
          { model: Topic, as: "topicData" },
        ],
      });
      if (likes.length === 0) {
        throw new Error("No topic likes found");
      }
      return likes;
    } catch (error: any) {
      console.error("Error in getAllTopicLikes:", error.message);
      throw new Error(error.message);
    }
  },

  updateTopicLikes: async (id: number, input: UpdateTopicLikesInput) => {
    try {
      const like = await TopicLikes.findByPk(id);
      if (!like) {
        throw new Error("Topic like not found");
      }

      const updatedLike = await like.update(input);
      return {
        message: "Topic like updated successfully",
        like: updatedLike,
      };
    } catch (error: any) {
      console.error("Error in updateTopicLike:", error.message);
      throw new Error(error.message);
    }
  },
};

const replyLikesController = {
  // createReplyLikes: async (userId: number, input: CreateReplyLikesInput) => {
  //   try {
  //     if (!userId) throw new Error("Authentication required");

  //     const { replyId } = input;
  //     let replyLike = await ReplyLikes.findOne({ where: { userId, replyId } });

  //     const newStatus = replyLike ? !replyLike.status : true;
  //     if (replyLike) await replyLike.update({ status: newStatus });
  //     else
  //       replyLike = await ReplyLikes.create({ ...input, userId, status: true });

  //     if (newStatus) {
  //       await Reply.increment({ likes: 1 }, { where: { id: replyId } });
  //     } else {
  //       await Reply.decrement(
  //         { likes: 1 },
  //         { where: { id: replyId, likes: { [Op.gt]: 0 } } }
  //       );
  //     }

  //     //-------------------------------------------------

  //     // const reply = await Reply.findByPk(replyId);
  //     // if (!reply) throw new Error("Topic not found");

  //     // const user = await User.findByPk(userId);
  //     // if (!user) throw new Error("User not found");

  //     // const notificationType = await NotificationType.findOne({
  //     //   where: { action: "replyLike" },
  //     // });

  //     // if (!reply || !user || !notificationType) {
  //     //   throw new Error("Topic, user, or notification type not found");
  //     // }

  //     // let actionMessage = notificationType.content.replace(
  //     //   "${user}",
  //     //   `${user.fName} ${user.lName}`
  //     // );

  //     // if (newStatus) {
  //     //   // Notify the topic owner
  //     //   const notificationRecord = await NotificationRecords.create({
  //     //     senderId: user.id,
  //     //     isRead: false,
  //     //     content: actionMessage,
  //     //     status: true,
  //     //   });

  //     //   await NotificationInfo.create({
  //     //     topicId: reply.id,
  //     //     actionTypeId: notificationType.id,
  //     //     receiverId: reply.userId,
  //     //     notificationRecordId: notificationRecord.id,
  //     //     isRead: false,
  //     //     status: true,
  //     //   });
  //     //   if (reply.userId !== user.id) {
  //     //     io.emit(`notification:${reply.userId}`, {
  //     //       message: actionMessage,
  //     //       replyId,
  //     //       title: reply.text,
  //     //     });
  //     //   }

  //     //   // Notify all subscribers of this topic
  //     //   const topicId = reply.topicId;

  //     //   const topic = await Topic.findByPk(topicId);
  //     //   if (!topic) throw new Error("Topic not found");

  //     //   const notificationTypeForSub = await NotificationType.findOne({
  //     //     where: { action: "subscribedTopicLike" },
  //     //   });

  //     //   if (!topic || !user || !notificationTypeForSub) {
  //     //     throw new Error("Topic, user, or notification type not found");
  //     //   }

  //     //   let actionMessageForSub = notificationTypeForSub.content.replace(
  //     //     "${user}",
  //     //     `${user.fName} ${user.lName}`
  //     //   );

  //     //   const subscribers = await Subscription.findAll({
  //     //     where: { topicId },
  //     //   });

  //     //   for (const subscriber of subscribers) {
  //     //     if (subscriber.userId !== userId) {
  //     //       const subNotificationRecord = await NotificationRecords.create({
  //     //         senderId: user.id,
  //     //         isRead: false,
  //     //         content: actionMessageForSub,
  //     //         status: true,
  //     //       });

  //     //       await NotificationInfo.create({
  //     //         replyId: reply.id,
  //     //         actionTypeId: notificationType.id,
  //     //         receiverId: subscriber.userId,
  //     //         notificationRecordId: subNotificationRecord.id,
  //     //         isRead: false,
  //     //         status: true,
  //     //       });

  //     //       if (topic.userId !== subscriber?.userId) {
  //     //         io.emit(`notification:${subscriber.userId}`, {
  //     //           message: actionMessageForSub,
  //     //           topicId,
  //     //           title: topic.title,
  //     //         });
  //     //       }
  //     //     }
  //     //   }
  //     // }

  //     //-------------------------------------------------

  //     return {
  //       message: newStatus ? "Reply liked" : "Reply unliked",
  //       replyLikes: replyLike,
  //     };
  //   } catch (error: any) {
  //     console.error("Error in createReplyLikes:", error.message);
  //     throw new Error(error.message || "Failed to update reply like");
  //   }
  // },

  // createReplyLikes: async (userId: number, input: CreateReplyLikesInput) => {
  //   try {
  //     if (!userId) throw new Error("Authentication required");

  //     const { replyId } = input;
  //     let replyLike = await ReplyLikes.findOne({ where: { userId, replyId } });

  //     const newStatus = replyLike ? !replyLike.status : true;
  //     if (replyLike) await replyLike.update({ status: newStatus });
  //     else
  //       replyLike = await ReplyLikes.create({ ...input, userId, status: true });

  //     if (newStatus) {
  //       await Reply.increment({ likes: 1 }, { where: { id: replyId } });
  //     } else {
  //       await Reply.decrement(
  //         { likes: 1 },
  //         { where: { id: replyId, likes: { [Op.gt]: 0 } } }
  //       );
  //     }

  //     if (newStatus) {
  //       const reply = await Reply.findByPk(replyId);
  //       if (!reply) throw new Error("Reply not found");
  //       const updatedLikeCount = reply.likes;

  //       const user = await User.findByPk(userId);
  //       if (!user) throw new Error("User not found");

  //       const notificationType = await NotificationType.findOne({
  //         where: { action: "replyLike" },
  //       });
  //       if (!notificationType) throw new Error("Notification type not found");

  //       const actionMessage = notificationType.content.replace(
  //         "${user}",
  //         `${user.fName} ${user.lName}`
  //       );
  //       const notificationRecord = await NotificationRecords.create({
  //         senderId: user.id,
  //         isRead: false,
  //         content: actionMessage,
  //         status: true,
  //       });
  //       await NotificationInfo.create({
  //         replyId: reply.id,
  //         actionTypeId: notificationType.id,
  //         receiverId: reply.userId,
  //         notificationRecordId: notificationRecord.id,
  //         isRead: false,
  //         status: true,
  //       });

  //       if (reply.userId !== user.id) {
  //         io.emit(`notification:${reply.userId}`, {
  //           message: actionMessage,
  //           replyId,
  //           title: reply.text,
  //           likeCount: updatedLikeCount,
  //         });
  //       }

  //       io.emit(`likeUpdated:${replyId}`, {
  //         replyId,
  //         likeCount: updatedLikeCount,
  //       });
  //     }

  //     return {
  //       message: newStatus ? "Reply liked" : "Reply unliked",
  //       replyLikes: replyLike,
  //     };
  //   } catch (error: any) {
  //     console.error("Error in createReplyLikes:", error.message);
  //     throw new Error(error.message || "Failed to update reply like");
  //   }
  // },
  createReplyLikes: async (userId: number, input: CreateReplyLikesInput) => {
    try {
      if (!userId) throw new Error("Authentication required");
      if (!input.replyId) throw new Error("replyId is required");

      const { replyId } = input;

      let replyLike = await ReplyLikes.findOne({ where: { userId, replyId } });

      const newStatus = replyLike ? !replyLike.status : true;
      if (replyLike) {
        await replyLike.update({ status: newStatus });
      } else {
        replyLike = await ReplyLikes.create({ ...input, userId, status: true });
      }

      if (newStatus) {
        await Reply.increment({ likes: 1 }, { where: { id: replyId } });
      } else {
        await Reply.decrement(
          { likes: 1 },
          { where: { id: replyId, likes: { [Op.gt]: 0 } } } // ✅ Prevent negative likes
        );
      }

      // ✅ Fetch the updated like count AFTER increment/decrement
      const updatedReply = await Reply.findByPk(replyId);
      const updatedLikeCount = updatedReply ? updatedReply.likes : 0;

      if (newStatus) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error("User not found");

        const notificationType = await NotificationType.findOne({
          where: { action: "replyLike" },
        });
        if (!notificationType) throw new Error("Notification type not found");

        const actionMessage = notificationType.content.replace(
          "${user}",
          `${user.fName} ${user.lName}`
        );

        const notificationRecord = await NotificationRecords.create({
          senderId: user.id,
          isRead: false,
          content: actionMessage,
          status: true,
        });

        await NotificationInfo.create({
          replyId: replyId,
          actionTypeId: notificationType.id,
          receiverId: updatedReply?.userId!,
          notificationRecordId: notificationRecord.id,
          isRead: false,
          status: true,
        });

        // ✅ Emit notification event only if user is not liking their own reply
        if (updatedReply?.userId !== user.id) {
          console.log(
            `📢 Emitting notification event: notification:${updatedReply?.userId}`,
            {
              message: actionMessage,
              replyId,
              title: updatedReply?.text,
              likeCount: updatedLikeCount,
            }
          );
          io.emit(`notification:${updatedReply?.userId}`, {
            message: actionMessage,
            replyId,
            title: updatedReply?.text,
            likeCount: updatedLikeCount,
            actionType: notificationType.action,
          });
        }
      }

      // ✅ Emit live like update
      console.log(`📢 Emitting like update: likeUpdated:${replyId}`, {
        replyId,
        likeCount: updatedLikeCount,
      });
      io.emit(`likeUpdated:${replyId}`, {
        replyId,
        likeCount: updatedLikeCount,
      });

      return {
        message: newStatus ? "Reply liked" : "Reply unliked",
        replyLikes: replyLike,
      };
    } catch (error: any) {
      console.error("❌ Error in createReplyLikes:", error.message);
      throw new Error(error.message || "Failed to update reply like");
    }
  },

  getReplyLikes: async () => {
    try {
      const likes = await ReplyLikes.findAll({
        where: { status: true },
        include: [
          { model: User, as: "userData" },
          { model: Reply, as: "replyData" },
        ],
      });
      if (likes.length === 0) {
        throw new Error("No reply likes found");
      }
      return likes;
    } catch (error: any) {
      console.error("Error in getAllReplyLikes:", error.message);
      throw new Error(error.message);
    }
  },

  updateReplyLikes: async (id: number, input: UpdateReplyLikesInput) => {
    try {
      const like = await ReplyLikes.findByPk(id);
      if (!like) {
        throw new Error("Reply like not found");
      }

      const updatedLike = await like.update(input);
      return {
        message: "Reply like updated successfully",
        like: updatedLike,
      };
    } catch (error: any) {
      console.error("Error in updateReplyLike:", error.message);
      throw new Error(error.message);
    }
  },
};

export { topicLikesController, replyLikesController };
