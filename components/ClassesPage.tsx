'use client';

import { useState } from 'react';
import ClassCard from './ClassCard';
import ClassRegistrationModal from './ClassRegistrationModal';

interface ClassData {
    id: number;
    name: string;
    instructor: string;
    schedule: string;
    capacity: number;
}

export default function ClassesPage({ classes, settings }: { classes: ClassData[], settings?: any }) {
    const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

    return (
        <div className="bg-black min-h-screen text-white pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <h1
                    className="text-4xl md:text-6xl font-bold mb-8 text-center inline-block w-full"
                    style={{
                        backgroundImage: 'linear-gradient(to right, var(--primary-color), var(--accent-color))',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        display: 'inline-block'
                    }}
                >
                    {settings?.classesTitle || "Clases de Baile"}
                </h1>
                <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16 text-lg">
                    {settings?.classesSubtitle || "Aprende a bailar con los mejores instructores. Ofrecemos clases para todos los niveles, desde principiantes hasta avanzados."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {classes.map((cls) => (
                        <ClassCard key={cls.id} classData={cls} onRegister={setSelectedClass} />
                    ))}
                </div>

                {classes.length === 0 && (
                    <p className="text-center text-gray-500 text-xl mt-10">Muy pronto publicaremos nuestros horarios.</p>
                )}
            </div>

            <ClassRegistrationModal
                selectedClass={selectedClass}
                onClose={() => setSelectedClass(null)}
            />
        </div>
    );
}
