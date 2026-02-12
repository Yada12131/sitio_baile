'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BackgroundAnimation({ settings }: { settings?: any }) {
    // Animation active - v3
    const [isMounted, setIsMounted] = useState(false);
    const [particles, setParticles] = useState<any[]>([]);

    // Defaults
    const color1 = settings?.animColor1 || '#9333ea'; // purple-600
    const color2 = settings?.animColor2 || '#db2777'; // pink-600
    const opacity = parseFloat(settings?.animOpacity || '0.3');
    const speed = parseInt(settings?.animSpeed || '30');

    useEffect(() => {
        setIsMounted(true);
        // Generate random particles only on client to avoid hydration mismatch
        const particleCount = window.innerWidth < 768 ? 40 : 60; // Less on mobile for perf, but bigger

        const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // %
            y: Math.random() * 100, // %
            size: Math.random() * 8 + 4, // 4px - 12px (Bigger for mobile visibility)
            duration: Math.random() * 20 + speed,
            delay: Math.random() * 5,
            color: Math.random() > 0.5 ? color1 : color2
        }));
        setParticles(newParticles);
    }, [speed, color1, color2]);

    if (!isMounted) return null;

    return (
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-transparent">
            {/* Ambient Nebula (Base Color Layer) */}
            <motion.div
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-pink-900/20"
            />

            {/* Large Floating Orbs (Depth) */}
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: speed * 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[100px]"
            />

            {/* Particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full will-change-transform translate-z-0 mix-blend-screen"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        boxShadow: `0 0 ${p.size * 2}px ${p.color}, 0 0 ${p.size * 4}px ${p.color}`, // Double Glow
                    }}
                    animate={{
                        y: [0, -150, 0],
                        x: [0, Math.random() * 80 - 40, 0],
                        opacity: [0.2, opacity + 0.4, 0.2], // Higher Base and Peak Opacity
                        scale: [0.8, 1.4, 0.8],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: p.delay,
                    }}
                />
            ))}
        </div>
    );
}
