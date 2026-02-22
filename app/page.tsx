import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button variant="outline" asChild>
        <Link href={'/login'}>
          <LogIn className="size-4" />
          Login
        </Link>
      </Button>
    </div>
  );
}
