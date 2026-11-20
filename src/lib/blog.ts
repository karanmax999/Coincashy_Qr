import fs from 'node:fs';
import path from 'node:path';

/**
 * Blog content store.
 *
 * Every article is one JSON file in /content/blog/<slug>.json (schema: docs/BLOG_AUTOMATION.md).
 * Files are written by the Claude + n8n pipeline on a branch, reviewed on the Vercel preview,
 * and go live when the pull request is merged into main.
 */

export const SITE_URL = 'https://coincashy.io';
const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export type BlogFaq = { q: string; a: string };
export type BlogSource = { name: string; url: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  date: string; // ISO date the post was first published, e.g. 2026-11-20
  updated?: string; // ISO date of the last meaningful update
  author: string;
  reviewer?: string;
  category: string;
  tags: string[];
  readingMinutes?: number;
  focusKeyword?: string;
  coverAlt?: string;
  html: string;
  faq?: BlogFaq[];
  sources?: BlogSource[];
  cta?: { label: string; href: string };
  status: 'published' | 'draft';
};

const REQUIRED: (keyof BlogPost)[] = [
  'slug', 'title', 'description', 'excerpt', 'date', 'author', 'category', 'tags', 'html', 'status',
];

function readPost(file: string): BlogPost {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
  const post = JSON.parse(raw) as BlogPost;
  for (const key of REQUIRED) {
    if (post[key] === undefined || post[key] === '') {
      // Fail the build loudly: a broken article must never reach production.
      throw new Error(`content/blog/${file}: missing required field "${key}"`);
    }
  }
  if (`${post.slug}.json` !== file) {
    throw new Error(`content/blog/${file}: slug "${post.slug}" must match the file name`);
  }
  return post;
}

/** All published posts, newest first. Drafts never appear on the site. */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.json'))
    .map(readPost)
    .filter((p) => p.status === 'published')
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function categorySlug(category: string): string {
  return category.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getCategories(): { name: string; slug: string; count: number }[] {
  const map = new Map<string, { name: string; slug: string; count: number }>();
  for (const p of getAllPosts()) {
    const slug = categorySlug(p.category);
    const entry = map.get(slug) ?? { name: p.category, slug, count: 0 };
    entry.count += 1;
    map.set(slug, entry);
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

export function readingMinutes(post: BlogPost): number {
  if (post.readingMinutes) return post.readingMinutes;
  const words = post.html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
