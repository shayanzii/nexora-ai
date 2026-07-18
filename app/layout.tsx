import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FloatingChatWidget } from "@/components/chat/FloatingChatWidget";
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
  title: "Nexora AI | Premium AI Automation for Modern Businesses",
  description: "Nexora AI delivers premium automation, analytics, and AI strategy for modern companies.",
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
      <body className="min-h-full flex flex-col">
        {children}
        <FloatingChatWidget />
      </body>
    </html>
  );
}
