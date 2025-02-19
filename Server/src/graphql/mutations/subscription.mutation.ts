import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    createSubscription(input: CreateSubscriptionInput!): SubscriptionResponse
    updateSubscription(
      id: Int!
      input: UpdateSubscriptionInput!
    ): SubscriptionResponse
  }
`;
