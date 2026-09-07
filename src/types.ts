export type ArticleStatus = 'draft' | 'scheduled' | 'published';

export interface FAQItem {
  q: string;
  a: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  categoryId: string;
  authorId: string;
  imageUrl: string;
  imageCaption: string;
  imageCopyright: string;
  status: ArticleStatus;
  scheduledAt: string | null;
  createdAt: string;
  viewCount: number;
  tags: string[];
  isHero: boolean;
  isOpinion: boolean;
  isPhoto: boolean;
  videoUrl?: string;
  faqList?: FAQItem[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
}

export interface Author {
  id: string;
  name: string;
  role: 'Admin' | 'Editor' | 'Reporter' | 'Citizen' | 'Viewer';
  email: string;
  avatarUrl: string;
  bio: string;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Revision {
  id: string;
  articleId: string;
  title: string;
  content: string;
  modifiedBy: string;
  changeReason: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  caption: string;
  alt: string;
  copyright: string;
  source: string;
  size: string;
  mimeType: string;
  createdAt: string;
}

export interface SiteSetting {
  newspaperName: string;
  companyName?: string;
  representative: string;
  businessLicenseNo: string;
  registrationNo?: string;
  registrationDate?: string;
  address: string;
  phone: string;
  fax?: string;
  email: string;
  youthOfficer: string;
  grievanceOfficer?: string;
  privacyPolicy: string;
  termsOfService: string;
  youthPolicy: string;
  correctionGuide: string;
  tipGuide: string;
  logoUrl: string;
  adsenseApproved: boolean;
  adsenseActive: boolean;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  githubRepo?: string;
  githubToken?: string;
  vercelWebhook?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface MainLayoutItem {
  sectionId: string;
  name: string;
  displayOrder: number;
  enabled: boolean;
}

export interface AutomationLog {
  id: string;
  timestamp: string;
  articleId?: string;
  title?: string;
  categoryName?: string;
  factScore: number;
  status: 'success' | 'warn' | 'info';
  message: string;
}

export interface CategoryTimeSlot {
  categoryId: string;
  categoryName: string;
  timeSlot: string; // HH:mm:ss Format, e.g. "04:18:32"
  nextRunTimestamp: string; // Full ISO date time
  enabled: boolean;
}

export interface AutomationSettings {
  enabled: boolean;
  scheduleMode: '24h_staggered' | 'daily_edition' | 'interval' | 'realtime';
  morningReleaseTime: string;
  eveningReleaseTime: string;
  dailyTargetCount: number;
  autoPublish: boolean;
  factCheckStrictness: 'strict' | 'standard';
  includeLegalDisclaimer: boolean;
  categorySlots: CategoryTimeSlot[];
  lastAutoRunTime: string | null;
  nextScheduledTime: string | null;
  totalAutoPublishedCount: number;
  logs: AutomationLog[];
}

