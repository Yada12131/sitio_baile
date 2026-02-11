'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Nosotros', href: '/about' },
    { name: 'Clases', href: '/classes' },
    { name: 'Servicios', href: '/services' },
    { name: 'Eventos', href: '/events' },
    { name: 'Afiliados', href: '/affiliates' },
    { name: 'Contáctenos', href: '/contact' },
];

// ... imports
// import db from '@/lib/db'; // Removed database access from client component

interface NavbarProps {
    siteName: string;
    logoUrl: string | null;
    navbarBgColor?: string;
    navbarTextColor?: string;
    logoHeight?: number;
}

export default function Navbar({ siteName, logoUrl, navbarBgColor = '#000000', navbarTextColor = '#ffffff', logoHeight = 40 }: NavbarProps) {
    // Settings passed as props

    const [isOpen, setIsOpen] = useState(false);

    const height = typeof logoHeight === 'string' ? parseInt(logoHeight) : logoHeight;
    const safeHeight = isNaN(height) ? 40 : height;

    return (
        <nav
            className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-white/10 transition-all duration-300"
            style={{ background: navbarBgColor }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between" style={{ height: Math.max(80, safeHeight + 40) + 'px' }}> {/* Adjust navbar height based on logo */}
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                        {logoUrl ? <img src={logoUrl} alt={siteName} style={{ height: `${safeHeight}px` }} className="w-auto object-contain" /> : siteName}
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    style={{ color: navbarTextColor }}
                                    className="px-3 py-2 rounded-md text-sm font-medium hover:opacity-80 hover:bg-white/10 transition-all"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/feedback"
                                className="px-4 py-2 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
                                style={{ background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))' }}
                            >
                                Danos tu Opinión
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/90 border-b border-white/10"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/feedback"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-pink-400 hover:text-pink-300"
                            >
                                Danos tu Opinión
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
