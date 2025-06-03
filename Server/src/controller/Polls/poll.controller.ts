import { PollVote } from "../../models/pollVote.mode";
import { PollVoteInput } from "./poll.interface";

const pollController = {
  addPollVote: async (userId: number, input: PollVoteInput) => {
    const pollVoted = await PollVote.create({
      ...input,
    });
    return {
      message: "Topic created successfully",
    };
  },
};
export default pollController;
