import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    createUser(input: CreateUserInput!): UserResponse
    login(input: LoginInput!): UserResponse
    updateUser(input: UpdateUserInput!): UserResponse
    deleteUser(id: Int!): String
  }
`;
