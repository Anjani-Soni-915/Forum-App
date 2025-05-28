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
    pollData: Poll
  }
  type Poll {
    id: Int!
    topicId: Int
    isMultipleChoice: Boolean
    expiresAt: String
    options: [PollOption]
    topicData: Topic
  }

  type PollOption {
    id: Int!
    pollId: Int!
    text: String!
    votes: Int!
    poll: Poll
  }

  type PaginatedTopics {
    totalItems: Int!
    totalPages: Int!
    currentPage: Int!
    topics: [Topic]!
  }
  input CreatePollInput {
    isMultipleChoice: Boolean!
    expiresAt: String
    options: [String!]!
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
    pollData: CreatePollInput
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
