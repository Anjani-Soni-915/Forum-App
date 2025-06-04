import { gql } from 'apollo-angular';

export const ADD_POLL_VOTE = gql`
  mutation addPollVote($input: PollVoteInput!) {
    addPollVote(input: $input) {
      message
    }
  }
`;
