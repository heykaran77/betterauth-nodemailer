import { signOut } from '@/lib/auth-client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LogOutUser() {
  const router = useRouter();
  const handleClick = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Logged out!');
          router.push('/login');
        },
        onError: () => {
          toast.error('Logout Failed');
        },
      },
    });
  };

  return (
    <div className="flex items-center gap-2" onClick={handleClick}>
      <LogOut />
      Log out
    </div>
  );
}
