import { PollVote } from "../../models/pollVote.mode";
import { PollVoteInput } from "./poll.interface";

const pollController = {
  addPollVote: async (userId: number, input: PollVoteInput) => {
    console.log("Adding poll vote for user:", userId, "with input:", input);
    const pollVoted = await PollVote.create({
      ...input,
    });
    console.log("Poll vote created:", pollVoted);
    return {
      message: "Topic created successfully",
    };
  },
};
export default pollController;
