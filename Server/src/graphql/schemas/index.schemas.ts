import { gql } from "apollo-server-express";
import userSchema from "./users.schema";
import topicSchema from "./topic.schema";
import replySchema from "./reply.schema";
import subscriptionSchema from "./subscription.schema";
import likesSchema from "./likes.schema";

export default gql`
  ${userSchema}
  ${topicSchema}
  ${replySchema}
  ${subscriptionSchema}
  ${likesSchema}
`;
