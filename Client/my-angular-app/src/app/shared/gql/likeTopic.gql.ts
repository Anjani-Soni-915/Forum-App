import { gql } from 'apollo-angular';
export const CREATE_TOPIC_LIKE = gql`
  mutation createTopicLike($input: CreateTopicLikesInput!) {
    createTopicLikes(input: $input) {
      message
      topicLikes {
        id
        userId
        topicId
        status
      }
    }
  }
`;

export const CREATE_REPLY_LIKE = gql`
  mutation createReplyLike($input: CreateReplyLikesInput!) {
    createReplyLikes(input: $input) {
      message
      replyLikes {
        id
        userId
        replyId
        status
      }
    }
  }
`;
