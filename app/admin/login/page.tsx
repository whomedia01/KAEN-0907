'use client';

import { useState, useTransition } from 'react';
import { login } from './actions';

export default function AdminLoginPage() {
  const [state, setState] = useState<{ ok?: boolean; message?: string }>({});
  const [isPending, startTransition] = useTransition();
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form action={(formData) => startTransition(async () => setState((await login(formData)) ?? {}))} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">EDU JOURNAL CMS</p>
        <h1 className="mt-3 text-2xl font-black text-brand-navy">에듀저널 관리자 로그인</h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">기사 작성, 발행, 사이트 설정을 관리하려면 관리자 계정으로 로그인하세요.</p>
        <label className="mt-6 block text-sm font-bold text-gray-700">이메일<input name="email" type="email" required className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
        <label className="mt-4 block text-sm font-bold text-gray-700">비밀번호<input name="password" type="password" required className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
        {state.message && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.message}</p>}
        <button disabled={isPending} className="mt-6 w-full rounded-xl bg-brand-navy py-3 font-black text-white disabled:opacity-50">로그인</button>
      </form>
    </div>
  );
}
