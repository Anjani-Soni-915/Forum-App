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
import { TOKEN } from '../../app.config';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  constructor(private apollo: Apollo) {}
  fetchTopicById(topicId: number): Observable<Topic | null> {
    return this.apollo
      .watchQuery<{ getTopicById: Topic }>({
        query: GET_TOPIC_BY_ID,
        variables: { id: Number(topicId) },
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map(({ data }) => {
          return data?.getTopicById || null;
        })
      );
  }

  fetchTopics(
    page: number = 1,
    pageSize: number = 10
  ): Observable<PaginatedTopics> {
    return this.apollo
      .watchQuery<{ getTopics: PaginatedTopics }>({
        query: GET_TOPICS,
        variables: { page, pageSize },
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map(({ data }) => {
          return data?.getTopics;
        })
      );
  }

  createTopic(
    input: CreateTopicInput
  ): Observable<CreateTopicResponse['createTopic']> {
    console.log('Sending token:', TOKEN);

    return this.apollo
      .mutate<CreateTopicResponse>({
        mutation: CREATE_TOPIC,
        variables: { input },
        context: {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      })
      .pipe(map(({ data }) => data!.createTopic));
  }
}
