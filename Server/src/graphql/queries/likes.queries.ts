import { gql } from "apollo-server-express";

export default gql`
  type Query {
    getReplyLikes: [ReplyLikes]
    getTopicLikes: [TopicLikes]
  }
`;
