import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GET_TOPICS, CREATE_TOPIC, GET_TOPIC_BY_ID } from '../gql/topic.gql';
import {
  CreateTopicInput,
  CreateTopicResponse,
  GetTopicsResponse,
  PaginatedTopics,
  Topic,
} from '../interface/topic.interface';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  constructor(private apollo: Apollo) {}

 addPoleVote(
    input: CreateTopicInput
  ): Observable<CreateTopicResponse['createTopic']> {
    return this.apollo
      .mutate<CreateTopicResponse>({
        mutation: CREATE_TOPIC,
        variables: { input },
        context: {},
      })
      .pipe(map(({ data }) => data!.createTopic));
  }
}