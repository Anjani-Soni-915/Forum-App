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

const topicLikesController = {
  createTopicLikes: async (userId: number, input: CreateTopicLikesInput) => {
    try {
      if (!userId) throw new Error("Authentication required");

      const { topicId } = input;
      let topicLike = await TopicLikes.findOne({ where: { userId, topicId } });

      const newStatus = topicLike ? !topicLike.status : true;
      if (topicLike) await topicLike.update({ status: newStatus });
      else
        topicLike = await TopicLikes.create({ ...input, userId, status: true });

      if (newStatus) {
        await Topic.increment({ likes: 1 }, { where: { id: topicId } });
      } else {
        await Topic.decrement(
          { likes: 1 },
          { where: { id: topicId, likes: { [Op.gt]: 0 } } }
        );
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
  createReplyLikes: async (userId: number, input: CreateReplyLikesInput) => {
    try {
      if (!userId) throw new Error("Authentication required");

      const { replyId } = input;
      let replyLike = await ReplyLikes.findOne({ where: { userId, replyId } });

      const newStatus = replyLike ? !replyLike.status : true;
      if (replyLike) await replyLike.update({ status: newStatus });
      else
        replyLike = await ReplyLikes.create({ ...input, userId, status: true });

      if (newStatus) {
        await Reply.increment({ likes: 1 }, { where: { id: replyId } });
      } else {
        await Reply.decrement(
          { likes: 1 },
          { where: { id: replyId, likes: { [Op.gt]: 0 } } }
        );
      }

      return {
        message: newStatus ? "Reply liked" : "Reply unliked",
        replyLikes: replyLike,
      };
    } catch (error: any) {
      console.error("Error in createReplyLikes:", error.message);
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
