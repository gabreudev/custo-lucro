import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import SideNavbar from '@/components/side-nav-bar';

export default async function UserAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/');
  }
  
  return (
    <div className="min-h-screen w-full bg-white text-black flex">
      <SideNavbar />
      <main className="p-8 w-full">
        {children}
      </main>
    </div>
  );
}