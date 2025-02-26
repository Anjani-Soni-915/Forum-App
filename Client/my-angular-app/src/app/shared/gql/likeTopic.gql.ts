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
