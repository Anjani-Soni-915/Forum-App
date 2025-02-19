import { gql } from "apollo-server-express";

export default gql`
  type TopicLikes {
    id: Int!
    userId: Int!
    topicId: Int!
    status: Boolean!
  }

  input CreateTopicLikesInput {
    topicId: Int!
    status: Int
  }

  input UpdateTopicLikesInput {
    status: Boolean
  }

  type TopicLikesResponse {
    message: String!
    topicLikes: TopicLikes!
  }

  type ReplyLikes {
    id: Int!
    userId: Int!
    replyId: Int!
    status: Boolean!
  }

  input CreateReplyLikesInput {
    replyId: Int!
    status: Int
  }

  input UpdateReplyLikesInput {
    status: Boolean
  }

  type ReplyLikesResponse {
    message: String!
    replyLikes: ReplyLikes!
  }
`;
