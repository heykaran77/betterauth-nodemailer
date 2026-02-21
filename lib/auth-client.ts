import { createAuthClient } from 'better-auth/react';

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  baseURL: 'http://localhost:3000',
});

export const signInWithGoogle = async () => {
  const data = await signIn.social({
    provider: 'google',
    callbackURL: '/dashboard',
  });

  return data;
};
