import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    createReply(input: CreateReplyInput!): ReplyResponse
    updateReply(id: Int!, input: UpdateReplyInput!): ReplyResponse
    deleteReply(id: Int!): String
  }
`;
