import Link from 'next/link';
import { getSiteSettings } from '@/lib/data/public';

function Sep() {
  return <span className="mx-2 text-gray-300">|</span>;
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-gray-800 hover:text-gray-950">
      {children}
    </Link>
  );
}

export async function PublicFooter() {
  const year = new Date().getFullYear();
  const settings = await getSiteSettings();

  return (
    <>
      <footer className="mt-20 hidden border-t border-gray-300 bg-white md:block">
        <div className="border-b bg-slate-100">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-center px-4 py-3 text-[13px] text-gray-900">
            <FooterLink href="/about">회사소개</FooterLink><Sep />
            <FooterLink href="/terms">회원약관</FooterLink><Sep />
            <FooterLink href="/privacy">개인정보보호방침</FooterLink><Sep />
            <FooterLink href="/youth-policy">청소년보호정책</FooterLink><Sep />
            <FooterLink href="/partnership">제휴문의</FooterLink><Sep />
            <FooterLink href="/ethics">인터넷신문윤리강령</FooterLink><Sep />
            <FooterLink href="/partnership?type=ad">광고문의</FooterLink><Sep />
            <FooterLink href="/form">기사제보</FooterLink>
          </nav>
        </div>

        <div className="relative mx-auto flex max-w-6xl gap-10 px-4 py-7 text-[12px] leading-[1.65] text-gray-600">
          <Link href="#top" className="absolute right-4 top-4 rounded border border-gray-300 px-2 py-0.5 text-[10px] text-gray-500">
            ▲ TOP
          </Link>

          <div className="w-[170px] shrink-0 pt-2">
            <Link href="/" className="block leading-none text-gray-400">
              <span className="block text-[13px] tracking-[-0.04em]">교육 현장을 기록하는</span>
              <span className="mt-1 block text-[30px] font-black tracking-[-0.08em] text-gray-600">에듀저널</span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">EDU JOURNAL</span>
            </Link>
          </div>

          <div className="min-w-0 flex-1 pr-10">
            <div className="space-y-0.5 break-keep text-gray-600">
              <p>제호 {settings.site_name} | 발행·운영 {settings.business_name ?? settings.operator_name ?? '알고파트너스'} | 대표자 {settings.representative_name ?? '박예준'}</p>
              <p>발행인 {settings.publisher_name ?? '박예준'} | 편집인 {settings.editor_name ?? '박예준'} | 청소년보호책임자 {settings.youth_protection_manager ?? '박예준'} | 개인정보보호책임자 {settings.privacy_manager ?? '박예준'}</p>
              <p>주소 {settings.address ?? '인천광역시 서구 청라커낼로 270, 커낼힐스빌 2층 2498호'} | 문의 {settings.contact_email}</p>
              <p>인터넷신문 등록번호 {settings.media_registration_number || '등록 신청 예정'} | 등록일 {settings.media_registered_at ?? '등록 완료 후 표기'}</p>
              <p>사업자등록번호 {settings.business_registration_number ?? '450-07-03104'} | 통신판매업신고번호 {settings.mail_order_registration_number ?? '제2025-인천서구-3321호'}</p>
              <p>기사제보·보도자료·정정보도·반론보도 신청은 각 접수 페이지 또는 대표 이메일을 통해 접수합니다.</p>
              <p className="pt-1 text-[11px] text-gray-500">Copyright ⓒ {year} {settings.site_name}. All rights reserved. 모든 콘텐츠의 무단 전재·복사·배포 및 재배포를 금합니다.</p>
            </div>
          </div>
        </div>
      </footer>
      <footer className="border-t bg-white px-4 py-5 text-center md:hidden">
        <Link href="/?view=pc" className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-black text-slate-700">
          PC버전 보기
        </Link>
      </footer>
    </>
  );
}
