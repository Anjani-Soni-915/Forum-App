import { gql } from "apollo-server-express";

export default gql`
  type Reply {
    id: Int!
    userId: Int!
    topicId: Int!
    text: String!
    likes: Int
    status: Boolean
    userData: User
    topicData: Topic
    replyLikesData: [ReplyLikes]
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
