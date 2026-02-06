'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from './EventCard';

interface EventSliderProps {
    events: any[];
}

export default function EventSlider({ events }: EventSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -current.clientWidth : current.clientWidth;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!events || events.length === 0) {
        return <p className="text-gray-400 text-center italic">No hay eventos próximos.</p>;
    }

    return (
        <div className="relative group">
            {/* Scroll Buttons (Desktop) */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-black/50 hover:bg-pink-600 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hidden md:block"
                aria-label="Scroll left"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-black/50 hover:bg-pink-600 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hidden md:block"
                aria-label="Scroll right"
            >
                <ChevronRight size={24} />
            </button>

            {/* Slider Container */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-8 px-4 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {events.map((event) => (
                    <div key={event.id} className="min-w-[300px] md:min-w-[350px] snap-center">
                        <EventCard event={event} />
                    </div>
                ))}
            </div>

            {/* Mobile Swipe Indicator/Hint could go here if needed */}
        </div>
    );
}
