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
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-transparent">
            {/* Ambient Glow (Background Base) */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-black/40" />

            {/* Particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full will-change-transform translate-z-0"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                    }}
                    animate={{
                        y: [0, -120, 0], // Float up and around
                        x: [0, Math.random() * 60 - 30, 0], // Slight horizontal drift
                        opacity: [0.1, opacity + 0.3, 0.1], // Fade in/out (Boosted)
                        scale: [0.5, 1.2, 0.5],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: p.delay,
                    }}
                />
            ))}

            {/* Subtle Gradient Orbs (Reduced for cleanliness) */}
            <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/10 to-transparent"
            />
        </div>
    );
}
