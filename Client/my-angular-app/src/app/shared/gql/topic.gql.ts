import { gql } from 'apollo-angular';

export const GET_TOPICS = gql`
  query GetTopics {
    getTopics {
      id
      title
      description
      tags
      userId
      likes
      views
      repliesCount
      status
      userData {
        id
        fName
      }
    }
  }
`;

export const CREATE_TOPIC = gql`
  mutation createTopic($input: CreateTopicInput!) {
    createTopic(input: $input) {
      message
      topic {
        id
        userId
        title
        description
        likes
        views
        repliesCount
        tags
        status
      }
    }
  }
`;
