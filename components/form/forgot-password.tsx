'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { requestPasswordReset } from '@/lib/auth-client';
import { forgotPasswordEmailSchema } from '@/zod/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

export default function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const form = useForm<z.infer<typeof forgotPasswordEmailSchema>>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: {
      email: email,
    },
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(async () => {
      const { error } = await requestPasswordReset({
        email: email,
        redirectTo:
          'http://localhost:3000/login/forgot-account/forgot-password/reset-password',
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset link sent to your email');
      }
    });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </>
            )}
          />
          <Button type="submit" disabled={isPending} variant={'default'}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
