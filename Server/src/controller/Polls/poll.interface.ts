export interface PollVoteInput {
  topicId: number;
  pollOptionId: number;
  userId: number; // Optional, can be used to track the user who voted
}
