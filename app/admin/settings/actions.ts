'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { requireAdminUser } from '@/lib/admin/auth';

export async function saveSiteSettings(formData: FormData): Promise<void> {
  const user = await requireAdminUser();
  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();

  const payload = {
    id: String(formData.get('id') ?? 'main'),
    site_name: String(formData.get('site_name') ?? '에듀저널').trim(),
    site_description: String(formData.get('site_description') ?? '').trim(),
    operator_name: String(formData.get('operator_name') ?? '').trim() || null,
    business_name: String(formData.get('business_name') ?? '').trim() || null,
    representative_name: String(formData.get('representative_name') ?? '').trim() || null,
    business_registration_number: String(formData.get('business_registration_number') ?? '').trim() || null,
    mail_order_registration_number: String(formData.get('mail_order_registration_number') ?? '').trim() || null,
    media_registration_status: String(formData.get('media_registration_status') ?? 'preparing'),
    media_registration_number: String(formData.get('media_registration_number') ?? '').trim() || null,
    publisher_name: String(formData.get('publisher_name') ?? '').trim() || null,
    editor_name: String(formData.get('editor_name') ?? '').trim() || null,
    youth_protection_manager: String(formData.get('youth_protection_manager') ?? '').trim() || null,
    privacy_manager: String(formData.get('privacy_manager') ?? '').trim() || null,
    address: String(formData.get('address') ?? '').trim() || null,
    contact_email: String(formData.get('contact_email') ?? '').trim(),
    contact_phone: String(formData.get('contact_phone') ?? '').trim(),
    updated_at: now
  };

  const { error } = await supabase.from('site_settings').upsert(payload, { onConflict: 'id' });

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from('admin_activity_logs').insert({
    actor_email: user.email,
    action: 'site_settings.upsert',
    target_table: 'site_settings',
    target_id: payload.id,
    details: { site_name: payload.site_name },
    created_at: now
  });

  revalidatePath('/');
  revalidatePath('/company');
  revalidatePath('/about');
  redirect('/admin/settings');
}
