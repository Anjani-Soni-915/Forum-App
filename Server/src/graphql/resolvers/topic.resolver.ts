import { number } from "joi";
import topicController from "../../controller/Topics/topic.controller";
import {
  CreateTopicInput,
  UpdateTopicInput,
} from "../../controller/Topics/topic.interface";

export default {
  Query: {
    // getTopics: async (_: any, args: { page?: number; pageSize?: number }) => {
    //   try {
    //     return await topicController.getTopics(
    //       args.page ?? 1,
    //       args.pageSize ?? 10
    //     );
    //   } catch (error: any) {
    //     console.error("Error in fetch:", error.message);
    //     throw new Error(error.message || "Failed to fetch topics");
    //   }
    // },
    getTopics: async (
      _: any,
      args: {
        page?: number;
        pageSize?: number;
        searchQuery?: string;
        sortFieldBy?: string;
        sortOrderBy?: "asc" | "desc";
      }
    ) => {
      try {
        return await topicController.getTopics(
          args.page ?? 1,
          args.pageSize ?? 10,
          args.searchQuery ?? "",
          args.sortFieldBy ?? "createdAt",
          args.sortOrderBy ?? "desc"
        );
      } catch (error: any) {
        console.error("Error in fetch:", error.message);
        throw new Error(error.message || "Failed to fetch topics");
      }
    },

    getTopicById: async (_: any, { id }: { id: number }) => {
      try {
        return await topicController.getTopicById(id);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error fetching user by ID: ${error.message}`);
      }
    },
  },
  Mutation: {
    createTopic: async (
      _: any,
      { input }: { input: CreateTopicInput },
      context: any
    ) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }

        const userId = context.user.id;
        return await topicController.createTopic(userId, input);
      } catch (error: any) {
        console.error("Error in createTopic:", error.message);
        throw new Error(error.message || "Failed to create topic");
      }
    },

    updateTopic: async (
      _: any,
      { id, input }: { id: number; input: UpdateTopicInput },
      context: any
    ) => {
      if (!context.user) throw new Error("Unauthorized");

      try {
        return await topicController.updateTopic(id, input);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error updating topic: ${error.message}`);
      }
    },

    deleteTopic: async (_: any, { id }: { id: number }, context: any) => {
      if (!context.user) throw new Error("Unauthorized"); // token required
      try {
        return await topicController.deleteTopic(id);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error deleting user: ${error.message}`);
      }
    },
  },
};
