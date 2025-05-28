import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CREATE_REPLY_LIKE, CREATE_TOPIC_LIKE } from '../gql/likeTopic.gql';
import {
  CreateReplyLikesInput,
  CreateReplyLikesPayload,
  CreateTopicLikesInput,
  CreateTopicLikesPayload,
} from '../interface/likeTopic.interface';

@Injectable({
  providedIn: 'root',
})
export class LikeTopicService {
  constructor(private apollo: Apollo) {}

  createTopicLike(
    input: CreateTopicLikesInput
  ): Observable<CreateTopicLikesPayload> {
    return this.apollo
      .mutate<{ createTopicLikes: CreateTopicLikesPayload }>({
        mutation: CREATE_TOPIC_LIKE,
        variables: { input },
        context: {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem('accessToken') || ''
            }`,
          },
        },
      })
      .pipe(map(({ data }) => data?.createTopicLikes!));
  }

  createReplyLike(
    input: CreateReplyLikesInput
  ): Observable<CreateReplyLikesPayload> {
    return this.apollo
      .mutate<{ createReplyLikes: CreateReplyLikesPayload }>({
        mutation: CREATE_REPLY_LIKE,
        variables: { input },
        context: {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem('accessToken') || ''
            }`,
          },
        },
      })
      .pipe(map(({ data }) => data?.createReplyLikes!));
  }
}
