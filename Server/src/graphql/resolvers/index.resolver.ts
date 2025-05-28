import userResolver from "./user.resolver";
import topicResolver from "./topic.resolver";
import replyResolver from "./reply.resolver";
import subscriptionResolver from "./subscription.resolver";
import likesResolver from "./likes.resolver";
import notificationTypeResolver from "./notificationType.resolver";
import notificationInfoResolver from "./notificationInfo.resolver";
import notificationRecordsResolver from "./notificationRecords.resolver";

export default {
  Query: {
    ...userResolver.Query,
    ...topicResolver.Query,
    ...replyResolver.Query,
    ...subscriptionResolver.Query,
    ...likesResolver.Query,
    ...notificationTypeResolver.Query,
    ...notificationInfoResolver.Query,
    ...notificationRecordsResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...topicResolver.Mutation,
    ...replyResolver.Mutation,
    ...subscriptionResolver.Mutation,
    ...likesResolver.Mutation,
    ...notificationTypeResolver.Mutation,
    ...notificationInfoResolver.Mutation,
    ...notificationRecordsResolver.Mutation,
  },
};
