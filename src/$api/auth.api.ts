import { $fetch } from "@/$api/api.fetch";
import {
  ILoginRequest,
  ILoginResponse,
  ISignUpRequest,
  ISignUpResponse,
} from "@/types";

export function login(body: ILoginRequest) {
  return $fetch.post<ILoginResponse>("/auth/login", false, body);
}

export function signUp(body: ISignUpRequest) {
  return $fetch.post<ISignUpResponse>("/auth/register", false, body);
}
