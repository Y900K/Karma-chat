import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnalyticsProvider from "@/components/analytics-provider";
import WebVitals from "@/components/web-vitals";
import { getSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KarmaSetu AI | कौशल से करियर तक",
  description: "India's employability intelligence platform—turning learner potential into verified skills, better matches and meaningful work.",
  metadataBase: new URL(getSiteUrl()),
  openGraph: { title: "KarmaSetu AI", description: "Talent is everywhere. Opportunity should find it.", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><a className="skip-link" href="#main-content">Skip to main content</a><AnalyticsProvider /><WebVitals /><div id="main-content">{children}</div></body>
    </html>
  );
}
