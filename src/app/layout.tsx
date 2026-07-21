import type { Metadata } from "next";
import "./globals.css";
import { BASE_URL, SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Stock Compare — Side-by-Side Stock Comparisons",
    template: "%s",
  },
  description: SITE.tagline,
  applicationName: SITE.name,
  authors: [{ name: SITE.author }],
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
