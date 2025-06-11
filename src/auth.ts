import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 600, // ⏱️ 10 minutes in seconds
  },
  callbacks: {
    async signIn({ user }) {
      const allowedEmail = process.env.ADMIN_EMAIL;
      //   return user.email === allowedEmail;
      const allowedEmails = process.env.ADMIN_EMAILS?.split(",") || [];
      return allowedEmails.includes(user.email as string);
    },
  },
});
