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
    isRead: Boolean
    createdAt: String!
    updatedAt: String!
    notificationRecords: NotificationRecords
    topicData: Topic
    replyData: Reply
    receiver: User
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

  input UpdateNotificationInfoInput {
    isRead: Boolean
  }

  type NotificationInfoResponse {
    message: String!
    notificationInfo: NotificationInfo
  }
`;
