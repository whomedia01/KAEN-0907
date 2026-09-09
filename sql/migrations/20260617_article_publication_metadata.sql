alter table articles add column if not exists editorial_status text default 'planning';
alter table articles add column if not exists source_urls text[];
alter table articles add column if not exists source_note text;
alter table articles add column if not exists fact_checked boolean default false;
alter table articles add column if not exists is_imported_archive boolean default false;
alter table articles add column if not exists archive_source_label text;
alter table articles add column if not exists original_published_at timestamptz;
alter table articles add column if not exists imported_at timestamptz;
alter table articles add column if not exists scheduled_at timestamptz;

alter table articles drop constraint if exists articles_editorial_status_check;
alter table articles add constraint articles_editorial_status_check
  check (editorial_status in ('planning','writing','review','approved','scheduled','published','archived'));

create index if not exists idx_articles_scheduled_at on articles (scheduled_at);
create index if not exists idx_articles_original_published_at on articles (original_published_at);
create index if not exists idx_articles_editorial_status on articles (editorial_status);
