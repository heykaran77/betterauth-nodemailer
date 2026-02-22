'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { requestPasswordReset } from '@/lib/auth-client';
import { forgotAccount } from '@/server/auth';
import {
  forgotAccountSchema,
  forgotPasswordEmailSchema,
  forgotPasswordSchema,
} from '@/zod/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
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
  const [message, setMessage] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: z.infer<typeof forgotPasswordEmailSchema>) => {
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
          {message && <FieldDescription>{message}</FieldDescription>}
        </Field>
      </FieldGroup>
    </form>
  );
}
