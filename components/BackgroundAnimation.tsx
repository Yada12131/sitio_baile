'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BackgroundAnimation({ settings }: { settings?: any }) {
    // Animation active - v3
    const [isMounted, setIsMounted] = useState(false);

    // Defaults
    const color1 = settings?.animColor1 || '#9333ea'; // purple-600
    const color2 = settings?.animColor2 || '#db2777'; // pink-600
    const opacity = parseFloat(settings?.animOpacity || '0.3');
    const speed = parseInt(settings?.animSpeed || '30');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="fixed inset-0 z-[50] overflow-hidden pointer-events-none bg-transparent mix-blend-screen">
            {/* Fog/Smoke Effect - Large subtle moving gradients */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    opacity: [opacity, opacity + 0.2, opacity],
                }}
                transition={{
                    duration: speed * 0.6, // Relative to base speed
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px]"
                style={{ backgroundColor: color1 }}
            />

            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, 100, 0],
                    opacity: [opacity - 0.1, opacity + 0.1, opacity - 0.1],
                }}
                transition={{
                    duration: speed * 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px]"
                style={{ backgroundColor: color2 }}
            />

            {/* Floating Orbs/Circles */}
            <motion.div
                animate={{
                    x: [0, 200, -200, 0],
                    y: [0, -200, 200, 0],
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-indigo-500/40 rounded-full blur-[80px]"
                style={{ opacity: opacity }}
            />

            <motion.div
                animate={{
                    x: [0, -150, 150, 0],
                    y: [0, 150, -150, 0],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{
                    duration: speed * 1.2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 5
                }}
                className="absolute top-[60%] right-[30%] w-[250px] h-[250px] bg-sky-500/40 rounded-full blur-[60px]"
                style={{ opacity: opacity }}
            />

            {/* Texture Overlay (Optional for 'smoke' grain) */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
        </div>
    );
}
