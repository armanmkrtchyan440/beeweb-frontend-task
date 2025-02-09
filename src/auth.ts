import { login } from "@/$api";
import { ILoginRequest } from "@/types";
import { AuthOptions, getServerSession as getSession, User } from "next-auth";
import { JWT } from "next-auth/jwt"; // Import JWT type
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) throw new Error("Missing credentials");

          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          if (!email || !password) {
            throw new Error("Email and password are required");
          }

          // Prepare the login request object
          const loginRequest: ILoginRequest = { email, password };
          const loginData = await login(loginRequest);

          if (loginData?.access_token) {
            return {
              id: Date.now().toString(), // Replace with user ID if available
              token: loginData.access_token,
            };
          } else {
            throw new Error("Invalid login response");
          }
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes
    updateAge: 0,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.token = user.token;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.token = token.token as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getServerSession = () => getSession(authOptions);
