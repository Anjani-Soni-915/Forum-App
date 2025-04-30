import { gql } from "apollo-server-express";

export default gql`
  type Query {
    getPollByTopic(topicId: Int!): Poll
  }
`;
