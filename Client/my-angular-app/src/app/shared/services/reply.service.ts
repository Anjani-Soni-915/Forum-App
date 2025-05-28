import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreateReplyInput,
  CreateReplyResponse,
} from '../interface/reply.interface';
import { CREATE_REPLY } from '../gql/reply.gql';

@Injectable({
  providedIn: 'root',
})
export class ReplyService {
  constructor(private apollo: Apollo) {}

  createReply(input: CreateReplyInput): Observable<CreateReplyResponse> {
    return this.apollo
      .mutate<{ createReply: CreateReplyResponse }>({
        mutation: CREATE_REPLY,
        variables: { input },
      })
      .pipe(
        map((response) => {
          if (!response.data) {
            throw new Error('No data received');
          }
          return response.data.createReply;
        })
      );
  }

  updateReply(input: CreateReplyInput): Observable<CreateReplyResponse> {
    return this.apollo
      .mutate<{ createReply: CreateReplyResponse }>({
        mutation: CREATE_REPLY,
        variables: { input },
      })
      .pipe(
        map((response) => {
          if (!response.data) {
            throw new Error('No data received');
          }
          return response.data.createReply;
        })
      );
  }
}
