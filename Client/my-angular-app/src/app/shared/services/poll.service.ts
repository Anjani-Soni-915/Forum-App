import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PollVoteInput } from '../interface/poll.interface';
import { ADD_POLL_VOTE } from '../gql/poll.gql';

@Injectable({
  providedIn: 'root',
})
export class PollService {
  constructor(private apollo: Apollo) {}

  addPollVote(input: PollVoteInput): Observable<any> {
    console.log('Adding poll vote with input:', input);
    return this.apollo
      .mutate<any>({
        mutation: ADD_POLL_VOTE,
        variables: { input },
        context: {},
      })
      .pipe(map(({ data }) => data!.createTopic));
  }
}
