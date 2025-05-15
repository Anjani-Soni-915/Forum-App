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
    text: String!
    votes: Int!
    poll: Poll
  }

  input CreatePollInput {
    topicId: Int!
    isMultipleChoice: Boolean!
    expiresAt: String
    options: [String!]!
  }

  type PollResponse {
    message: String!
    poll: Poll!
    pollOption: PollOption!
  }
`;
