import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

import User from "@/database/models/user.model";
import { connectToDatabase } from "@/database/mongoose";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI must be set within .env");
}

declare global {
  var stockVistaMongoClientPromise: Promise<MongoClient> | undefined;
}

const mongoClient = new MongoClient(mongoUri);
const clientPromise =
  global.stockVistaMongoClientPromise ?? mongoClient.connect();

if (process.env.NODE_ENV !== "production") {
  global.stockVistaMongoClientPromise = clientPromise;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string" ||
          !credentials.email.trim() ||
          !credentials.password
        ) {
          return null;
        }

        await connectToDatabase();

        const email = credentials.email.trim().toLowerCase();
        const user = await User.findOne({ email }).select("+verificationToken");

        if (!user) return null;

        // Block password login until email is verified.
        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in.");
        }

        if (!user.password) {
          throw new Error(
            "This account uses Google or GitHub. Please sign in with your provider.",
          );
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image ?? null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  events: {
    async linkAccount({ user }) {
      if (!user.email) return;
      await connectToDatabase();
      await User.updateOne(
        { email: user.email.toLowerCase() },
        { $set: { emailVerified: new Date() } },
      );
    },
  },

  pages: {
    signIn: "/sign-in",
  },
});
