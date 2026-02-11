import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Elite Dance Club",
  description: "El mejor club de baile de la ciudad.",
};

import BackgroundAnimation from "@/components/BackgroundAnimation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use default colors immediately to prevent blocking
  // Dynamic fetching in RootLayout is complex with Async Server Components + Client Context
  // For now, simpler is better for migration stability.
  const primaryColor = '#ec4899';
  const accentColor = '#a855f7';

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`font-sans antialiased text-white`}
        style={{
          '--primary-color': primaryColor,
          '--accent-color': accentColor,
        } as React.CSSProperties}
      >
        <BackgroundAnimation />
        <div className="relative z-1 w-full h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
