import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CREATE_USER_MUTATION, LOGIN_API } from '../gql/authentication.gql';
import {
  CreateUserResponse,
  CreateUserInput,
  loginInput,
} from '../interface/authentication.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  login(input: loginInput): Observable<CreateUserResponse> {
    return this.apollo
      .mutate<{ login: CreateUserResponse }>({
        mutation: LOGIN_API,
        variables: { input },
      })
      .pipe(
        map((response) => {
          if (!response.data) {
            throw new Error('No data received');
          }
          return response.data.login;
        })
      );
  }

  createUser(input: CreateUserInput): Observable<CreateUserResponse> {
    return this.apollo
      .mutate<{ createUser: CreateUserResponse }>({
        mutation: CREATE_USER_MUTATION,
        variables: { input },
      })
      .pipe(
        map((response) => {
          if (!response.data) {
            throw new Error('No data received');
          }
          return response.data.createUser;
        })
      );
  }
}
