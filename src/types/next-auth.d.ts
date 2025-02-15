import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    token: string;
  }

  interface Session {
    token: string;
    user: {} & DefaultSession["user"];
  }
}
