import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coincashy - Event Lead System",
  description: "Coincashy Event QR Generator and High-Converting Mobile Lead Capture System",
  icons: {
    icon: "/media/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
