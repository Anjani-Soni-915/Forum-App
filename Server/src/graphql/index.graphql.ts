import { gql } from "apollo-server-express";
import queries from "./queries/index.queries";
import mutations from "./mutations/index.mutation";
import schema from "./schemas/index.schemas";

export default gql`
  ${schema}
  ${queries}
  ${mutations}
`;
