import NextAuth, { Session, User } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import prisma from "../../../lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import mailgun from "../../../lib/mailgun";
import { JWT } from "next-auth/jwt";
import { PROJECT_DOMAIN } from "../../../lib/constants";

type SendVerificationRequestArgs = {
  identifier: string;
  url: string;
  expires: Date;
  provider: any; // See: EmailConfig
  token: string;
};

export default NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    maxAge: 30 * 24 * 60 * 60,
  },

  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
      sendVerificationRequest: function (
        args: SendVerificationRequestArgs
      ): Promise<void> {
        // this function sense the login email
        // for password-less login.
        return mailgun.send({
          to: args.identifier,
          from: `noreply@${PROJECT_DOMAIN}`,
          subject: `Finish signing in!`,
          body: `
            <html>
            <body>
              <h1>Login Verification</h1>
              <p><a href="${args.url}">Click here to continue logging in!</a></p>
            </body>
            </html>
            `,
        });
      },
    }),
  ],

  callbacks: {
    session: async function (params: {
      session: Session;
      user: User; // user data from DB
      token: JWT; // not used
    }): Promise<Session> {
      if (params.session.user) {
        // copy user data coming from DB into session user object
        // that's returned to client.
        params.session.user.id = params.user.id;
      }
      return params.session;
    },
  },
});
