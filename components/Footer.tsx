import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { query } from '@/lib/db';

export default async function Footer() {
    let settingsObj: Record<string, string> = {};

    try {
        const result = await query('SELECT * FROM settings');
        settingsObj = result.rows.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
    } catch (e) {
        console.error("Failed to load footer settings:", e);
    }

    return (
        <footer className="bg-black/80 backdrop-blur-md py-10 border-t border-white/10 text-center text-gray-400">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-center space-x-6 mb-8">
                    {settingsObj.facebookUrl && (
                        <a href={settingsObj.facebookUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-80" style={{ color: 'var(--body-color)' }}>
                            <Facebook className="hover:text-[var(--primary-color)]" />
                        </a>
                    )}
                    {settingsObj.instagramUrl && (
                        <a href={settingsObj.instagramUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-80" style={{ color: 'var(--body-color)' }}>
                            <Instagram className="hover:text-[var(--primary-color)]" />
                        </a>
                    )}
                    {settingsObj.tiktokUrl && (
                        <a href={settingsObj.tiktokUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-80" style={{ color: 'var(--body-color)' }}>
                            <span className="font-bold hover:text-[var(--primary-color)]">TikTok</span>
                        </a>
                    )}
                    {settingsObj.youtubeUrl && (
                        <a href={settingsObj.youtubeUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-80" style={{ color: 'var(--body-color)' }}>
                            <Youtube className="hover:text-[var(--primary-color)]" />
                        </a>
                    )}
                </div>

                <p className="mb-4">&copy; {new Date().getFullYear()} {settingsObj.siteName || 'Elite Dance Club'}. Todos los derechos reservados.</p>
                <div className="flex justify-center space-x-6 text-sm">
                    <Link href="/privacy" className="hover:text-[var(--primary-color)] transition-colors">Privacidad</Link>
                    <Link href="/terms" className="hover:text-[var(--primary-color)] transition-colors">Términos</Link>
                    {/* <Link href="/admin/login" className="hover:text-white transition-colors">Admin Login</Link> */}
                </div>
            </div>
        </footer>
    );
}
