import type { Metadata } from 'next';
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';
import './globals.css';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { SiteJsonLd } from '@/components/seo/site-json-ld';
import { getSiteSettings } from '@/lib/data/public';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-noto-sans-kr'
});

const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  display: 'swap',
  variable: '--font-noto-serif-kr'
});

export const metadata: Metadata = {
  title: {
    default: '한국AI교육신문',
    template: '%s | 한국AI교육신문'
  },
  description: '한국AI교육신문 - AI 교육 전문 인터넷 신문',
  openGraph: {
    title: '한국AI교육신문',
    description: '한국AI교육신문 - AI 교육 전문 인터넷 신문',
    siteName: '한국AI교육신문',
    locale: 'ko_KR',
    type: 'website'
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="ko" className={`${notoSansKr.variable} ${notoSerifKr.variable}`}>
      <body className={`${notoSansKr.className} min-h-screen bg-white text-brand-ink antialiased`}>
        <SiteJsonLd settings={settings} />
        <PublicHeader />
        <main>{children}</main>
        <PublicFooter />
      </body>
    </html>
  );
}
