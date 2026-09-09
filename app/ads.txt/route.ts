export const dynamic = 'force-dynamic';

export function GET() {
  const rawClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '';
  const publisherId = rawClient.replace(/^ca-/, '').trim();
  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : '# ads.txt is not configured yet. Set NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx before AdSense review.\n';

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
}
