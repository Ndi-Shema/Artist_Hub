import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { client } from "@/app/lib/sanity";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 1) Fetch user doc from Sanity
        const userDoc = await client.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email: credentials.email }
        );
        if (!userDoc) return null; // no user found

        // 2) Compare the password
        const passwordMatch = await bcrypt.compare(credentials.password, userDoc.passwordHash);
        if (!passwordMatch) return null; // invalid password

        // 3) Return user object for session
        return {
          id: userDoc._id,
          email: userDoc.email,
          name: userDoc.name ?? "",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // custom login page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
