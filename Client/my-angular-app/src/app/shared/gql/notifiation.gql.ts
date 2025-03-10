import { gql } from 'apollo-angular';

export const GET_NOTIFICATION = gql`
  query GetNotification {
    getNotificationInfo {
      id
      replyId
      topicId
      subscribedId
      actionTypeId
      receiverId
      notificationRecordId
      isRead
      status
      createdAt
      notificationRecords {
        id
        senderId
        content
      }
      topicData {
        id
        title
      }
      replyData {
        id
        text
      }
      receiver {
        id
        fName
        lName
      }
    }
  }
`;

export const UPDATE_IS_READ = gql`
  mutation UpdateNotificationInfo(
    $ids: [Int!]!
    $input: UpdateNotificationInfoInput!
  ) {
    updateNotificationinfo(ids: $ids, input: $input) {
      message
      notificationInfo {
        isRead
      }
    }
  }
`;
