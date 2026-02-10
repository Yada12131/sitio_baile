import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
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
        <footer className="bg-black py-10 border-t border-white/10 text-center text-gray-400">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-center space-x-6 mb-8">
                    {settingsObj.facebookUrl && (
                        <a href={settingsObj.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
                            <Facebook />
                        </a>
                    )}
                    {settingsObj.instagramUrl && (
                        <a href={settingsObj.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
                            <Instagram />
                        </a>
                    )}
                    {settingsObj.tiktokUrl && (
                        <a href={settingsObj.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
                            <span className="font-bold">TikTok</span>
                        </a>
                    )}
                </div>

                <p className="mb-4">&copy; {new Date().getFullYear()} {settingsObj.siteName || 'Elite Dance Club'}. Todos los derechos reservados.</p>
                <div className="flex justify-center space-x-6 text-sm">
                    <a href="/privacy" className="hover:text-white transition-colors">Privacidad</a>
                    <a href="/terms" className="hover:text-white transition-colors">Términos</a>
                    {/* <a href="/admin/login" className="hover:text-white transition-colors">Admin Login</a> */}
                </div>
            </div>
        </footer>
    );
}
