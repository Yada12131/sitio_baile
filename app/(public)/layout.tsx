import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import db from "@/lib/db";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const settings = db.prepare('SELECT * FROM settings WHERE key IN (?, ?)').all('siteName', 'logoUrl');
    const settingsObj = settings.reduce((acc: Record<string, string>, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});
    const siteName = settingsObj.siteName || 'ELITE CLUB';
    const logoUrl = settingsObj.logoUrl || null;

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar siteName={siteName} logoUrl={logoUrl} />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
