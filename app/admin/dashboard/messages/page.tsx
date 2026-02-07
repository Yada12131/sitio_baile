import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string;
    created_at: string;
}

export default function MessagesPage() {
    const db = getDb();
    const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all() as Message[];

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Mensajes Recibidos</h1>

            <div className="bg-zinc-900 rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400">
                            <tr>
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Nombre</th>
                                <th className="p-4">Correo</th>
                                <th className="p-4">Teléfono</th>
                                <th className="p-4">Asunto</th>
                                <th className="p-4">Mensaje</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-gray-300">
                            {messages.map((msg) => (
                                <tr key={msg.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(msg.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 font-medium text-white">{msg.name}</td>
                                    <td className="p-4">{msg.email}</td>
                                    <td className="p-4">{/* @ts-ignore */ msg.phone || '-'}</td>
                                    <td className="p-4">{msg.subject}</td>
                                    <td className="p-4 max-w-xs truncate" title={msg.message}>{msg.message}</td>
                                </tr>
                            ))}
                            {messages.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No hay mensajes mensajes aún.
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
