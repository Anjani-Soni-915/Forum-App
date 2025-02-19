import userSchema from "./users.schema";
import { gql } from "apollo-server-express";

export default gql`
  ${userSchema}
`;
