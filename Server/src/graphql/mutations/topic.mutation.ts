import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    createTopic(input: CreateTopicInput!): TopicResponse
    updateTopic(id: Int!, input: UpdateTopicInput!): TopicResponse
    deleteTopic(id: Int!): String
  }
`;
