import { gql } from "apollo-server-express";

export default gql`
  type Reply {
    id: Int!
    userId: Int!
    topicId: Int!
    text: String!
    likes: Int
    status: Boolean
  }

  input CreateReplyInput {
    topicId: Int!
    text: String!
    likes: Int
  }

  input UpdateReplyInput {
    text: String
    likes: Int
    status: Boolean
  }

  type ReplyResponse {
    message: String!
    reply: Reply!
  }
`;
