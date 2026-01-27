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

import { Toaster } from "sonner";
import { AuthInitializer } from "@/components/AuthInitializer";
import { SocketProvider } from "@/providers/SocketProvider";

export const metadata: Metadata = {
  title: "CRM Demo",
  description: "Modern CRM with Real-time Notifications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthInitializer />
        <SocketProvider>
          <Toaster position="top-right" richColors closeButton />
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
