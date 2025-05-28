import { gql } from 'apollo-angular';

export const CREATE_REPLY = gql`
  mutation createReply($input: CreateReplyInput!) {
    createReply(input: $input) {
      message
      reply {
        id
        userId
        topicId
        text
        likes
        status
        userData {
          id
          fName
          lName
          image
        }
      }
    }
  }
`;
