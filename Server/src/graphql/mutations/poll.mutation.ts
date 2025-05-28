import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    createPoll(input: CreatePollInput!): PollResponse!
  }
`;
