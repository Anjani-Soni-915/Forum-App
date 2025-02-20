import { gql } from "apollo-server-express";

export default gql`
  type Subscription {
    id: Int!
    userId: Int!
    topicId: Int!
    status: Boolean!
    userData: User
    topicData: Topic
  }

  input CreateSubscriptionInput {
    topicId: Int!
  }

  input UpdateSubscriptionInput {
    status: Boolean
  }

  type SubscriptionResponse {
    message: String!
    subscription: Subscription!
  }
`;
