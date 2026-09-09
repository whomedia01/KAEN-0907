import { requireAdminUser } from '@/lib/admin/auth';
import { getSiteSettings } from '@/lib/data/public';
import { saveSiteSettings } from './actions';

export default async function AdminSettingsPage() {
  await requireAdminUser();
  const settings = await getSiteSettings();

  return (
    <main className="mx-auto max-w-5xl rounded-3xl border bg-white p-8 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">SITE SETTINGS</p>
      <h1 className="mt-3 text-3xl font-black text-brand-navy">사이트·등록 정보 관리</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">인터넷신문 등록 신청과 푸터 법정 정보에 쓰이는 기본 정보를 관리합니다.</p>

      <form action={saveSiteSettings} className="mt-8 grid gap-5 md:grid-cols-2">
        <input type="hidden" name="id" defaultValue={settings.id === 'fallback' ? 'main' : settings.id} />
        <label className="grid gap-2 text-sm font-bold">제호<input name="site_name" defaultValue={settings.site_name} className="rounded-xl border px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-bold">운영사<input name="operator_name" defaultValue={settings.operator_name ?? ''} className="rounded-xl border px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-bold">사업자명<input name="business_name" defaultValue={settings.business_name ?? ''} className="rounded-xl border px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-bold">대표자<input name="representative_name" defaultValue={settings.representative_name ?? ''} className="rounded-xl border px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-bold">사업자등록번호<input name="business_registration_number" defaultValue={settings.business_registration_number ?? ''} className="rounded-xl border px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-bold">통신판매업신고번호<input name="mail_order_registration_number" defaultValue={settings.mail_order_registration_number ?? ''} className="rounded-xl border px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-bold">인터넷신문 등록 상태<select name="media_registration_status" defaultValue={settings.media_registration_status} className="rounded-xl border px-4 py-3"><option value="preparing">등록 신청 예정</option><option value="registered">등록 완료</option><option value="unregistered">미등록</option></select></label>
        <label className="grid gap-2 text-sm font-bold">인터넷신문 등록번호<input name="media_registration_number" defaultValue={settings.media_registration_number ?? ''} className="rounded-xl border px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-bold">발행인<input name="publisher_name" defaultValue={settings.publisher_name ?? ''} className="rounded-xl border px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-bold">편집인<input name="editor_name" defaultValue={settings.editor_name ?? ''} className="rounded-xl border px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-bold">청소년보호책임자<input name="youth_protection_manager" defaultValue={settings.youth_protection_manager ?? ''} className="rounded-xl border px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-bold">개인정보보호책임자<input name="privacy_manager" defaultValue={settings.privacy_manager ?? ''} className="rounded-xl border px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-bold md:col-span-2">주소<input name="address" defaultValue={settings.address ?? ''} className="rounded-xl border px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-bold">대표 이메일<input name="contact_email" defaultValue={settings.contact_email} className="rounded-xl border px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-bold">대표 전화<input name="contact_phone" defaultValue={settings.contact_phone} className="rounded-xl border px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-bold md:col-span-2">사이트 설명<textarea name="site_description" rows={4} defaultValue={settings.site_description} className="rounded-xl border px-4 py-3" /></label>
        <button className="md:col-span-2 rounded-2xl bg-brand-navy px-6 py-4 text-base font-black text-white">사이트 설정 저장</button>
      </form>
    </main>
  );
}
