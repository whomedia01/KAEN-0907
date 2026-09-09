alter table articles add column if not exists image_caption text;
alter table articles add column if not exists image_source_name text;
alter table articles add column if not exists image_source_url text;
alter table articles add column if not exists image_author text;
alter table articles add column if not exists image_license text;
alter table articles add column if not exists image_license_url text;
alter table articles add column if not exists visual_mode text default 'auto';

alter table articles drop constraint if exists articles_visual_mode_check;
alter table articles add constraint articles_visual_mode_check check (visual_mode in ('auto','text_card','photo','none'));

update site_settings
set operator_name = 'Algo Partners',
    business_name = '알고파트너스'
where site_name = '생활경제저널';
