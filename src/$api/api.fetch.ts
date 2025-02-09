import { getServerSession } from "@/auth";
import { Session } from "next-auth";
import { getSession, signOut } from "next-auth/react";

export interface FetchParams<T = unknown> {
  path: string;
  method: string;
  isAuth: boolean;
  body?: T | FormData;
  headers?: Record<string, string>;
}

class FetchClient {
  private API_URL = process.env.API_URL as string;

  constructor(private defaultHeaders: Record<string, string> = {}) {}

  async get<T>(
    path: string,
    isAuth: boolean = false,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.fetch<T>({ path, method: "GET", isAuth, headers });
  }

  async post<T, B = unknown>(
    path: string,
    isAuth: boolean = false,
    body?: B | FormData,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.fetch<T, B>({ path, method: "POST", isAuth, body, headers });
  }

  async put<T, B = unknown>(
    path: string,
    isAuth: boolean = false,
    body?: B | FormData,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.fetch<T, B>({ path, method: "PUT", isAuth, body, headers });
  }

  async delete<T, B = unknown>(
    path: string,
    isAuth: boolean = false,
    body?: B | FormData,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.fetch<T, B>({ path, method: "DELETE", isAuth, body, headers });
  }

  async patch<T, B = unknown>(
    path: string,
    isAuth: boolean = false,
    body?: B | FormData,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.fetch<T, B>({ path, method: "PATCH", isAuth, body, headers });
  }

  async fetch<T, B = unknown>({
    path,
    method,
    isAuth,
    body,
    headers,
  }: FetchParams<B>): Promise<T> {
    const url = `${this.API_URL}${path}`;

    let session: Session | null = null;
    if (typeof window === "undefined") {
      session = await getServerSession();
    } else {
      session = await getSession();
    }
    const token = session?.token;
    const authorizationHeader: HeadersInit = isAuth
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};

    const isFormData = body instanceof FormData;

    let response: Response | null = null;
    let data: T | null = null;
    try {
      response = await fetch(url, {
        method,
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...authorizationHeader,
          ...this.defaultHeaders,
          ...headers,
        },
        body: body ? (isFormData ? body : JSON.stringify(body)) : null,
      });

      data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          await signOut({ redirect: true, callbackUrl: "/auth/login" });
          throw new Error("Unauthorized");
        }
        throw new Error("Fetch error: " + JSON.stringify(data));
      }
      return data as T;
    } catch (error) {
      console.error(error);
      throw {
        status: response?.status,
        data,
      };
    }
  }
}

export const $fetch = new FetchClient();
