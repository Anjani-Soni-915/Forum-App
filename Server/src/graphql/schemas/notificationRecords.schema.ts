import { gql } from "apollo-server-express";

export default gql`
  type NotificationRecords {
    id: Int!
    senderId: Int!
    isRead: Boolean
    content: String
    status: Boolean
    createdAt: String!
    updatedAt: String!
  }

  input CreateNotificationRecordsInput {
    senderId: Int
    isRead: Boolean
    content: String
    status: Boolean
  }

  type NotificationRecordsResponse {
    message: String!
    notificationRecords: NotificationRecords
  }
`;
