'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AdminDeleteButtonProps {
    id: number;
    endpoint: string; // e.g., 'messages' or 'registrations'
}

export default function AdminDeleteButton({ id, endpoint }: AdminDeleteButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer.')) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/${endpoint}/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert('Error al eliminar');
            }
        } catch (error) {
            console.error(error);
            alert('Error al eliminar');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Eliminar"
        >
            <Trash2 size={18} />
        </button>
    );
}
