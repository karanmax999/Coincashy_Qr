import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getCategories, categorySlug, formatDate, readingMinutes } from '@/lib/blog';

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategories().find((c) => c.slug === category);
  if (!cat) return {};
  return {
    title: `${cat.name} – Coincashy Blog`,
    description: `Coincashy articles about ${cat.name.toLowerCase()}: guides and explainers for individuals and businesses.`,
    alternates: { canonical: `/blog/category/${cat.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategories().find((c) => c.slug === category);
  if (!cat) notFound();
  const posts = getAllPosts().filter((p) => categorySlug(p.category) === cat.slug);

  return (
    <main className="page blog-main">
      <div className="blog-ambient-glow" aria-hidden="true" />
      <div className="wrap blog-wrap">
        <header className="blog-head">
          <nav className="blog-crumbs" aria-label="Breadcrumb">
            <Link href="/blog">Blog</Link>
            <span className="blog-crumbs-sep" aria-hidden="true">/</span>
            <span aria-current="page">{cat.name}</span>
          </nav>

          <div className="blog-badge-pill">
            <span className="blog-badge-dot" aria-hidden="true" />
            <span>Category Archive</span>
          </div>

          <h1 className="blog-h1">{cat.name}</h1>
          <p className="blog-lede">
            Explore {posts.length} {posts.length === 1 ? 'guide' : 'guides'} and industry insights covering {cat.name.toLowerCase()}.
          </p>
        </header>

        <ul className="blog-grid" aria-label={`${cat.name} articles`}>
          {posts.map((p) => (
            <li key={p.slug} className="blog-card">
              <Link href={`/blog/${p.slug}`} className="blog-card-link">
                <div className="blog-card-head">
                  <span className="blog-card-cat">{p.category}</span>
                  <span className="blog-card-readtime">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {readingMinutes(p)} min read
                  </span>
                </div>
                <h2 className="blog-card-title">{p.title}</h2>
                <p className="blog-card-excerpt">{p.excerpt}</p>
                <div className="blog-card-foot">
                  <span>{formatDate(p.date)}</span>
                  <span className="blog-read-cta">
                    Read
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="blog-rss">
          <Link href="/blog">← Back to all articles</Link>
        </div>
      </div>
    </main>
  );
}
