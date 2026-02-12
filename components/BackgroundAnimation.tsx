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
        const particleCount = window.innerWidth < 768 ? 40 : 60;

        const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // %
            y: Math.random() * 100, // %
            size: Math.random() * 10 + 5, // 5px - 15px (HUGE for visibility check)
            duration: Math.random() * 20 + 20, // Slow movement
            delay: Math.random() * 5,
            color: Math.random() > 0.5 ? color1 : color2
        }));
        setParticles(newParticles);
    }, [speed, color1, color2]);

    if (!isMounted) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none bg-transparent">
            {/* DEBUG INDICATOR - Remove after confirming visibility */}
            {/* <div className="absolute bottom-5 right-5 text-white bg-red-600 px-2 rounded z-[99999]">Animation: ON</div> */}

            {/* Ambient Nebula (Base Color Layer) - Increased Opacity */}
            <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-pink-900/30"
            />

            {/* Large Floating Orbs (Depth) */}
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 60, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-purple-600/20 rounded-full blur-[80px]"
            />

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
                        boxShadow: `0 0 ${p.size}px ${p.color}`, // Solid Glow
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 40 - 20, 0],
                        opacity: [0.4, 0.8, 0.4], // HIGH OPACITY (0.4 - 0.8)
                        scale: [0.8, 1.2, 0.8],
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
