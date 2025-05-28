import { gql } from 'apollo-angular';

export const LOGIN_API = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      message
      user {
        id
        fName
        lName
        email
        image
      }
      tokens {
        accessToken
        refreshToken
      }
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      message
      user {
        id
        fName
        lName
        email
        image
      }
      tokens {
        accessToken
        refreshToken
      }
    }
  }
`;
