import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getCategories, formatDate, readingMinutes } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Coincashy Blog – Guides on Stablecoins, Crypto Payments and Compliance',
  description:
    'Plain-English guides from Coincashy on stablecoins, buying and selling crypto, business crypto payments, settlement and compliance.',
  alternates: { canonical: '/blog', types: { 'application/rss+xml': '/blog/rss.xml' } },
  openGraph: {
    title: 'Coincashy Blog',
    description: 'Guides on stablecoins, crypto payments and compliance.',
    url: '/blog',
    type: 'website',
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const categories = getCategories();

  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <main className="page blog-main">
      <div className="blog-ambient-glow" aria-hidden="true" />
      <div className="wrap blog-wrap">
        <header className="blog-head">
          <div className="blog-badge-pill">
            <span className="blog-badge-dot" aria-hidden="true" />
            <span>Coincashy Editorial &amp; Insights</span>
          </div>
          <h1 className="blog-h1">Guides on stablecoins, crypto payments and compliance</h1>
          <p className="blog-lede">
            Clear, practical explanations for individuals and businesses moving value seamlessly between crypto and fiat rails.
          </p>

          {categories.length > 0 && (
            <nav className="blog-cats" aria-label="Blog categories">
              <Link href="/blog" className="blog-chip is-active">
                All <span>{posts.length}</span>
              </Link>
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
          <>
            {/* Featured Hero Article */}
            {featuredPost && (
              <section className="blog-featured" aria-label="Featured article">
                <Link href={`/blog/${featuredPost.slug}`} className="blog-featured-link">
                  <div className="blog-featured-badge">
                    <span>Featured Guide · {featuredPost.category}</span>
                  </div>
                  <h2 className="blog-featured-title">{featuredPost.title}</h2>
                  <p className="blog-featured-excerpt">{featuredPost.excerpt}</p>
                  <div className="blog-featured-foot">
                    <div className="blog-featured-meta">
                      <span>{formatDate(featuredPost.date)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{readingMinutes(featuredPost)} min read</span>
                      {featuredPost.author && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{featuredPost.author}</span>
                        </>
                      )}
                    </div>
                    <span className="blog-read-cta">
                      Read full guide
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </section>
            )}

            {/* Remaining Articles Grid */}
            {gridPosts.length > 0 && (
              <ul className="blog-grid" aria-label="More articles">
                {gridPosts.map((p) => (
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
                      <h3 className="blog-card-title">{p.title}</h3>
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
            )}
          </>
        )}

        <div className="blog-rss">
          <a href="/blog/rss.xml">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9zM6.5 17.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            </svg>
            <span>Subscribe via RSS feed</span>
          </a>
        </div>
      </div>
    </main>
  );
}
