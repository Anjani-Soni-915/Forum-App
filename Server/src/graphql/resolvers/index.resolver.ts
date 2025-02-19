import userResolver from "./user.resolver";
import topicResolver from "./topic.resolver";
import replyResolver from "./reply.resolver";
import subscriptionResolver from "./subscription.resolver";
import likesResolver from "./likes.resolver";

export default {
  Query: {
    ...userResolver.Query,
    ...topicResolver.Query,
    ...replyResolver.Query,
    ...subscriptionResolver.Query,
    ...likesResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...topicResolver.Mutation,
    ...replyResolver.Mutation,
    ...subscriptionResolver.Mutation,
    ...likesResolver.Mutation,
  },
};
