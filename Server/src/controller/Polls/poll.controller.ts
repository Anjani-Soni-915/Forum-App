import { PollOption } from "../../models/pollOptions.model";
import { PollVote } from "../../models/pollVote.mode";
import { PollVoteInput } from "./poll.interface";

const pollController = {
  addPollVote: async (userId: number, input: PollVoteInput) => {
    console.log("Adding poll vote for user:", userId, "with input:", input);
    const pollVoted = await PollVote.create({
      ...input,
    });

    await PollOption.increment('voteCount', {
      by: 1,
      where: { id: input.pollOptionId },
    });
    console.log("Poll vote created:", pollVoted);
    return {
      message: "Vote recorded successfully",
    };
  },
};
export default pollController;
