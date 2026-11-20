import { ImageResponse } from 'next/og';
import { getAllPosts, getPost } from '@/lib/blog';

// Branded 1200x630 cover generated per article at build time: no design work or AI cost per post.
export const alt = 'Coincashy Blog article cover';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? 'Coincashy Blog';
  const category = post?.category ?? 'Blog';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(135deg, #000000 0%, #0A0A0A 55%, #000099 100%)',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '9px', background: '#0000FF' }} />
          <div style={{ fontSize: 30, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#E2B866' }}>
            {category}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: title.length > 70 ? 56 : 66, fontWeight: 700, lineHeight: 1.12, maxWidth: '1000px' }}>
          {title}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 28, color: 'rgba(255,255,255,0.7)' }}>
          <div style={{ display: 'flex', fontWeight: 700, color: '#FFFFFF', fontSize: 34 }}>coincashy</div>
          <div style={{ display: 'flex' }}>coincashy.io/blog</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
