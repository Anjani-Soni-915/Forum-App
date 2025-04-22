import { gql } from "apollo-server-express";
import userQueries from "./user.query";
import topicQueries from "./topic.query";
import replyQueries from "./reply.queries";
import subscriptionQueries from "./subscription.queries";
import likesQueries from "./likes.queries";
import notificationTypeQueries from "./notificationType.queries";
import notificationInfoQueries from "./notificationInfo.queries";
import notificationRecordsQueries from "./notificationRecords.queries";

export default gql`
  ${userQueries}
  ${topicQueries}
  ${replyQueries}
  ${subscriptionQueries}
  ${likesQueries}
  ${notificationTypeQueries}
  ${notificationInfoQueries}
  ${notificationRecordsQueries}
`;
