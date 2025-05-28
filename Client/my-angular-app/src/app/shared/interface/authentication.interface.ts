export interface User {
  id: string;
  fName: string;
  lName: string;
  email: string;
  image: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface CreateUserResponse {
  message: string;
  user: User;
  tokens: Tokens;
}

export interface CreateUserInput {
  fName: string;
  lName: string;
  email: string;
  image?: string;
  dob: string;
  profession: string;
  password: string;
}

export interface loginInput {
  email: string;
  password: string;
}
