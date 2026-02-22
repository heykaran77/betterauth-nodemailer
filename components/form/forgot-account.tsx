'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { forgotAccount } from '@/server/auth';
import { forgotAccountSchema } from '@/zod/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

export default function ForgotAccountForm() {
  const form = useForm<z.infer<typeof forgotAccountSchema>>({
    resolver: zodResolver(forgotAccountSchema),
    defaultValues: {
      email: '',
    },
  });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = (data: z.infer<typeof forgotAccountSchema>) => {
    startTransition(async () => {
      const res = await forgotAccount(data.email);
      if (res) {
        toast.success('Account found');
        router.push(
          `/login/forgot-account/forgot-password?email=${encodeURIComponent(
            data.email,
          )}`,
        );
      } else {
        toast.error('Account not found, SignUp to continue');
        router.push('/signup');
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
                Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
