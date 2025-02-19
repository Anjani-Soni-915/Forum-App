import { gql } from "apollo-server-express";

export default gql`
  type Topic {
    id: Int!
    title: String!
    description: String!
    userId: Int!
    likes: Int!
    views: Int!
    repliesCount: Int!
    tags: [String]!
    status: Boolean!
  }

  input CreateTopicInput {
    title: String!
    description: String!
    likes: Int!
    views: Int!
    repliesCount: Int!
    tags: [String]!
  }

  input UpdateTopicInput {
    title: String
    description: String
    likes: Int
    views: Int
    repliesCount: Int
    tags: [String]
  }

  type TopicResponse {
    message: String!
    topic: Topic!
  }
`;
