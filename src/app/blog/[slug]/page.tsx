import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPost, formatDate, readingMinutes, categorySlug, SITE_URL } from '@/lib/blog';
import BlogReadingProgress from '@/components/blog/BlogReadingProgress';
import BlogShareBar from '@/components/blog/BlogShareBar';

type Props = { params: Promise<{ slug: string }> };

// Only slugs that exist at build time are valid; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: `${post.title} | Coincashy Blog`,
    description: post.description,
    keywords: post.focusKeyword ? [post.focusKeyword, ...post.tags] : post.tags,
    alternates: { canonical: url },
    authors: [{ name: post.author }],
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const related = getAllPosts().filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);

  // Author avatar initials
  const initials = post.author
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      mainEntityOfPage: url,
      image: `${url}/opengraph-image`,
      author: { '@type': 'Person', name: post.author },
      publisher: {
        '@type': 'Organization',
        name: 'Coincashy Sp. z o.o.',
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/media/logo-on-dark.png` },
      },
      keywords: post.tags.join(', '),
      articleSection: post.category,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.category, item: `${SITE_URL}/blog/category/${categorySlug(post.category)}` },
        { '@type': 'ListItem', position: 4, name: post.title, item: url },
      ],
    },
  ];

  if (post.faq?.length) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }

  return (
    <main className="page blog-main">
      <BlogReadingProgress />
      <div className="blog-ambient-glow" aria-hidden="true" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <article className="wrap blog-article">
        {/* Breadcrumb Navigation */}
        <nav className="blog-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="blog-crumbs-sep" aria-hidden="true">/</span>
          <Link href="/blog">Blog</Link>
          <span className="blog-crumbs-sep" aria-hidden="true">/</span>
          <Link href={`/blog/category/${categorySlug(post.category)}`}>{post.category}</Link>
        </nav>

        {/* Article Header */}
        <header className="blog-article-head">
          <div className="blog-badge-pill">
            <span className="blog-badge-dot" aria-hidden="true" />
            <Link href={`/blog/category/${categorySlug(post.category)}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {post.category}
            </Link>
          </div>

          <h1 className="blog-h1">{post.title}</h1>
          <p className="blog-lede">{post.excerpt}</p>

          {/* Author & Reviewer Metadata Bar */}
          <div className="blog-author-bar">
            <div className="blog-author-profile">
              <div className="blog-author-avatar" aria-hidden="true">
                {initials || 'CC'}
              </div>
              <div className="blog-author-meta">
                <span className="blog-author-name">
                  {post.author}
                  <svg className="blog-verified-badge" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-label="Verified Contributor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </span>
                <span className="blog-author-sub">
                  Published {formatDate(post.date)}
                  {post.updated && post.updated !== post.date ? ` · Updated ${formatDate(post.updated)}` : ''}
                  {' · '}{readingMinutes(post)} min read
                </span>
              </div>
            </div>

            {post.reviewer && (
              <div className="blog-reviewer-tag" title="Compliance & Content Sign-off">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Reviewed by {post.reviewer}</span>
              </div>
            )}
          </div>

          {/* Quick Sharing Bar */}
          <BlogShareBar title={post.title} url={url} />
        </header>

        {/* Article HTML Prose (validated build-time pipeline) */}
        <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.html }} />

        {/* FAQ Accordion Section */}
        {post.faq?.length ? (
          <section className="blog-faq" aria-labelledby="faq-title">
            <h2 id="faq-title">Frequently asked questions</h2>
            {post.faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </section>
        ) : null}

        {/* Call to Action Banner */}
        {post.cta ? (
          <aside className="blog-cta" aria-label="Action prompt">
            <div className="blog-cta-content">
              <h3 className="blog-cta-title">Ready to move between crypto and fiat?</h3>
              <p className="blog-cta-desc">Experience seamless settlements, cards, and OTC rails with full European VASP registration.</p>
            </div>
            <Link className="btn btn-solid" href={post.cta.href}>
              <span>{post.cta.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </aside>
        ) : null}

        {/* Sources & Citations */}
        {post.sources?.length ? (
          <section className="blog-sources" aria-labelledby="sources-title">
            <h2 id="sources-title">Verified Sources &amp; References</h2>
            <ul>
              {post.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener nofollow">
                    <span>{s.name}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Regulatory Risk Disclaimer */}
        <div className="blog-disclaimer" role="note">
          <p>
            <strong>Regulatory Notice:</strong> This article is published for general educational and informational purposes only
            and does not constitute financial, investment, legal, or tax advice. Crypto-assets are volatile, values can fluctuate significantly,
            and you may lose money. Service availability depends on jurisdiction, regulatory compliance, and customer eligibility.
            For complete disclosures, review our <Link href="/terms">Terms of Service</Link> and <Link href="/disclaimer">Risk Warning &amp; Disclaimer</Link>.
          </p>
        </div>

        {/* Related Articles Section */}
        {related.length > 0 && (
          <section className="blog-related" aria-labelledby="related-title">
            <h2 id="related-title">Related articles</h2>
            <div className="blog-related-grid">
              {related.map((r) => (
                <div key={r.slug} className="blog-card">
                  <Link href={`/blog/${r.slug}`} className="blog-card-link">
                    <span className="blog-card-cat">{r.category}</span>
                    <h3 className="blog-card-title">{r.title}</h3>
                    <p className="blog-card-excerpt">{r.excerpt}</p>
                    <div className="blog-card-foot">
                      <span>{formatDate(r.date)}</span>
                      <span className="blog-read-cta">
                        Read
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M3 8h10M9 4l4 4-4 4" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
