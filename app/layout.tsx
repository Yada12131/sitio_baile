import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elite Dance Club",
  description: "El mejor club de baile de la ciudad.",
};

import db from "@/lib/db";

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = db.prepare('SELECT * FROM settings').all();
  const settingsObj = settings.reduce((acc: Record<string, string>, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  const primaryColor = settingsObj.primaryColor || '#ec4899';
  const accentColor = settingsObj.accentColor || '#a855f7';

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-black text-white`}
        style={{
          '--primary-color': primaryColor,
          '--accent-color': accentColor,
        } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}
