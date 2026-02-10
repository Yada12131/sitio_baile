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
    let navbarBgColor = '#000000'; // Default black
    let navbarTextColor = '#ffffff'; // Default white

    try {
        const res = await query('SELECT * FROM settings WHERE key IN ($1, $2, $3, $4)', ['siteName', 'logoUrl', 'navbarBgColor', 'navbarTextColor']);
        const settingsObj = res.rows.reduce((acc: Record<string, string>, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        siteName = settingsObj.siteName || 'ELITE CLUB';
        logoUrl = settingsObj.logoUrl || null;
        navbarBgColor = settingsObj.navbarBgColor || '#000000';
        navbarTextColor = settingsObj.navbarTextColor || '#ffffff';
    } catch (e) {
        console.error("Failed to load public layout settings:", e);
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar
                siteName={siteName}
                logoUrl={logoUrl}
                navbarBgColor={navbarBgColor}
                navbarTextColor={navbarTextColor}
            />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
