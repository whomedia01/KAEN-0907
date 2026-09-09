-- Official footer/site-settings values for Algo Partners.
-- Run this manually in Supabase SQL Editor for the target environment.
-- Do not publish date of birth or certificate QR/raw document data.

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
  '생활경제저널',
  '생활경제, 지역상권, 교육, 시니어, 건강, 창업 현장의 브랜드와 사람을 기록하는 생활경제 전문 미디어입니다.',
  'Algo Partners',
  '알고파트너스',
  '박예준',
  '450-07-03104',
  '제2025-인천서구-3321호',
  'unregistered',
  '박예준',
  '박예준',
  '박예준',
  '박예준',
  '인천광역시 서구 청라커낼로 270, 커낼힐스빌 2층 2498호 (청라동)',
  'contact@example.com',
  '000-0000-0000'
)
on conflict do nothing;

update site_settings
set
  operator_name = 'Algo Partners',
  business_name = '알고파트너스',
  representative_name = '박예준',
  business_registration_number = '450-07-03104',
  mail_order_registration_number = '제2025-인천서구-3321호',
  publisher_name = coalesce(nullif(publisher_name, ''), '박예준'),
  editor_name = coalesce(nullif(editor_name, ''), '박예준'),
  youth_protection_manager = coalesce(nullif(youth_protection_manager, ''), '박예준'),
  privacy_manager = coalesce(nullif(privacy_manager, ''), '박예준'),
  address = '인천광역시 서구 청라커낼로 270, 커낼힐스빌 2층 2498호 (청라동)',
  updated_at = now()
where site_name = '생활경제저널';
