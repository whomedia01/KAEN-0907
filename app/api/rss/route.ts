export async function GET() {
  const xml = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>생활경제저널</title><link>https://example.com</link><description>생활경제 전문 미디어</description><language>ko-KR</language></channel></rss>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=300, stale-while-revalidate=600'
    }
  });
}
