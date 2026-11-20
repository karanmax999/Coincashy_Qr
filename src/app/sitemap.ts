import { MetadataRoute } from 'next';
import { getAllPosts, getCategories, SITE_URL } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const routes = [
    '',
    '/personal',
    '/buy-crypto',
    '/sell-crypto',
    '/convert-crypto',
    '/business',
    '/otc',
    '/processing',
    '/ramp',
    '/vibans',
    '/cards',
    '/settlement',
    '/about',
    '/aml',
    '/careers',
    '/complaints',
    '/compliance',
    '/contact',
    '/cookies',
    '/developers',
    '/help',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/fees',
    '/status',
  ];

  const posts = getAllPosts();
  const latestPost = posts[0]?.updated ?? posts[0]?.date;

  // Static pages: no lastModified, so search engines are not told every page changed on every deploy.
  const pages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: latestPost ? new Date(latestPost) : undefined,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = getCategories().map((c) => ({
    url: `${baseUrl}/blog/category/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...pages, ...blogIndex, ...categoryPages, ...postPages];
}
