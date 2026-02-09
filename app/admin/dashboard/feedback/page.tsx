import { getDb } from '@/lib/db';
import { Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Feedback {
    id: number;
    rating: number;
    comments: string;
    name?: string;
    created_at: string;
}

export default function FeedbackPage() {
    let feedbacks: Feedback[] = [];
    try {
        const db = getDb();
        feedbacks = db.prepare('SELECT * FROM feedback ORDER BY created_at DESC').all() as Feedback[];
    } catch (e) {
        console.error("Failed to load feedback:", e);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Comentarios de Clientes</h1>

            {feedbacks.length === 0 ? (
                <p className="text-gray-500 text-center py-10">No hay feedback registrado aún.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-zinc-900 rounded-xl border border-white/10">
                        <thead>
                            <tr className="text-left text-gray-400 border-b border-white/10">
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Nombre</th>
                                <th className="p-4">Puntuación</th>
                                <th className="p-4">Comentario</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-gray-300">
                            {feedbacks.map((item) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 font-medium text-white">{item.name || 'Anónimo'}</td>
                                    <td className="p-4 text-yellow-400 font-bold">{item.rating} / 5</td>
                                    <td className="p-4 max-w-xs truncate" title={item.comments}>{item.comments || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
