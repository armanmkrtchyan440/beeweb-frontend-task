export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
}

export interface ISignUpRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface ISignUpResponse {
  access_token: string;
}
