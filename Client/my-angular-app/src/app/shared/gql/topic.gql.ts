import { gql } from 'apollo-angular';

export const GET_TOPICS = gql`
  query GetTopics($page: Int!, $pageSize: Int!) {
    getTopics(page: $page, pageSize: $pageSize) {
      totalItems
      totalPages
      currentPage
      topics {
        id
        title
        description
        tags
        userId
        likes
        views
        repliesCount
        status
        createdAt
        updatedAt
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
export const GET_TOPIC_BY_ID = gql`
  query GetTopicById($id: Int!) {
    getTopicById(id: $id) {
      id
      title
      description
      tags
      repliesCount
      likes
      views
      createdAt
      userData {
        id
        lName
        fName
        image
        profession
      }
      replyData {
        id
        text
        likes
        status
        createdAt
        replyLikesData {
          id
          status
          userId
          replyId
        }
        userData {
          id
          fName
          lName
          image
        }
      }
      topicLikesData {
        id
        userId
        topicId
        status
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
      }
    }
  }
`;
