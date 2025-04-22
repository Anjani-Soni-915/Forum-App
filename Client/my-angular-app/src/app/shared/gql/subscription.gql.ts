import { gql } from 'apollo-angular';

export const CREATE_SUBSCRIPTION = gql`
  mutation createSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      message
      subscription {
        id
        userId
        topicId
        status
        userData {
          id
          fName
        }
        topicData {
          id
          title
        }
      }
    }
  }
`;
