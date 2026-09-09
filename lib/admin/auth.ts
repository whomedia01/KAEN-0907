import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function allowedEmails() {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const allowed = allowedEmails();
  if (allowed.length && !allowed.includes(user.email.toLowerCase())) return null;

  return user;
}

export async function requireAdminUser() {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');
  return user;
}
