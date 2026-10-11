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
  title: "Md. Ratul Hasan | Frontend Developer & Aspiring Full-Stack Engineer",
  description:
    "Production-grade personal developer portfolio for Md. Ratul Hasan featuring React, Next.js, PostgreSQL, and Prisma ORM.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`}
    >
      <body className="min-h-screen bg-[#111111] text-white selection:bg-[#84CC16]/20 selection:text-[#84CC16] antialiased">
        {children}
      </body>
    </html>
  );
}
