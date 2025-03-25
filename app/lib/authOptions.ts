// lib/authOptions.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { client } from "@/app/lib/sanity";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const userDoc = await client.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email: credentials.email }
        );
        if (!userDoc) return null;

        const passwordMatch = await bcrypt.compare(credentials.password, userDoc.passwordHash);
        if (!passwordMatch) return null;

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
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
