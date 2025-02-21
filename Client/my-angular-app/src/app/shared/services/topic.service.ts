import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GET_TOPICS, CREATE_TOPIC } from '../gql/topic.gql';
import {
  CreateTopicInput,
  CreateTopicResponse,
  GetTopicsResponse,
  Topic,
} from '../interface/topic.interface';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  constructor(private apollo: Apollo) {}

  fetchTopics(): Observable<Topic[]> {
    return this.apollo
      .watchQuery<GetTopicsResponse>({ query: GET_TOPICS })
      .valueChanges.pipe(map(({ data }) => data?.getTopics || []));
  }

  createTopic(
    input: CreateTopicInput
  ): Observable<CreateTopicResponse['createTopic']> {
    return this.apollo
      .mutate<CreateTopicResponse>({
        mutation: CREATE_TOPIC,
        variables: { input },
      })
      .pipe(map(({ data }) => data!.createTopic)); // Extracts `createTopic`
  }
}
