import { gql } from "apollo-server-express";

export default gql`
  type Query {
    getReplyById(id: Int!): Reply
    getReplies: [Reply]
  }
`;
