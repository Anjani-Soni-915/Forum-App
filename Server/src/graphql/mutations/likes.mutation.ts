import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    createReplyLikes(input: CreateReplyLikesInput!): ReplyLikesResponse
    updateReplyLikes(
      id: Int!
      input: UpdateReplyLikesInput!
    ): ReplyLikesResponse

    createTopicLikes(input: CreateTopicLikesInput!): TopicLikesResponse
    updateTopicLikes(
      id: Int!
      input: UpdateTopicLikesInput!
    ): TopicLikesResponse
  }
`;
