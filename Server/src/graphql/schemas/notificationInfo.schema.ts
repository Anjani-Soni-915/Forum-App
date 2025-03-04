import { gql } from "apollo-server-express";

export default gql`
  type NotificationInfo {
    id: Int!
    topicId: Int
    replyId: Int
    subscribedId: Int
    actionTypeId: Int!
    receiverId: Int!
    notificationRecordId: Int!
    status: Boolean
    createdAt: String!
    updatedAt: String!
  }

  input CreateNotificationInfoInput {
    topicId: Int
    replyId: Int
    subscribedId: Int
    actionTypeId: Int!
    receiverId: Int
    notificationRecordId: Int!
    status: Boolean
  }

  type NotificationInfoResponse {
    message: String!
    notificationInfo: NotificationInfo
  }
`;
