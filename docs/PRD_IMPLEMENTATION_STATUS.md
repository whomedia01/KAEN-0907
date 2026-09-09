# PRD Implementation Status

This document tracks the 21 platform requirements for MediaOffice.

## Implemented in code

- Admin module navigation and system dashboard
- Public article pages and article layout
- AdSense gated rendering and ads.txt endpoint
- Official footer information structure
- Supabase admin client helper
- Scheduled publishing API route
- Vercel cron configuration
- RSS route shell
- Search API shell
- Extended database migration for media platform modules
- Premium page shell
- PDF archive page shell
- Support page shell
- Person directory page shell

## Requires Supabase migration

Run all SQL files under `sql/migrations` after `sql/schema.sql` and `sql/seed.sql`.

## Requires external dashboard setup

- GitHub branch protection rule
- Vercel Production / Preview / Development environment separation
- Supabase PITR / backup policy
- Vercel Analytics / Speed Insights activation
- AdSense publisher ID and slot IDs
- Payment provider keys
- Resend or SendGrid API key

## Next implementation targets

- Full WYSIWYG block editor
- Supabase Storage upload manager
- Main article placement drag-and-drop
- Full text search API and UI
- RBAC by Supabase Auth metadata
- Newsletter sending worker
- Paywall and donation checkout
- PDF viewer
- TTS client component
