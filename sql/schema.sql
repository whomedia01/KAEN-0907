create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text default 'admin',
  created_at timestamptz default now()
);

create table if not exists site_settings (
  id uuid primary key default uuid_generate_v4(),
  site_name text not null default '생활경제저널',
  site_description text not null default '생활경제, 지역상권, 교육, 시니어, 건강, 창업 현장의 브랜드와 사람을 기록하는 생활경제 전문 미디어입니다.',
  operator_name text default 'Algo Partners',
  business_name text default '알고파트너스',
  representative_name text default '박예준',
  business_registration_number text,
  mail_order_registration_number text,
  media_registration_status text default 'unregistered' check (media_registration_status in ('unregistered','preparing','registered')),
  media_registration_number text,
  media_registered_at date,
  publisher_name text,
  editor_name text,
  youth_protection_manager text,
  privacy_manager text,
  address text,
  contact_email text default 'contact@example.com',
  contact_phone text default '000-0000-0000',
  logo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  business_name text not null,
  owner_name text,
  manager_name text,
  industry text,
  region text,
  phone text,
  email text,
  website_url text,
  naver_place_url text,
  source text,
  interested_product text,
  status text default '미접촉',
  memo text,
  next_contact_at timestamptz,
  expected_amount integer,
  paid_amount integer,
  privacy_agreed boolean default false,
  terms_agreed boolean default false,
  sponsored_policy_agreed boolean default false,
  copyright_agreed boolean default false,
  ad_content_acknowledged boolean default false,
  marketing_agreed boolean default false,
  email_marketing_agreed boolean default false,
  sms_marketing_agreed boolean default false,
  phone_contact_agreed boolean default false,
  consent_ip text,
  consent_user_agent text,
  consented_at timestamptz,
  marketing_withdrawn_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  subtitle text,
  summary text,
  content text,
  category_id uuid references categories(id),
  article_type text default 'normal' check (article_type in ('normal','brand_interview','sponsored','advertorial','press_release')),
  status text default 'draft' check (status in ('draft','review','published','archived')),
  thumbnail_url text,
  image_caption text,
  image_source_name text,
  image_source_url text,
  image_author text,
  image_license text,
  image_license_url text,
  visual_mode text default 'auto' check (visual_mode in ('auto','text_card','photo','none')),
  author_name text default '편집부',
  client_id uuid references clients(id),
  is_sponsored boolean default false,
  sponsored_notice text,
  tags text[],
  seo_title text,
  seo_description text,
  compliance_checked boolean default false,
  forbidden_terms_detected text[],
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  business_name text,
  owner_name text,
  manager_name text,
  industry text,
  region text,
  phone text,
  email text,
  website_url text,
  naver_place_url text,
  desired_product text,
  message text,
  status text default '신규',
  privacy_agreed boolean default false,
  terms_agreed boolean default false,
  refund_policy_agreed boolean default false,
  sponsored_policy_agreed boolean default false,
  copyright_agreed boolean default false,
  ad_content_acknowledged boolean default false,
  marketing_agreed boolean default false,
  email_marketing_agreed boolean default false,
  sms_marketing_agreed boolean default false,
  phone_contact_agreed boolean default false,
  consent_ip text,
  consent_user_agent text,
  consented_at timestamptz,
  marketing_withdrawn_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  price integer not null,
  description text,
  features text[],
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id),
  product_id uuid references products(id),
  amount integer,
  payment_status text default 'unpaid' check (payment_status in ('unpaid','paid','refunded','cancelled')),
  production_status text default 'waiting' check (production_status in ('waiting','payment_completed','material_requested','material_received','planning','draft_created','client_review','published','delivered','completed')),
  refund_status text default 'none' check (refund_status in ('none','requested','reviewing','approved','rejected','completed')),
  refund_requested_at timestamptz,
  refund_amount integer,
  refund_reason text,
  work_started_at timestamptz,
  draft_created_at timestamptz,
  client_approved_at timestamptz,
  published_at timestamptz,
  delivered_at timestamptz,
  memo text,
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists outreach_logs (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id),
  contact_type text check (contact_type in ('phone','sms','email','kakao','memo')),
  message text,
  result text,
  next_action text,
  next_contact_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists deliveries (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id),
  article_url text,
  blog_content text,
  place_description text,
  card_news_copy text,
  certificate_copy text,
  plaque_copy text,
  delivery_email text,
  status text default '준비 전',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists templates (
  id uuid primary key default uuid_generate_v4(),
  title text,
  type text,
  content text,
  variables text[],
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  related_client_id uuid references clients(id),
  related_article_id uuid references articles(id),
  due_date timestamptz,
  status text default 'todo',
  priority text default 'normal',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
