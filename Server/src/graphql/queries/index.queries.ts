import { gql } from "apollo-server-express";
import userQueries from "./user.query";
import topicQueries from "./topic.query";
import replyQueries from "./reply.queries";
import subscriptionQueries from "./subscription.queries";
import likesQueries from "./likes.queries";

export default gql`
  ${userQueries}
  ${topicQueries}
  ${replyQueries}
  ${subscriptionQueries}
  ${likesQueries}
`;
