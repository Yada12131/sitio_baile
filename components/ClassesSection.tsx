'use client';

import { useState } from 'react';
import ClassCard from './ClassCard';
import ClassRegistrationModal from './ClassRegistrationModal';
import { AnimatePresence } from 'framer-motion';

interface ClassData {
    id: number;
    name: string;
    instructor: string;
    schedule: string;
    capacity: number;
}

export default function ClassesSection({ classes }: { classes: ClassData[] }) {
    const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {classes.map((cls) => (
                    <ClassCard key={cls.id} classData={cls} onRegister={setSelectedClass} />
                ))}
            </div>

            <ClassRegistrationModal
                selectedClass={selectedClass}
                onClose={() => setSelectedClass(null)}
            />
        </>
    );
}
