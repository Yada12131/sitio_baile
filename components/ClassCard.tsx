'use client';

import { Users, Calendar, Clock } from 'lucide-react';

interface ClassData {
    id: number;
    name: string;
    instructor: string;
    schedule: string;
    capacity: number;
}

interface ClassCardProps {
    classData: ClassData;
    onRegister: (cls: ClassData) => void;
}

export default function ClassCard({ classData, onRegister }: ClassCardProps) {
    return (
        <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-green-500/50 transition-all group p-6 flex flex-col h-full">
            <h3 className="text-2xl font-bold text-white mb-2">{classData.name}</h3>
            <p className="text-pink-500 font-semibold mb-4">{classData.instructor}</p>

            <div className="space-y-3 mb-8 flex-1 text-gray-300">
                <div className="flex items-center gap-3">
                    <Calendar className="text-[var(--primary-color)]" size={18} />
                    <span>{classData.schedule}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Users className="text-[var(--primary-color)]" size={18} />
                    <span>Cupo limitado: {classData.capacity} personas</span>
                </div>
            </div>

            <button
                onClick={() => onRegister(classData)}
                className="w-full py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity mt-auto uppercase tracking-wide text-sm"
                style={{ background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))' }}
            >
                Inscribirme
            </button>
        </div>
    );
}
