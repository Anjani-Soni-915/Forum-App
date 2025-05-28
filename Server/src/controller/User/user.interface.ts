export interface CreateUserInput {
  fName: string;
  lName: string;
  email: string;
  image: string;
  dob: string;
  interest: object;
  password: string;
  status: boolean;
}

export interface UpdateUserInput {
  fName?: string;
  lName?: string;
  email?: string;
  image?: string;
  dob?: string;
  // interest: object;
  password?: string;
  status?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}
