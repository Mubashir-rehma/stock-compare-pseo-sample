import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { BASE_URL, SITE } from "@/lib/site";
import { SiteHeader } from "@/components/SiteHeader";

// Wisesheets uses Roboto. next/font self-hosts it (downloaded at build, served
// from our own origin) — no runtime CDN, and `display: swap` avoids layout shift.
const roboto = Roboto({
  subsets: ["latin"],
  // Variable font: covers the full weight range the UI uses (400–900,
  // including semibold/extrabold/black) from one self-hosted file.
  variable: "--font-roboto",
  display: "swap",
});

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
    <html lang="en" className={`${roboto.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
