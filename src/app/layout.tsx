import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Question Generator - Generator Soal Pintar",
  description: "Aplikasi web modern untuk generate soal berkualitas menggunakan AI dengan support untuk Kurikulum Indonesia dan Cambridge, lengkap dengan fitur export ke Word dan management riwayat.",
  keywords: ["AI Question Generator", "Generator Soal", "Kurikulum Indonesia", "Cambridge", "Education", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "AI development", "React", "Question Bank"],
  authors: [{ name: "AI Question Generator Team" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "AI Question Generator - Generator Soal Pintar",
    description: "Buat soal berkualitas untuk Kurikulum Indonesia dan Cambridge dengan kecerdasan buatan",
    url: "https://shb.sch.id",
    siteName: "AI Question Generator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Question Generator - Generator Soal Pintar",
    description: "Buat soal berkualitas untuk Kurikulum Indonesia dan Cambridge dengan AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
