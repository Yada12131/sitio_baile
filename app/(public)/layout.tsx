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

    // Theme defaults
    let logoHeight = '40'; // px
    let headingColor = '#ffffff';
    let bodyColor = '#9ca3af'; // gray-400
    let primaryColor = '#ec4899';
    let accentColor = '#a855f7';
    let fontScale = '1';

    try {
        const keys = [
            'siteName', 'logoUrl', 'navbarBgColor', 'navbarTextColor',
            'logoHeight', 'headingColor', 'bodyColor', 'primaryColor', 'accentColor', 'fontScale'
        ];

        // Construct query dynamically or just use IN
        const res = await query(`SELECT * FROM settings WHERE key = ANY($1)`, [keys]);

        const settingsObj = res.rows.reduce((acc: Record<string, string>, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        siteName = settingsObj.siteName || 'ELITE CLUB';
        logoUrl = settingsObj.logoUrl || null;
        navbarBgColor = settingsObj.navbarBgColor || '#000000';
        navbarTextColor = settingsObj.navbarTextColor || '#ffffff';

        logoHeight = settingsObj.logoHeight || '40';
        headingColor = settingsObj.headingColor || '#ffffff';
        bodyColor = settingsObj.bodyColor || '#9ca3af';
        primaryColor = settingsObj.primaryColor || '#ec4899';
        accentColor = settingsObj.accentColor || '#a855f7';
        fontScale = settingsObj.fontScale || '1';

    } catch (e) {
        console.error("Failed to load public layout settings:", e);
    }

    const themeStyles = {
        '--primary-color': primaryColor,
        '--accent-color': accentColor,
        '--heading-color': headingColor,
        '--body-color': bodyColor,
        '--font-scale': fontScale,
    } as React.CSSProperties;

    return (
        <div className="flex flex-col min-h-screen" style={themeStyles}>
            <Navbar
                siteName={siteName}
                logoUrl={logoUrl}
                navbarBgColor={navbarBgColor}
                navbarTextColor={navbarTextColor}
                logoHeight={parseInt(logoHeight)}
            />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
