import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "피트니스 CRM",
  description: "피트니스 센터를 위한 통합 고객 관리 시스템.",
  openGraph: {
    title: "피트니스 CRM",
    description: "피트니스 센터를 위한 통합 고객 관리 시스템.",
    url: "https://your-vercel-domain.vercel.app/",
    siteName: "피트니스 CRM",
    images: [
      {
        url: "/vercel.svg",
        width: 1200,
        height: 630,
        alt: "피트니스 CRM"
      }
    ],
    locale: "ko_KR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "피트니스 CRM",
    description: "피트니스 센터를 위한 통합 고객 관리 시스템.",
    images: ["/vercel.svg"]
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
