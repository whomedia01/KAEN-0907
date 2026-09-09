import type { SiteSettings } from '@/types/database';

export function SiteJsonLd({ settings }: { settings?: Partial<SiteSettings> | null }) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsMediaOrganization',
        '@id': 'https://www.whomedia.co.kr/#organization',
        name: settings?.site_name || '한국AI교육신문',
        alternateName: 'Korea AI Education News',
        legalName: settings?.business_name || '(주)후미디어',
        url: 'https://www.whomedia.co.kr',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.whomedia.co.kr/logo.png'
        },
        founder: {
          '@type': 'Person',
          name: settings?.representative_name || '황광성',
          jobTitle: '대표이사'
        },
        editor: {
          '@type': 'Person',
          name: settings?.editor_name || '황광성',
          jobTitle: '발행인·편집인'
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings?.address || '서울특별시 금천구 가산디지털2로 53 (가산동) 한라시그마밸리 1102호 ~ 1104호',
          addressLocality: '금천구',
          addressRegion: '서울특별시',
          addressCountry: 'KR'
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: settings?.contact_phone || '02-6443-4222',
            faxNumber: settings?.contact_fax || '02-6443-4223',
            email: settings?.contact_email || 'whomedia03@gmail.com',
            contactType: 'customer service',
            areaServed: 'KR',
            availableLanguage: ['Korean']
          }
        ],
        taxID: settings?.business_registration_number || '119-86-25861'
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.whomedia.co.kr/#website',
        url: 'https://www.whomedia.co.kr',
        name: settings?.site_name || '한국AI교육신문',
        description: settings?.site_description || '인공지능(AI) 교육, 평생학습, 에듀테크, 자격증, 직무역량 정보를 다루는 AI 교육 전문 인터넷신문입니다.',
        publisher: {
          '@id': 'https://www.whomedia.co.kr/#organization'
        }
      }
    ]
  };

  return (
    <script
      id="site-schema-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
