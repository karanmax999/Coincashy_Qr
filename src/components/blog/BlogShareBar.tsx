'use client';

import { useState } from 'react';

type Props = {
  title: string;
  url: string;
};

export default function BlogShareBar({ title, url }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const inUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="blog-share-bar" aria-label="Share this article">
      <span className="blog-share-label">Share article</span>
      <div className="blog-share-actions">
        <button
          type="button"
          onClick={handleCopy}
          className="blog-share-btn"
          title="Copy link to clipboard"
          aria-label={copied ? 'Link copied' : 'Copy article link'}
        >
          <svg className="blog-share-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          <span>{copied ? 'Copied! ✓' : 'Copy link'}</span>
        </button>

        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="blog-share-btn"
          title="Share on X"
          aria-label="Share on X"
        >
          <svg className="blog-share-ic" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X</span>
        </a>

        <a
          href={inUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="blog-share-btn"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <svg className="blog-share-ic" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2m1.4 9.74v-8.37H5.06v8.37z" />
          </svg>
          <span>LinkedIn</span>
        </a>
      </div>
    </div>
  );
}
