import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AuthProvider } from "@/app/auth-context";
import { ProgressProvider } from "@/app/progress-context";
import CookieConsent from "@/components/CookieConsent";
import ConsentedAnalytics from "@/components/ConsentedAnalytics";
import { SITE_NAME, SITE_URL } from "@/lib/siteUrl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Energy Academy — Learn Energy Management",
    template: "%s · Energy Academy",
  },
  description:
    "Learn energy management across three tiers: foundations for everyone, technical deep dives system by system, and leadership for driving change.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    title: "Energy Academy — Learn Energy Management",
    description:
      "Learn energy management across three tiers: foundations for everyone, technical deep dives system by system, and leadership for driving change.",
  },
  twitter: {
    card: "summary",
    title: "Energy Academy — Learn Energy Management",
    description:
      "Structured energy-management training: foundations, system deep dives, leadership and sector courses.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-50 font-sans text-slate-900">
        <AuthProvider>
          <ProgressProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <CookieConsent />
            <ConsentedAnalytics />
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
