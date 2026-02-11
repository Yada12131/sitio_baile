'use client';

import { useState } from 'react';
import AffiliatesList from '@/components/admin/AffiliatesList';
import FormBuilder from '@/components/admin/FormBuilder';
import { Users, Settings } from 'lucide-react';

export default function AffiliatesAdminPage() {
    const [activeTab, setActiveTab] = useState<'list' | 'builder'>('list');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                    Gestión de Afiliados
                </h1>

                <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/10">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeTab === 'list' ? 'bg-zinc-800 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Users size={18} /> Registros
                    </button>
                    <button
                        onClick={() => setActiveTab('builder')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeTab === 'builder' ? 'bg-zinc-800 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Settings size={18} /> Configurar Formulario
                    </button>
                </div>
            </div>

            <div className="mt-8">
                {activeTab === 'list' ? <AffiliatesList /> : <FormBuilder />}
            </div>
        </div>
    );
}
