# Coincashy Blog – How articles get published

## Flow
```
Claude (scheduled, on the Claude plan)
  research + write → article JSON → Google Sheet row (status "drafted")
n8n "CC-WF1 Publish draft"
  create branch blog/<slug> → commit content/blog/<slug>.json → open pull request
  → Vercel builds a preview → Gmail "Approve / Decline" to the approver(s) with the preview link
  Approve → n8n merges the PR into main → Vercel deploys → live at coincashy.io/blog/<slug>
  Decline → PR stays open with the reason as a comment; nothing goes live
```
`main` is protected: changes only arrive through reviewed pull requests, and the Vercel build must pass.

## Article file: `content/blog/<slug>.json`
The file name must equal `<slug>.json`. Required fields are checked at build time – a missing field fails the build,
so a broken article can never reach production.

| Field | Type | Required | Notes |
|---|---|---|---|
| `slug` | string | ✅ | lowercase-hyphenated, matches file name |
| `title` | string | ✅ | ≤ 65 characters |
| `description` | string | ✅ | meta description, 140–155 characters |
| `excerpt` | string | ✅ | 1–2 sentences shown on cards and under the title |
| `date` | `YYYY-MM-DD` | ✅ | first publication date |
| `updated` | `YYYY-MM-DD` | | last meaningful update |
| `author` | string | ✅ | display name |
| `reviewer` | string | | person who approved it |
| `category` | string | ✅ | e.g. "Stablecoins", "Business Payments", "Guides", "Compliance" |
| `tags` | string[] | ✅ | 3–6 lowercase tags |
| `focusKeyword` | string | | primary search phrase |
| `readingMinutes` | number | | computed if omitted |
| `html` | string | ✅ | article body; allowed tags: h2 h3 p ul ol li table thead tbody tr th td strong em a blockquote div |
| `faq` | `{q,a}[]` | | rendered on the page and as FAQ structured data |
| `sources` | `{name,url}[]` | | rendered as a "Sources" list |
| `cta` | `{label,href}` | | call to action, e.g. `{"label":"Buy crypto","href":"/buy-crypto"}` |
| `cover` | `object` | | Optional article cover: `{"src":"/blog/<slug>/cover.webp","alt":"...","width":1600,"height":900,"generated":true,"credit":"optional"}` |
| `status` | `"published"` \| `"draft"` | ✅ | drafts never appear on the site |

## Cover Image Rules
When providing an optional `cover` image in `content/blog/<slug>.json`:
- **Dimensions & Ratio:** Strict 16:9 aspect ratio, exact resolution `1600x900` px.
- **Format & Compression:** Modern WebP format (`.webp`), file size < 300 KB.
- **Location:** Saved in `/public/blog/<slug>/cover.webp` (src starts with `/blog/<slug>/`).
- **Content Policy:** Abstract, geometric, architectural, or technical visuals.
  - ❌ **No company logos or crypto tokens as central graphic**
  - ❌ **No human faces or portraits**
  - ❌ **No visible typography, titles, or text overlays**
  - ❌ **No price charts, candlestick patterns, or ticker screens**
- **Fallback:** If `cover` is omitted, the blog template automatically renders a branded pure CSS 16:9 fallback matching the brand design system and category colors with zero layout shift.

## What the blog template adds automatically
- Page title, meta description, canonical URL, Open Graph/Twitter tags, `max-image-preview:large`
- Branded 1200×630 cover image per article (`/blog/<slug>/opengraph-image`)
- BlogPosting, BreadcrumbList and FAQPage structured data
- Risk disclaimer with links to /terms and /disclaimer
- Sitemap entry with the real date, RSS feed at /blog/rss.xml, related articles

See `docs/CONTENT_POLICY.md` for the compliance rules every article must pass.
