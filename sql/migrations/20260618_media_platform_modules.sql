-- MediaOffice advanced platform modules
-- Execute after the base schema and previous migrations.

alter table articles add column if not exists view_count integer default 0;
alter table articles add column if not exists is_premium boolean default false;
alter table articles add column if not exists paywall_excerpt text;
alter table articles add column if not exists display_order integer default 0;
alter table articles add column if not exists video_url text;
alter table articles add column if not exists pdf_url text;

create table if not exists article_views (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references articles(id) on delete cascade,
  visitor_hash text,
  user_agent text,
  referrer text,
  created_at timestamptz default now()
);
create index if not exists article_views_article_id_created_at_idx on article_views(article_id, created_at desc);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  file_url text not null,
  file_name text,
  mime_type text,
  alt_text text,
  caption text,
  credit text,
  license text,
  source_url text,
  rights_checked boolean default false,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null,
  target_url text,
  placement text not null default 'article_sidebar',
  starts_at timestamptz,
  ends_at timestamptz,
  advertiser_name text,
  is_active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists banners_active_placement_idx on banners(is_active, placement, starts_at, ends_at);

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  status text not null default 'subscribed',
  consented_at timestamptz default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists newsletter_issues (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  body_html text,
  article_ids uuid[] default '{}',
  status text not null default 'draft',
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  role text,
  organization text,
  bio text,
  profile_image_url text,
  category text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists people_name_idx on people(name);

create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  donor_email text,
  donor_name text,
  amount integer not null,
  provider text,
  payment_key text,
  status text not null default 'pending',
  created_at timestamptz default now(),
  paid_at timestamptz
);

create table if not exists premium_accesses (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references articles(id) on delete cascade,
  buyer_email text not null,
  payment_key text,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists publication_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz default now()
);
