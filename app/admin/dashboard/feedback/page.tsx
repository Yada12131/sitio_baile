import { getDb } from '@/lib/db';
import { Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Feedback {
    id: number;
    rating: number;
    comments: string;
    created_at: string;
}

export default function FeedbackPage() {
    const db = getDb();
    const feedbacks = db.prepare('SELECT * FROM feedback ORDER BY created_at DESC').all() as Feedback[];

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Comentarios de Clientes</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbacks.map((item) => (
                    <div key={item.id} className="bg-zinc-900 p-6 rounded-xl border border-white/10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={i < item.rating ? "fill-current" : "text-gray-700"} />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-300 italic">"{item.comments || 'Sin comentarios'}"</p>
                    </div>
                ))}
                {feedbacks.length === 0 && (
                    <p className="text-gray-500 col-span-full text-center py-10">No hay feedback registrado aún.</p>
                )}
            </div>
        </div>
    );
}
