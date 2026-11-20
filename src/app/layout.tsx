import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://coincashy.io"),
  title: "Coincashy",
  description: "Coincashy connects people and businesses to crypto, stablecoins, fiat rails, wallets, cards and payment infrastructure.",
  icons: {
    icon: "/media/favicon.png",
  },
};

import SvgSprite from "@/components/SvgSprite";
import Nav from "@/components/Nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SvgSprite />
        <Nav />
        {children}
        <Script src="/js/main.js?v=8" type="module" strategy="afterInteractive" />
      </body>
    </html>
  );
}
