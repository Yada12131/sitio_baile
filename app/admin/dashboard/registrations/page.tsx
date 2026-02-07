import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface Registration {
    id: number;
    class_name: string;
    student_name: string;
    student_email: string;
    student_phone: string;
    created_at: string;
}

export default function RegistrationsPage() {
    const db = getDb();
    const registrations = db.prepare(`
    SELECT r.*, c.name as class_name 
    FROM registrations r 
    JOIN classes c ON r.class_id = c.id 
    ORDER BY r.created_at DESC
  `).all() as Registration[];

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Inscripciones Recibidas</h1>

            <div className="bg-zinc-900 rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400">
                            <tr>
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Clase</th>
                                <th className="p-4">Estudiante</th>
                                <th className="p-4">Correo</th>
                                <th className="p-4">Teléfono</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-gray-300">
                            {registrations.map((reg) => (
                                <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(reg.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 font-bold text-pink-500">{reg.class_name || 'Clase Eliminada'}</td>
                                    <td className="p-4 font-medium text-white">{reg.student_name}</td>
                                    <td className="p-4">{reg.student_email}</td>
                                    <td className="p-4">{reg.student_phone || '-'}</td>
                                </tr>
                            ))}
                            {registrations.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No hay inscripciones aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
