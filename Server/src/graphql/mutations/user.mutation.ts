import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    createUser(input: CreateUserInput!): UserResponse
    login(input: LoginInput!): UserResponse
    updateUser(id: Int!, input: UpdateUserInput!): UserResponse
    deleteUser(id: Int!): String
  }
`;
