import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    addPollVote(input: PollVoteInput!): PollVoteResponse!
  }
`;
