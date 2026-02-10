'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// import db from '@/lib/db'; // Removed database access

interface HeroProps {
    title: string;
    subtitle: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
    // Settings passed as props

    return (
        <div className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
            {/* ... bg ... */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-pink-900 opacity-50 z-0 animate-pulse" />
            <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30 z-0" />

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.h1
                    className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl inline-block"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                        backgroundImage: 'linear-gradient(to right, var(--primary-color), var(--accent-color))',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        display: 'inline-block'
                    }}
                >
                    {title}
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    {subtitle}
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link href="/events" className="px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-pink-500/30">
                        Ver Eventos
                    </Link>
                    <Link href="/contact" className="px-8 py-4 bg-transparent border-2 border-white/20 hover:bg-white/10 text-white rounded-full font-bold text-lg transition-all backdrop-blur-sm">
                        Reservar Mesa
                    </Link>
                </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-3 bg-white/50 rounded-full" />
                </div>
            </motion.div>
        </div>
    );
}
