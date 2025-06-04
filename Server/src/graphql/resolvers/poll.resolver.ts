import pollController from "../../controller/Polls/poll.controller";
import { PollVoteInput } from "../../controller/Polls/poll.interface";

export default {
  Query: {},
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
        console.log(
          "Adding poll vote with userId:",
          userId,
          "and input:",
          context.user
        );
        input.userId = userId; // Ensure userId is set in the input
        return await pollController.addPollVote(userId, input);
      } catch (error: any) {
        console.error("Error in createTopic:", error.message);
        throw new Error(error.message || "Failed to create topic");
      }
    },
  },
};
