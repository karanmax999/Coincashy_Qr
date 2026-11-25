<div align="center">
  <br />
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/media/logo-white.png">
    <source media="(prefers-color-scheme: light)" srcset="public/media/logo-black.png">
    <img src="public/media/logo-black.png" alt="Coincashy Logo" width="400">
  </picture>
  <br /><br />
  
  <p><strong>Move money between crypto and cash seamlessly.</strong></p>
  <p>
    Coincashy connects people and businesses to crypto, stablecoins, fiat rails, wallets, cards, and payment infrastructure. One gateway, with compliance built in.
  </p>
</div>

<br />

## 🚀 Overview

Coincashy is a state-of-the-art fintech application that bridges the gap between digital assets and real-world spending. It provides a robust, seamless infrastructure for individuals to buy, sell, and spend crypto, and for businesses to accept, convert, hold, and settle value at scale.

## ✨ Core Features

- **Personal Crypto Accounts:** Purchase assets using card, Apple Pay, Google Pay, or bank transfer, and spend them using a partner-enabled virtual or physical card.
- **Crypto Processing for Business:** Accept crypto at checkout, route through OTC liquidity pools, and settle in fiat (EUR, GBP, USD) or stablecoins (USDC, USDT).
- **vIBANs & Treasury:** Manage fiat accounts and balances in one unified view.
- **Developer-Ready APIs:** Payments, wallet, and quote APIs equipped with webhooks.
- **Modern Tech Stack:** Built with the bleeding-edge **Next.js 15 (App Router)**, **TypeScript**, and optimized for maximum execution speed.

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js (v18+) installed on your machine.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/karanmax999/Coincashy_.git
   cd Coincashy_
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Spin up the development server:**
   ```bash
   npm run dev
   ```

4. **Launch the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser. The page will hot-reload automatically as you edit files!

## 📁 Project Architecture

- **`src/app/`**: Contains the core Next.js App Router files (`page.tsx`, `layout.tsx`).
- **`public/media/`**: Centralized storage for branding assets, SVGs, and images.
- **`public/css/`**: Core legacy styles integrated globally.
- **`public/js/`**: Standalone scripts optimized via Next.js `<Script>` components.

---

## 📧 Email Console & CRM Bridge (Phase 1 & Phase 2)

Coincashy's custom email engine couples HubSpot CRM (as the source of truth for relationships, lists, and opt-outs) with Resend for high-deliverability sending from `mail.coincashy.io`.

### 1. Resend Domain Verification (`mail.coincashy.io`)
To protect root domain inbox reputation, all automated campaigns and announcements are sent from a dedicated subdomain:
1. Log in to [Resend Dashboard](https://resend.com) &rarr; **Domains** &rarr; **Add Domain**: `mail.coincashy.io`.
2. Add the generated DNS records into your DNS provider (e.g. Cloudflare / Route53):
   - **SPF (TXT)**: `mail.coincashy.io` &rarr; `v=spf1 include:resend.com ~all`
   - **DKIM (CNAME)**: `resend._domainkey.mail.coincashy.io` &rarr; (copy value from Resend)
   - **DMARC (TXT)**: `_dmarc.mail.coincashy.io` &rarr; `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@coincashy.io`
   - **MX (Return-Path)**: `feedback.mail.coincashy.io` &rarr; `feedback-smtp.resend.com` (priority 10)
3. Wait for Resend status to show **Verified**.

### 2. HubSpot Private App Token Scopes (na2 Region)
Create a Private App in HubSpot with the following scopes:
- `crm.objects.contacts.read` & `crm.objects.contacts.write` (Contact sync & custom properties)
- `crm.lists.read` (Accessing lists & segmentation)
- `crm.schemas.contacts.read` & `crm.schemas.contacts.write` (Creating/managing the `console_email_suppressed` boolean property)
- `crm.objects.custom.read` & `crm.objects.custom.write` (Logging timeline engagement notes with associationTypeId 202)

### 3. Vercel Cron & Queue Configuration
To trigger the automated queue worker every 5 minutes in production, add `vercel.json` to your project root:
```json
{
  "crons": [
    {
      "path": "/api/email/cron/process-queue",
      "schedule": "*/5 * * * *"
    }
  ]
}
```
Vercel automatically passes `Authorization: Bearer ${CRON_SECRET}` when executing scheduled crons.

### 4. Turso Database Provisioning
The email engine relies on Turso (Serverless SQLite via libSQL) for tracking campaigns, recipient dispatches, and maintaining the critical **Suppression List**:
1. Install Turso CLI or log in to [Turso Console](https://turso.tech).
2. Create a database:
   ```bash
   turso db create coincashy-email
   ```
3. Retrieve database URL and auth token:
   ```bash
   turso db show coincashy-email --url
   turso db tokens create coincashy-email
   ```
4. Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` to your `.env.local`.
5. Run the migration script to create tables and indexes:
   ```bash
   npm run db:migrate
   ```

### 3. Edge Middleware & Security
- All `/admin/*` console pages and `/api/email/*` management routes are protected with HTTP Basic Authentication (`ADMIN_USER` and `ADMIN_PASSWORD`).
- Public exemptions in `src/middleware.ts`:
  - `/api/email/unsubscribe` (secured via HMAC-SHA256 signature tokens)
  - `/api/email/webhooks` (secured via Resend/Svix webhook signatures)

### 4. Mandatory Polish VASP & GDPR Compliance
Every outgoing message generated by `BaseTemplate.tsx` includes:
- Registered entity details (KRS, NIP, VASP, Warsaw registered office) sourced via environment variables (`COINCASHY_LEGAL_*`). Placeholder values (`VERIFY_BEFORE_PROD`) must be replaced prior to production dispatches.
- A clear consent acquisition disclosure (`registered` vs. `event`).
- RFC 8058 compliant `List-Unsubscribe` and `List-Unsubscribe-Post` one-click unsubscribe headers.
- Automatic suppression check prior to every dispatch (`isEmailSuppressed()`), preventing any suppressed contact from receiving emails.

---

## 🤝 Contributing

Contributions are always welcome! Whether it's reporting a bug, suggesting a feature, or opening a Pull Request, your input is highly valued.

---
<div align="center">
  <small>© 2024 Coincashy. All Rights Reserved.</small>
</div>
