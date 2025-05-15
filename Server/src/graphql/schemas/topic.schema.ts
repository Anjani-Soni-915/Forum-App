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
    feedType: String!
    isAnonymous: Boolean!
    status: Boolean!
    createdAt: String!
    updatedAt: String!
    userData: User
    subscriptionData: [Subscription]
    replyData: [Reply]
    topicLikesData: [TopicLikes]
  }

  type PaginatedTopics {
    totalItems: Int!
    totalPages: Int!
    currentPage: Int!
    topics: [Topic]!
  }

  input CreateTopicInput {
    title: String!
    description: String!
    likes: Int!
    views: Int!
    repliesCount: Int!
    tags: [String]!
    feedType: String!
    isAnonymous: Boolean!
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
