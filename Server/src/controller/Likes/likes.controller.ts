import { TopicLikes } from "../../models/topicLikes.model";
import { ReplyLikes } from "../../models/replyLikes.model";
import {
  CreateReplyLikesInput,
  CreateTopicLikesInput,
  UpdateReplyLikesInput,
  UpdateTopicLikesInput,
} from "./likes.interface";

const topicLikesController = {
  createTopicLikes: async (userId: number, input: CreateTopicLikesInput) => {
    try {
      if (!userId) {
        throw new Error("Authentication required");
      }

      const topicLikes = await TopicLikes.create({ ...input, userId });
      return {
        message: "Topic like created successfully",
        topicLikes,
      };
    } catch (error: any) {
      console.error("Error in createTopicLike:", error.message);
      throw new Error(error.message || "Failed to create topic like");
    }
  },

  getTopicLikes: async () => {
    try {
      const likes = await TopicLikes.findAll({ where: { status: true } });
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
  createReplyLikes: async (userId: number, input: CreateReplyLikesInput) => {
    try {
      if (!userId) {
        throw new Error("Authentication required");
      }

      const replyLikes = await ReplyLikes.create({ ...input, userId });
      return {
        message: "Reply like created successfully",
        replyLikes,
      };
    } catch (error: any) {
      console.error("Error in createReplyLike:", error.message);
      throw new Error(error.message || "Failed to create reply like");
    }
  },

  getReplyLikes: async () => {
    try {
      const likes = await ReplyLikes.findAll({ where: { status: true } });
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
