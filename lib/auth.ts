import React from 'react';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db'; // your drizzle instance
import { nextCookies } from 'better-auth/next-js';
import { sendEmail } from '@/lib/email';
import { render } from '@react-email/components';
import PasswordResetEmail from '@/components/email/reset-password-email';
import AccountVerificationEmail from '@/components/email/verify-email';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      const emailHtml = await render(
        React.createElement(PasswordResetEmail, {
          userEmail: user.email,
          resetLink: url,
        }),
      );
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        html: emailHtml,
      });
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
  },

  // For email verification
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Convert the react email to html string
      const emailHtml = await render(
        React.createElement(AccountVerificationEmail, {
          userName: user.name || user.email,
          verificationLink: url,
        }),
      );
      // Use node mailer to sent the email
      await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        html: emailHtml,
      });
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
});
