import Image from 'next/image';
import { BlogPost, getCategoryAccent } from '@/lib/blog';

type Props = {
  post: BlogPost;
  variant?: 'card' | 'hero';
  className?: string;
};

export default function BlogCover({ post, variant = 'card', className = '' }: Props) {
  const categoryAccent = getCategoryAccent(post.category);
  const isHero = variant === 'hero';

  if (post.cover) {
    return (
      <figure className={`blog-cover-wrapper blog-cover-${variant} ${className}`}>
        <div className="blog-cover-frame">
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            width={post.cover.width || 1600}
            height={post.cover.height || 900}
            priority={isHero}
            loading={isHero ? undefined : 'lazy'}
            sizes={
              isHero
                ? '(max-width: 820px) 100vw, 820px'
                : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px'
            }
            className="blog-cover-img"
            style={{ width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover' }}
          />
        </div>
        {isHero && post.cover.credit && (
          <figcaption className="blog-cover-credit">
            <span>{post.cover.credit}</span>
          </figcaption>
        )}
      </figure>
    );
  }

  // Branded fallback cover matching opengraph-image.tsx visual style
  return (
    <div className={`blog-cover-wrapper blog-cover-fallback blog-cover-${variant} ${className}`} aria-hidden="true">
      <div className="blog-fallback-frame">
        {/* Ambient subtle corner glow */}
        <div className="blog-fallback-glow" />

        {/* Category Header */}
        <div className="blog-fallback-head">
          <span
            className="blog-fallback-dot"
            style={{ background: categoryAccent, boxShadow: `0 0 10px ${categoryAccent}` }}
          />
          <span className="blog-fallback-category">{post.category}</span>
        </div>

        {/* Title */}
        <div className="blog-fallback-body">
          <span className="blog-fallback-title">{post.title}</span>
        </div>

        {/* Footer Brand Mark */}
        <div className="blog-fallback-foot">
          <span className="blog-fallback-logo">
            <span className="blog-fallback-logo-dot" />
            coincashy
          </span>
          <span className="blog-fallback-url">coincashy.io/blog</span>
        </div>
      </div>
    </div>
  );
}
