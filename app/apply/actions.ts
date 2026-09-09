'use server';

import { headers } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function submitLead(formData: FormData) {
  const headerStore = await headers();
  const ip = headerStore.get('x-forwarded-for')?.split(',')[0] ?? headerStore.get('x-real-ip') ?? null;
  const userAgent = headerStore.get('user-agent');

  const requiredCheckboxes = ['privacy_agreed', 'terms_agreed', 'refund_policy_agreed', 'sponsored_policy_agreed', 'copyright_agreed', 'ad_content_acknowledged'];
  const missing = requiredCheckboxes.filter((key) => formData.get(key) !== 'on');
  if (missing.length > 0) {
    return { ok: false, message: '필수 동의 항목을 모두 확인해 주세요.' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('leads').insert({
    business_name: String(formData.get('business_name') ?? ''),
    owner_name: String(formData.get('owner_name') ?? ''),
    manager_name: String(formData.get('manager_name') ?? ''),
    industry: String(formData.get('industry') ?? ''),
    region: String(formData.get('region') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    website_url: String(formData.get('website_url') ?? ''),
    naver_place_url: String(formData.get('naver_place_url') ?? ''),
    desired_product: String(formData.get('desired_product') ?? ''),
    message: String(formData.get('message') ?? ''),
    privacy_agreed: true,
    terms_agreed: true,
    refund_policy_agreed: true,
    sponsored_policy_agreed: true,
    copyright_agreed: true,
    ad_content_acknowledged: true,
    marketing_agreed: formData.get('marketing_agreed') === 'on',
    email_marketing_agreed: formData.get('email_marketing_agreed') === 'on',
    sms_marketing_agreed: formData.get('sms_marketing_agreed') === 'on',
    phone_contact_agreed: formData.get('phone_contact_agreed') === 'on',
    consent_ip: ip,
    consent_user_agent: userAgent,
    consented_at: new Date().toISOString()
  });

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: '신청이 접수되었습니다. 확인 후 연락드리겠습니다.' };
}
