-- Official footer/site-settings values for (주)후미디어.
-- Run this manually in Supabase SQL Editor for the target environment.

insert into site_settings (
  site_name,
  site_description,
  operator_name,
  business_name,
  representative_name,
  business_registration_number,
  mail_order_registration_number,
  media_registration_status,
  publisher_name,
  editor_name,
  youth_protection_manager,
  privacy_manager,
  address,
  contact_email,
  contact_phone
)
values (
  '에듀저널',
  '평생교육, 자격증, 시니어 학습, 에듀테크, 교육기관 정보를 다루는 교육 전문 인터넷매체입니다.',
  '(주)후미디어',
  '(주)후미디어',
  '황광성',
  '119-86-25861',
  '제2025-서울금천-0000호',
  'preparing',
  '황광성',
  '황광성',
  '황광성',
  '황광성',
  '서울특별시 금천구 가산디지털2로 53 (가산동) 한라시그마밸리 1102호 ~ 1104호',
  'whomedia03@gmail.com',
  '02-6443-4222'
)
on conflict do nothing;

update site_settings
set
  operator_name = '(주)후미디어',
  business_name = '(주)후미디어',
  representative_name = '황광성',
  business_registration_number = '119-86-25861',
  publisher_name = coalesce(nullif(publisher_name, ''), '황광성'),
  editor_name = coalesce(nullif(editor_name, ''), '황광성'),
  youth_protection_manager = coalesce(nullif(youth_protection_manager, ''), '황광성'),
  privacy_manager = coalesce(nullif(privacy_manager, ''), '황광성'),
  address = '서울특별시 금천구 가산디지털2로 53 (가산동) 한라시그마밸리 1102호 ~ 1104호',
  contact_email = 'whomedia03@gmail.com',
  contact_phone = '02-6443-4222',
  updated_at = now();
