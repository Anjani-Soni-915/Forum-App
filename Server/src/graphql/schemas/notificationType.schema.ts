import { gql } from "apollo-server-express";

export default gql`
  type NotificationType {
    id: Int!
    action: String!
    content: String!
    status: Boolean
    createdAt: String!
    updatedAt: String!
  }

  input CreateNotificationTypeInput {
    action: String!
    content: String!
    status: Boolean
  }

  type NotificationTypeResponse {
    message: String!
    notificationType: NotificationType
  }
`;
