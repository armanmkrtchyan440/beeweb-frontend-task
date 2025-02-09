import { authOptions } from "@/auth";
import NextAuth from "next-auth";

// Use NextAuth as the route handler
const handler = NextAuth(authOptions);

// Export route handler as the POST method
export { handler as GET, handler as POST };
