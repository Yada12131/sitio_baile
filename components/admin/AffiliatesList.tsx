'use client';

import { useState, useEffect } from 'react';
import { Download, Search, RefreshCw } from 'lucide-react';

interface Affiliate {
    id: number;
    data: any; // JSONB
    status: string;
    created_at: string;
}

export default function AffiliatesList() {
    const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAffiliates();
    }, []);

    const fetchAffiliates = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/affiliates');
            if (res.ok) {
                const data = await res.json();
                setAffiliates(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAffiliates = affiliates.filter(aff => {
        const jsonString = JSON.stringify(aff.data).toLowerCase();
        return jsonString.includes(searchTerm.toLowerCase());
    });

    const downloadCSV = () => {
        if (affiliates.length === 0) return;

        // Collect all unique keys from all data objects
        const allKeys = new Set<string>();
        affiliates.forEach(aff => {
            Object.keys(aff.data).forEach(k => allKeys.add(k));
        });
        const headers = ['ID', 'Fecha', 'Estado', ...Array.from(allKeys)];

        const csvContent = [
            headers.join(','),
            ...filteredAffiliates.map(aff => {
                const row = [
                    aff.id,
                    new Date(aff.created_at).toLocaleDateString(),
                    aff.status,
                    ...Array.from(allKeys).map(k => `"${aff.data[k] || ''}"`)
                ];
                return row.join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'afiliados.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar afiliados..."
                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-pink-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchAffiliates} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-white" title="Recargar">
                        <RefreshCw size={20} />
                    </button>
                    <button onClick={downloadCSV} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
                        <Download size={20} /> Exportar CSV
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto bg-zinc-900/50 border border-white/10 rounded-xl">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-zinc-900 text-gray-200 uppercase font-bold text-xs">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Documento</th>
                            <th className="px-6 py-4">Contacto</th>
                            <th className="px-6 py-4">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center">Cargando datos...</td></tr>
                        ) : filteredAffiliates.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center">No se encontraron registros.</td></tr>
                        ) : filteredAffiliates.map((aff) => (
                            <tr key={aff.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs">#{aff.id}</td>
                                <td className="px-6 py-4">{new Date(aff.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-bold text-white">{aff.data.name || 'Sin Nombre'}</td>
                                <td className="px-6 py-4">{aff.data.idNumber || '-'}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span>{aff.data.phone}</span>
                                        <span className="text-xs text-gray-500">{aff.data.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${aff.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                                        {aff.status === 'pending' ? 'Pendiente' : aff.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
