# Coincashy Event QR & Mobile Lead Capture Desk (Standalone)

Standalone, high-converting event lead generation system for Coincashy conference booths, meetups, and summits.

## Features
- **Exact Coincashy Theme**: Built directly with Coincashy brand tokens (`--vault: #000000`, `--chalk: #F2F2F2`, `--jade: #0000FF`, Plus Jakarta Sans / Inter typography, and authentic logo mark).
- **Admin QR Generator (`/admin/qr`)**:
  - Live target URL generation (`https://coincashy.io/lead?event=...&source=qr`)
  - One-click copy link with instant clipboard feedback
  - High-res **1024×1024 PNG download** with 30% error correction (Level H), quiet margins, event title, and Coincashy branding.
- **Mobile-First Lead Capture Form (`/lead`)**:
  - Fast, friction-free mobile form (Name, Work Email, Phone/WhatsApp, Company, Topic Pills, Telegram handle, Notes).
  - Background submission to **HubSpot Forms API v3** (`portalId: 247718972`, `formId: 7106e4ce-0d13-4c1d-8958-77280cc48f9a`, `region: na2`).
  - Branded celebration success screen ("You're in 🎉") with instant receipt.
  - Option to toggle to raw HubSpot iframe embed if needed.
- **Zero Nav Bleed**: Independent layout completely decoupled from marketing website navbars.

## Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000/admin/qr](http://localhost:3000/admin/qr) or [http://localhost:3000/lead](http://localhost:3000/lead).

## Standalone Deployment (Vercel / Netlify)
1. Push this folder to a GitHub repository (e.g. `coincashy-event-leads`).
2. Import into **Vercel** or **Netlify**.
3. Framework Preset: **Next.js**.
4. (Optional) Set environment variables:
   - `HUBSPOT_PORTAL_ID=247718972`
   - `HUBSPOT_LEAD_FORM_ID=7106e4ce-0d13-4c1d-8958-77280cc48f9a`
   - `HUBSPOT_REGION=na2`
5. Deploy! Point custom subdomain e.g. `leads.coincashy.io` or `qr.coincashy.io`.
