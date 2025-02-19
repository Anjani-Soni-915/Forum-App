import { gql } from "apollo-server-express";
import userMutations from "./user.mutation";
import topicMutations from "./topic.mutation";
import replyMutation from "./reply.mutation";
import subscriptionMutation from "./subscription.mutation";
import likesMutation from "./likes.mutation";

export default gql`
  ${userMutations}
  ${topicMutations}
  ${replyMutation}
  ${subscriptionMutation}
  ${likesMutation}
`;
