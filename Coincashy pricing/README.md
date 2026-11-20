# Coincashy Pricing Desk · Institutional FX & OTC Calculator

A standalone, real-time interactive one-pager pricing desk application for Coincashy sales, OTC trading, and operations teams.

## Features
- **54 Countries & Currencies**: All data extracted from `Pricing matrix.html` and `Class grid & rates.html`.
- **4 Liquidity Classes**: Major, Liquid, Emerging, Restricted.
- **5 Volume Tiers**: `<$100K`, `$100K–$500K`, `$500K–$1M`, `$1M–$10M`, and `>$10M`.
- **Three Core Settlement Flows**:
  - `Fiat → Crypto` (EUR, PLN, USD, AED, etc. → USDT, USDC, BTC, ETH)
  - `Crypto → Fiat` (USDT, USDC → local bank rails)
  - `Fiat → Fiat` (Cross-border settlement enforcing the harder currency rule)
- **Desk Quoting Utilities**:
  - Live net payout, effective rate, and spread fee calculations
  - Progress bar to next volume tier bracket
  - Quick LP rate overrides for parallel markets (ARS, NGN, KES, EGP, etc.)
  - Trader basis points (bps) spread tweaker
  - 1-Click **"Copy Client Quote"** formatted for WhatsApp, Telegram, or Email
  - Searchable & filterable **54-Country Matrix Table**
- **Theme**: Premium Coincashy dark vault aesthetic with IBM Plex Mono typography.

---

## How to Run Locally

### Option 1: Fast Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Option 2: Production Preview
```bash
npm run build
npm run preview
```

### Option 3: Double-Click Launcher (Windows)
Double-click `start.bat` in this folder.

---

## How to Deploy Separately

The production build is in `dist/`. You can deploy this folder to any hosting provider:

1. **Vercel**: Run `vercel` or connect this repository with Root Directory set to `Coincashy pricing` (Build command: `npm run build`, Output directory: `dist`).
2. **Netlify**: Drag and drop the `dist/` folder into Netlify Drop, or set Build command: `npm run build`, Publish directory: `dist`.
3. **Cloudflare Pages / GitHub Pages**: Deploy the `dist/` folder.
4. **AWS S3 / Nginx / Apache / Caddy**: Upload the contents of `dist/`.
