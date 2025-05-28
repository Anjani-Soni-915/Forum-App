import { gql } from "apollo-server-express";

export default gql`
  type Query {
    getSubscriptionById(id: Int!): Subscription
    getSubscriptions: [Subscription]
  }
`;
