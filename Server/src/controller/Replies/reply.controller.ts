import { Reply } from "../../models/reply.model";
import { CreateReplyInput, UpdateReplyInput } from "./reply.interface";

const replyController = {
  createReply: async (userId: number, input: CreateReplyInput) => {
    try {
      console.log("input---->", input);
      if (!userId) {
        throw new Error("Authentication required");
      }

      const reply = await Reply.create({
        ...input,
        userId,
      });

      return {
        message: "Reply created successfully",
        reply,
      };
    } catch (error: any) {
      console.error("Error in createReply:", error.message);
      throw new Error(error.message || "Failed to create reply");
    }
  },

  getReplyById: async (id: number) => {
    try {
      const data = await Reply.findOne({ where: { id, status: true } });
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
      const datas = await Reply.findAll({ where: { status: true } });
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
