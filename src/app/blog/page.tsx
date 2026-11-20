import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getCategories, formatDate, readingMinutes } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Coincashy Blog – Guides on Stablecoins, Crypto Payments and Compliance',
  description:
    'Plain-English guides from Coincashy on stablecoins, buying and selling crypto, business crypto payments, settlement and compliance.',
  alternates: { canonical: '/blog', types: { 'application/rss+xml': '/blog/rss.xml' } },
  openGraph: { title: 'Coincashy Blog', description: 'Guides on stablecoins, crypto payments and compliance.', url: '/blog', type: 'website' },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const categories = getCategories();

  return (
    <main className="page blog-main" style={{ background: 'var(--ground)' }}>
      <div className="wrap blog-wrap">
        <header className="blog-head">
          <p className="eyebrow">Coincashy Blog</p>
          <h1 className="blog-h1">Guides on stablecoins, crypto payments and compliance</h1>
          <p className="blog-lede">Clear, practical explanations for individuals and businesses moving between crypto and fiat.</p>
          {categories.length > 0 && (
            <nav className="blog-cats" aria-label="Blog categories">
              <Link href="/blog" className="blog-chip is-active">All</Link>
              {categories.map((c) => (
                <Link key={c.slug} href={`/blog/category/${c.slug}`} className="blog-chip">
                  {c.name} <span>{c.count}</span>
                </Link>
              ))}
            </nav>
          )}
        </header>

        {posts.length === 0 ? (
          <p className="blog-empty">New articles are on the way.</p>
        ) : (
          <ul className="blog-grid">
            {posts.map((p) => (
              <li key={p.slug} className="blog-card">
                <Link href={`/blog/${p.slug}`} className="blog-card-link">
                  <span className="blog-card-cat">{p.category}</span>
                  <h2 className="blog-card-title">{p.title}</h2>
                  <p className="blog-card-excerpt">{p.excerpt}</p>
                  <span className="blog-card-meta">
                    {formatDate(p.date)} · {readingMinutes(p)} min read
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="blog-rss"><a href="/blog/rss.xml">RSS feed</a></p>
      </div>
    </main>
  );
}
