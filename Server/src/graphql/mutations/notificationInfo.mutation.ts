import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    createNotificationInfo(
      input: CreateNotificationInfoInput!
    ): NotificationInfoResponse

    updateNotificationinfo(
      id: Int!
      input: UpdateNotificationInfoInput!
    ): NotificationInfoResponse
  }
`;
