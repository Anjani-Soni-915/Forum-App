import { gql } from "apollo-server-express";
import userQueries from "./user.query";

export default gql`
  ${userQueries}
`;
