import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CREATE_SUBSCRIPTION } from '../gql/subscription.gql';
import { map, Observable } from 'rxjs';
import {
  CreateSubInput,
  SubscriptionResponse,
} from '../interface/subscription.interface';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  unsubscribe(arg0: { topicId: number }) {
    throw new Error('Method not implemented.');
  }
  constructor(private apollo: Apollo) {}

  createSubscription(input: CreateSubInput): Observable<SubscriptionResponse> {
    return this.apollo
      .mutate<{ createSubscription: SubscriptionResponse }>({
        mutation: CREATE_SUBSCRIPTION,
        variables: { input },
        context: {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem('accessToken') || ''
            }`,
          },
        },
      })
      .pipe(map(({ data }) => data?.createSubscription!));
  }
}
