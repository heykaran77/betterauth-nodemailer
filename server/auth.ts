'use server';

import { db } from '@/db';
import { auth } from '@/lib/auth';
import { APIError } from 'better-auth';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function signUpUser(
  name: string,
  email: string,
  password: string,
) {
  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case 'BAD_REQUEST':
          return { success: false, message: 'Invalid email or password' };
        case 'UNPROCESSABLE_ENTITY':
          return {
            success: false,
            message: 'User already exists',
          };
        default:
          return { success: false, message: 'SignUp Failed' };
      }
    }
    const e = error as Error;
    return { success: false, message: e.message || 'SignUp Failed' };
  }

  redirect('/login');
}

export async function signInUser(email: string, password: string) {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case 'BAD_REQUEST':
          return { success: false, message: 'Invalid email or password' };
        case 'UNPROCESSABLE_ENTITY':
          return {
            success: false,
            message: 'User already exists',
          };
        default:
          return { success: false, message: error.message || 'SignIn Failed' };
      }
    }
    const e = error as Error;
    return { success: false, message: e.message || 'SignIn Failed' };
  }

  redirect('/dashboard');
}

export async function forgotAccount(email: string) {
  const foundUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  });

  return !!foundUser;
}
