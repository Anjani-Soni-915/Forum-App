import { gql } from "apollo-server-express";

export default gql`
  type Query {
    getTopicById(id: Int!): Topic
    getTopics: [Topic]
  }
`;

// getTopics(page: Int, pageSize: Int): PaginatedTopics!
