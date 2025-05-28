import { gql } from "apollo-server-express";

export default gql`
  type User {
    id: Int!
    fName: String!
    lName: String!
    email: String!
    image: String!
    dob: String!
    interest: [String]!
    password: String!
    status: Boolean!
    topicData: [Topic]
    replyData: [Reply]
    subscriptionData: [Subscription]
    topicLikesData: [TopicLikes]
    replyLikesData: [ReplyLikes]
  }

  input CreateUserInput {
    fName: String!
    lName: String!
    email: String!
    image: String
    dob: String
    interest: [String]!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateUserInput {
    fName: String
    lName: String
    email: String
    image: String
    dob: String
    password: String
  }
  type TokenResponse {
    accessToken: String!
    refreshToken: String!
  }

  type UserResponse {
    message: String!
    user: User!
    tokens: TokenResponse!
  }
`;
