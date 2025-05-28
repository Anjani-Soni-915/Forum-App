import {
  topicLikesController,
  replyLikesController,
} from "../../controller/Likes/likes.controller";
import {
  CreateReplyLikesInput,
  CreateTopicLikesInput,
  UpdateReplyLikesInput,
  UpdateTopicLikesInput,
} from "../../controller/Likes/likes.interface";

export default {
  Query: {
    getTopicLikes: async (_: any, __: any) => {
      try {
        return await topicLikesController.getTopicLikes();
      } catch (error: any) {
        console.error("Error in getAllTopicLikes:", error.message);
        throw new Error(error.message || "Failed to fetch topic likes");
      }
    },

    getReplyLikes: async (_: any, __: any) => {
      try {
        return await replyLikesController.getReplyLikes();
      } catch (error: any) {
        console.error("Error in getAllReplyLikes:", error.message);
        throw new Error(error.message || "Failed to fetch reply likes");
      }
    },
  },

  Mutation: {
    createTopicLikes: async (
      _: any,
      { input }: { input: CreateTopicLikesInput },
      context: any
    ) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }

        const userId = context.user.id;
        return await topicLikesController.createTopicLikes(userId, input);
      } catch (error: any) {
        console.error("Error in createTopicLike:", error.message);
        throw new Error(error.message || "Failed to create topic like");
      }
    },

    updateTopicLikes: async (
      _: any,
      { id, input }: { id: number; input: UpdateTopicLikesInput },
      context: any
    ) => {
      if (!context.user) throw new Error("Unauthorized");

      try {
        return await topicLikesController.updateTopicLikes(id, input);
      } catch (error: any) {
        console.error("Error in updateTopicLike:", error.message);
        throw new Error(`Error updating topic like: ${error.message}`);
      }
    },

    createReplyLikes: async (
      _: any,
      { input }: { input: CreateReplyLikesInput },
      context: any
    ) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }

        const userId = context.user.id;
        return await replyLikesController.createReplyLikes(userId, input);
      } catch (error: any) {
        console.error("Error in createReplyLike:", error.message);
        throw new Error(error.message || "Failed to create reply like");
      }
    },

    updateReplyLikes: async (
      _: any,
      { id, input }: { id: number; input: UpdateReplyLikesInput },
      context: any
    ) => {
      if (!context.user) throw new Error("Unauthorized");

      try {
        return await replyLikesController.updateReplyLikes(id, input);
      } catch (error: any) {
        console.error("Error in updateReplyLike:", error.message);
        throw new Error(`Error updating reply like: ${error.message}`);
      }
    },
  },
};
