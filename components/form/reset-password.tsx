'use client';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import { forgotPasswordSchema } from '@/zod/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';

export default function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing token');
    }
  }, [token]);

  const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    startTransition(async () => {
      if (data.password !== data.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (!token) {
        toast.error('Invalid or missing token');
        return;
      }
      const { error } = await resetPassword({
        token,
        newPassword: data.password,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset successful');
        router.push('/login');
      }
    });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Password</FieldLabel>
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </>
            )}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Confirm Password</FieldLabel>
          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="********"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </>
            )}
          />
        </Field>
        <Button type="submit" disabled={isPending} variant={'default'}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
