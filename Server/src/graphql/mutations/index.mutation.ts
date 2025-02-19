import { gql } from "apollo-server-express";
import userMutations from "./user.mutation";

export default gql`
  ${userMutations}
`;
