import { gql } from "apollo-server-express";

export default gql`
  type Poll {
    id: Int!
    topicId: Int!
    isMultipleChoice: Boolean!
    expiresAt: String
    options: [PollOption!]!
    topicData: Topic
  }

  type PollOption {
    id: Int!
    pollId: Int!
    optionText: String!
    voteCount: Int!
    poll: Poll
  }

  # Input for creating each PollOption
  input PollOptionInput {
    optionText: String!
  }

  # Input for creating the Poll and its options
  input CreatePollInput {
    topicId: Int!
    isMultipleChoice: Boolean!
    expiresAt: String
    options: [PollOptionInput!]!
  }

  # CreatePoll Mutation response
  type PollResponse {
    message: String!
    poll: Poll!
    options: [PollOption!]!
  }
`;
