import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import {
  NotificationInfo,
  UpdateNotificationInfoInput,
  UpdateNotificationInfoResponse,
} from '../interface/notification.interface';
import { GET_NOTIFICATION, UPDATE_IS_READ } from '../gql/notifiation.gql';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private apollo: Apollo) {}

  fetchNotification(): Observable<NotificationInfo[]> {
    return this.apollo
      .watchQuery<{ getNotificationInfo: NotificationInfo[] }>({
        query: GET_NOTIFICATION,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(
        map(({ data }) => {
          console.log('Mapped Data:', data?.getNotificationInfo);
          return data?.getNotificationInfo || [];
        })
      );
  }

  UpdateReadstatus(
    ids: number[],
    input: UpdateNotificationInfoInput
  ): Observable<UpdateNotificationInfoResponse['updateNotificationinfo']> {
    return this.apollo
      .mutate<UpdateNotificationInfoResponse>({
        mutation: UPDATE_IS_READ,
        variables: { ids, input },
      })
      .pipe(map(({ data }) => data!.updateNotificationinfo));
  }
}
