'use client';

import { useMemo, useState } from 'react';

interface ArticleShareToolsProps {
  title: string;
  url: string;
}

export function ArticleShareTools({ title, url }: ArticleShareToolsProps) {
  const [copied, setCopied] = useState(false);

  const encodedTitle = useMemo(() => encodeURIComponent(title), [title]);
  const encodedUrl = useMemo(() => encodeURIComponent(url), [url]);

  const shareLinks = [
    {
      label: '메일',
      className: 'bg-gray-200 text-gray-700',
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
    },
    {
      label: 'X',
      className: 'bg-black text-white',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
    },
    {
      label: 'f',
      className: 'bg-[#1877f2] text-white',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      label: 'N',
      className: 'bg-[#03c75a] text-white',
      href: `https://share.naver.com/web/shareView?url=${encodedUrl}&title=${encodedTitle}`
    }
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const changeFontSize = (direction: 'up' | 'down') => {
    const current = Number(document.documentElement.dataset.articleFontScale ?? '1');
    const next = direction === 'up' ? Math.min(current + 0.08, 1.32) : Math.max(current - 0.08, 0.84);
    document.documentElement.dataset.articleFontScale = String(next);
    document.documentElement.style.setProperty('--article-font-scale', String(next));
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3 text-xs text-gray-500">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-gray-800">글자크기</span>
        <button type="button" onClick={() => changeFontSize('up')} className="inline-flex h-7 w-7 items-center justify-center border bg-white font-bold hover:border-brand-blue hover:text-brand-blue" aria-label="글자 크게">
          +
        </button>
        <button type="button" onClick={() => changeFontSize('down')} className="inline-flex h-7 w-7 items-center justify-center border bg-white font-bold hover:border-brand-blue hover:text-brand-blue" aria-label="글자 작게">
          -
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => window.print()} className="border px-3 py-1.5 font-bold text-gray-700 hover:border-brand-blue hover:text-brand-blue">
          프린트
        </button>
        <button type="button" onClick={handleCopy} className="border px-3 py-1.5 font-bold text-gray-700 hover:border-brand-blue hover:text-brand-blue">
          {copied ? '복사완료' : 'URL복사'}
        </button>
        <div className="ml-1 flex items-center gap-1" aria-label="SNS 공유">
          {shareLinks.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black ${item.className}`}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
