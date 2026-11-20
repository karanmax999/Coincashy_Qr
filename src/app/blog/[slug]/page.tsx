import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPost, formatDate, readingMinutes, categorySlug, SITE_URL } from '@/lib/blog';

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
    <main className="page blog-main" style={{ background: 'var(--ground)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <article className="wrap blog-article">
        <nav className="blog-crumbs" aria-label="Breadcrumb">
          <Link href="/blog">Blog</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/blog/category/${categorySlug(post.category)}`}>{post.category}</Link>
        </nav>

        <header className="blog-article-head">
          <h1 className="blog-h1">{post.title}</h1>
          <p className="blog-lede">{post.excerpt}</p>
          <p className="blog-byline">
            By <strong>{post.author}</strong>
            {post.reviewer ? <> · Reviewed by <strong>{post.reviewer}</strong></> : null}
            <br />
            Published {formatDate(post.date)}
            {post.updated && post.updated !== post.date ? <> · Updated {formatDate(post.updated)}</> : null}
            {' '}· {readingMinutes(post)} min read
          </p>
        </header>

        {/* Article HTML is produced by our own reviewed pipeline (see docs/BLOG_AUTOMATION.md). */}
        <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.html }} />

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

        {post.cta ? (
          <aside className="blog-cta">
            <p>Ready to move between crypto and fiat with a registered provider?</p>
            <Link className="btn btn-solid" href={post.cta.href}>{post.cta.label}</Link>
          </aside>
        ) : null}

        {post.sources?.length ? (
          <section className="blog-sources" aria-labelledby="sources-title">
            <h2 id="sources-title">Sources</h2>
            <ul>
              {post.sources.map((s) => (
                <li key={s.url}><a href={s.url} target="_blank" rel="noopener nofollow">{s.name}</a></li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="blog-disclaimer">
          This article is for general information only and is not financial, investment, legal or tax advice. Crypto-assets
          are volatile and you can lose money. Availability of Coincashy services depends on your country and eligibility.
          See our <Link href="/terms">Terms of Service</Link> and <Link href="/disclaimer">Disclaimer</Link>.
        </p>

        {related.length > 0 && (
          <section className="blog-related" aria-labelledby="related-title">
            <h2 id="related-title">Related articles</h2>
            <ul>
              {related.map((r) => (
                <li key={r.slug}><Link href={`/blog/${r.slug}`}>{r.title}</Link></li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
  );
}
