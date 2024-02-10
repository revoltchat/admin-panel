import type { AuthOptions } from "next-auth";
import AuthentikProvider from "next-auth/providers/authentik";

/**
 * Authentication options
 */
export const authOptions: AuthOptions = {
  providers: [
    AuthentikProvider({
      clientId: process.env.AUTHENTIK_ID!,
      clientSecret: process.env.AUTHENTIK_SECRET!,
      issuer: process.env.AUTHENTIK_ISSUER!,
    }),
  ],
  jwt: {
    maxAge: 2 * 60 * 60, // 2 hours
  },
  pages: {
    signIn: "/",
  },
};
