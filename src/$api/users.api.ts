import { $fetch } from "@/$api/api.fetch";
import { IUser } from "@/types";

export function fetchMe() {
  return $fetch.get<IUser>("/users/me", true);
}
