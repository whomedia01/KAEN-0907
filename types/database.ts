export type MediaRegistrationStatus = 'unregistered' | 'preparing' | 'registered';
export type ArticleType = 'normal' | 'brand_interview' | 'sponsored' | 'advertorial' | 'press_release';
export type ArticleStatus = 'draft' | 'review' | 'published' | 'scheduled' | 'archived';
export type ArticleVisualMode = 'auto' | 'text_card' | 'photo' | 'none';
export type EditorialStatus = 'planning' | 'writing' | 'review' | 'approved' | 'scheduled' | 'published' | 'archived';

export interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  operator_name?: string | null;
  business_name?: string | null;
  representative_name?: string | null;
  business_registration_number?: string | null;
  mail_order_registration_number?: string | null;
  media_registration_status: MediaRegistrationStatus;
  media_registration_number?: string | null;
  media_registered_at?: string | null;
  publisher_name?: string | null;
  editor_name?: string | null;
  youth_protection_manager?: string | null;
  privacy_manager?: string | null;
  address?: string | null;
  contact_email: string;
  contact_phone: string;
  logo_url?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sort_order: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  summary?: string | null;
  content?: string | null;
  category_id?: string | null;
  article_type: ArticleType;
  status: ArticleStatus;
  editorial_status?: EditorialStatus | null;
  thumbnail_url?: string | null;
  image_caption?: string | null;
  image_source_name?: string | null;
  image_source_url?: string | null;
  image_author?: string | null;
  image_license?: string | null;
  image_license_url?: string | null;
  visual_mode?: ArticleVisualMode;
  author_name: string;
  client_id?: string | null;
  is_sponsored: boolean;
  sponsored_notice?: string | null;
  tags?: string[] | null;
  seo_title?: string | null;
  seo_description?: string | null;
  source_urls?: string[] | null;
  source_note?: string | null;
  fact_checked?: boolean | null;
  is_imported_archive?: boolean | null;
  archive_source_label?: string | null;
  original_published_at?: string | null;
  imported_at?: string | null;
  scheduled_at?: string | null;
  compliance_checked?: boolean;
  forbidden_terms_detected?: string[] | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string | null;
  features?: string[] | null;
  is_active: boolean;
  sort_order: number;
}
