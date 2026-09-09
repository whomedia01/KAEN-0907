import Script from 'next/script';

function adsenseEnabled() {
  return process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' && Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);
}

export function AdSenseScript() {
  if (!adsenseEnabled()) return null;

  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <Script
      id="adsense-auto-ads"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}
