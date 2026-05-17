import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rise - Hard Discipline Mode",
  description: "Discipline extrême, routine quotidienne et aversion à l'échec",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Rise",
  },
  icons: {
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col pb-20 selection:bg-primary/30 bg-[#0B0F14] no-scrollbar">
        <main className="flex-1 w-full max-w-md mx-auto">
          {children}
        </main>
        <BottomNavigation />
      </body>
    </html>
  );
}
