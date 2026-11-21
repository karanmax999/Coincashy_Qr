import { getAllPosts, SITE_URL } from '@/lib/blog';

export const dynamic = 'force-static';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function GET() {
  const posts = getAllPosts().slice(0, 50);
  const items = posts
    .map(
      (p) => {
        const coverEnclosure = p.cover
          ? `\n      <enclosure url="${SITE_URL}${p.cover.src}" type="image/webp" length="0" />\n      <media:content url="${SITE_URL}${p.cover.src}" medium="image" type="image/webp" width="${p.cover.width}" height="${p.cover.height}" />`
          : '';
        return `
    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T06:00:00Z`).toUTCString()}</pubDate>
      <category>${esc(p.category)}</category>
      <description>${esc(p.description)}</description>${coverEnclosure}
    </item>`;
      },
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Coincashy Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Guides on stablecoins, crypto payments and compliance from Coincashy.</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
