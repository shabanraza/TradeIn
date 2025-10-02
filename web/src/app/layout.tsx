import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { PWARegister } from "@/components/pwa-register";
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
  title: "OldPhone Marketplace - Buy & Sell Used Mobile Phones",
  description: "A trusted marketplace for buying and selling used mobile phones. Connect with verified retailers in your area.",
  keywords: "used phones, mobile phones, smartphone marketplace, buy phones, sell phones",
  manifest: "/manifest.json",
  themeColor: "#0ea5e9",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OldPhone Marketplace",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
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
        style={{
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-foreground)'
        }}
        suppressHydrationWarning={true}
      >
        <Providers>
          {children}
          <PWARegister />
        </Providers>
      </body>
    </html>
  );
}
