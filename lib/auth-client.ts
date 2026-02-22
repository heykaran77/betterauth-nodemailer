import { createAuthClient } from 'better-auth/react';

export const {
  signIn,
  signUp,
  signOut,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
} = createAuthClient({
  baseURL: 'http://localhost:3000',
});

export const signInWithGoogle = async () => {
  const data = await signIn.social({
    provider: 'google',
    callbackURL: '/dashboard',
  });

  return data;
};
