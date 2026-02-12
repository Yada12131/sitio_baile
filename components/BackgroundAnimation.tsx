'use client';

import { useEffect, useState } from 'react';

export default function BackgroundAnimation({ settings }: { settings?: any }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    // Hardcoded colors for reliability if settings fail
    const c1 = settings?.animColor1 || '#9333ea';
    const c2 = settings?.animColor2 || '#db2777';

    // Generate static positions for 30 particles
    const particles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: `${(i * 3.3) + Math.random() * 5}%`, // Distribute evenly
        top: `${Math.random() * 100}%`,
        size: Math.random() > 0.5 ? '8px' : '15px', // Big particles
        delay: `-${Math.random() * 20}s`, // Negative delay for instant start
        duration: `${20 + Math.random() * 10}s`,
        color: i % 2 === 0 ? c1 : c2
    }));

    return (
        <div className="fixed inset-0 z-[50] overflow-hidden pointer-events-none mix-blend-screen">
            {/* CSS Styles for floating animation */}
            <style jsx global>{`
                @keyframes float-up {
                    0% { transform: translateY(0) scale(1); opacity: 0.3; }
                    50% { transform: translateY(-100px) scale(1.5); opacity: 0.8; }
                    100% { transform: translateY(-200px) scale(1); opacity: 0.3; }
                }
                .particle {
                    position: absolute;
                    border-radius: 50%;
                    animation-name: float-up;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                    mix-blend-mode: screen; 
                    box-shadow: 0 0 10px currentColor; /* Glow */
                }
            `}</style>

            {/* Dark Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />

            {/* Particles */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        color: p.color, // For shadow
                        animationDuration: p.duration,
                        animationDelay: p.delay,
                    }}
                />
            ))}
        </div>
    );
}
