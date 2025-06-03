import pollController from "../../controller/Polls/poll.controller";
import { PollVoteInput } from "../../controller/Polls/poll.interface";
import topicController from "../../controller/Topics/topic.controller";
import {
  CreateTopicInput,
  UpdateTopicInput,
} from "../../controller/Topics/topic.interface";

export default {
  Query: {

  },
  Mutation: {
    addPollVote: async (
      _: any,
      { input }: { input: PollVoteInput },
      context: any
    ) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }
        const userId = context.user.id;
        return await pollController.addPollVote(userId, input);
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