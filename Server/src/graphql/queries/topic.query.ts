import { gql } from "apollo-server-express";

export default gql`
  type Query {
    getTopicById(id: Int!): Topic
    getTopics(
      page: Int
      pageSize: Int
      searchQuery: String
      sortFieldBy: String
      sortOrderBy: String
    ): PaginatedTopics!
    getTopicss: [Topic]
  }
`;

// getTopics(page: Int, pageSize: Int): PaginatedTopics!
