import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { query } from "@/lib/db";

export default async function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let siteName = 'ELITE CLUB';
    let logoUrl = null;

    try {
        const res = await query('SELECT * FROM settings WHERE key IN ($1, $2)', ['siteName', 'logoUrl']);
        const settingsObj = res.rows.reduce((acc: Record<string, string>, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        siteName = settingsObj.siteName || 'ELITE CLUB';
        logoUrl = settingsObj.logoUrl || null;
    } catch (e) {
        console.error("Failed to load public layout settings:", e);
    }

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
