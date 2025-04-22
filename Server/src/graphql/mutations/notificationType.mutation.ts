import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    createNotificationType(
      input: CreateNotificationTypeInput!
    ): NotificationTypeResponse
  }
`;
