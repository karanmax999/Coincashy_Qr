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
    <main className="page blog-main" style={{ background: 'var(--ground)' }}>
      <div className="wrap blog-wrap">
        <header className="blog-head">
          <nav className="blog-crumbs" aria-label="Breadcrumb"><Link href="/blog">Blog</Link></nav>
          <h1 className="blog-h1">{cat.name}</h1>
        </header>
        <ul className="blog-grid">
          {posts.map((p) => (
            <li key={p.slug} className="blog-card">
              <Link href={`/blog/${p.slug}`} className="blog-card-link">
                <h2 className="blog-card-title">{p.title}</h2>
                <p className="blog-card-excerpt">{p.excerpt}</p>
                <span className="blog-card-meta">{formatDate(p.date)} · {readingMinutes(p)} min read</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
