import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Elite Dance Club",
  description: "El mejor club de baile de la ciudad.",
};

import BackgroundAnimation from "@/components/BackgroundAnimation";

import { getSettings } from "@/lib/settings";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  // Use default colors immediately to prevent blocking
  const primaryColor = settings.primaryColor || '#ec4899';
  const accentColor = settings.accentColor || '#a855f7';

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`font-sans antialiased text-white`}
        style={{
          '--primary-color': primaryColor,
          '--accent-color': accentColor,
        } as React.CSSProperties}
      >
        <BackgroundAnimation settings={settings} />
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
