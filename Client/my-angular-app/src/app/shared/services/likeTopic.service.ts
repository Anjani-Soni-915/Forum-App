import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TOKEN } from '../../app.config';
import { CREATE_TOPIC_LIKE } from '../gql/likeTopic.gql';
import {
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
    console.log('Sending token:', TOKEN);

    return this.apollo
      .mutate<{ createTopicLikes: CreateTopicLikesPayload }>({
        mutation: CREATE_TOPIC_LIKE,
        variables: { input },
        context: {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      })
      .pipe(map(({ data }) => data?.createTopicLikes!));
  }
}
