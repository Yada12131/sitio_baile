import type { Metadata } from "next";
import "./globals.css";
import { getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "Elite Dance Club",
  description: "El mejor club de baile de la ciudad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const db = getDb();
  let primaryColor = '#ec4899';
  let accentColor = '#a855f7';

  try {
    const settings = db.prepare('SELECT * FROM settings').all();
    const settingsObj = settings.reduce((acc: Record<string, string>, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    primaryColor = settingsObj.primaryColor || '#ec4899';
    accentColor = settingsObj.accentColor || '#a855f7';
  } catch (e) {
    console.error("Failed to load settings in layout:", e);
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`font-sans antialiased bg-black text-white`}
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
