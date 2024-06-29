import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { UserModel } from "@/model/User";
import connectDB from "@/lib/connectDb";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        connectDB();

        try {
          const user = await UserModel.findOne({
            $or: [
              {
                email: credentials.identifier,
              },
              {
                userName: credentials.identifier,
              },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email first");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid email or password");
          }

          return user;
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token._id = user._id?.toString(),
        token.email = user.email,
        token.isAcceptingMessages = user.isAcceptingMessages,
        token.isVerified = user.isVerified,
        token.username = user.userame
      }
      return token
    },
    async session({token, session}) {
      if (token) {
        session.user._id = token._id
        session.user.email = token._id
        session.user.isAcceptingMessages = token.isAcceptingMessages
        session.user.isVerified = token.isVerified
        session.user.username = token.username
      }
      
      return session
    }
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
