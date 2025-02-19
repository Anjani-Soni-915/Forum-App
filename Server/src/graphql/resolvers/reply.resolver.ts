import replyController from "../../controller/Replies/reply.controller";
import {
  CreateReplyInput,
  UpdateReplyInput,
} from "../../controller/Replies/reply.interface";

export default {
  Query: {
    getReplies: async (_: any, __: any) => {
      try {
        return await replyController.getReplies();
      } catch (error: any) {
        console.error("Error in fetch:", error.message);
        throw new Error(error.message || "Failed to fetch replies");
      }
    },

    getReplyById: async (_: any, { id }: { id: number }) => {
      try {
        return await replyController.getReplyById(id);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error fetching reply by ID: ${error.message}`);
      }
    },
  },
  Mutation: {
    createReply: async (
      _: any,
      { input }: { input: CreateReplyInput },
      context: any
    ) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }

        console.log("input and id===========>", context.user.id, input);

        const userId = context.user.id;
        return await replyController.createReply(userId, input);
      } catch (error: any) {
        console.error("Error in createReply:", error.message);
        throw new Error(error.message || "Failed to create reply");
      }
    },

    updateReply: async (
      _: any,
      { id, input }: { id: number; input: UpdateReplyInput },
      context: any
    ) => {
      if (!context.user) throw new Error("Unauthorized");

      try {
        return await replyController.updateReply(id, input);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error updating reply: ${error.message}`);
      }
    },

    deleteReply: async (_: any, { id }: { id: number }, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      try {
        return await replyController.deleteReply(id);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error deleting reply: ${error.message}`);
      }
    },
  },
};
