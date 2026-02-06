'use client';

import { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsManager({ initialSettings }: { initialSettings: any }) {
    const [settings, setSettings] = useState(initialSettings);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const handleChange = (key: string, value: string) => {
        setSettings({ ...settings, [key]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });
        setSaving(false);
        router.refresh();
    };

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Configuración del Sitio</h1>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold transition-all disabled:opacity-50"
                >
                    {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">

                {/* Identidad de Marca */}
                <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
                    <h2 className="text-xl font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">Identidad de Marca</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">Nombre del Sitio</label>
                            <input
                                type="text" value={settings.siteName || ''} onChange={(e) => handleChange('siteName', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Logo (URL)</label>
                            <input
                                type="text" value={settings.logoUrl || ''} onChange={(e) => handleChange('logoUrl', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white"
                                placeholder="/logo.png"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Color Primario (Hex)</label>
                            <div className="flex gap-2">
                                <input
                                    type="color" value={settings.primaryColor || '#ec4899'} onChange={(e) => handleChange('primaryColor', e.target.value)}
                                    className="h-12 w-12 rounded bg-transparent cursor-pointer"
                                />
                                <input
                                    type="text" value={settings.primaryColor || ''} onChange={(e) => handleChange('primaryColor', e.target.value)}
                                    className="flex-1 bg-black border border-white/20 rounded-lg p-3 text-white uppercase"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Color Secundario (Hex)</label>
                            <div className="flex gap-2">
                                <input
                                    type="color" value={settings.accentColor || '#a855f7'} onChange={(e) => handleChange('accentColor', e.target.value)}
                                    className="h-12 w-12 rounded bg-transparent cursor-pointer"
                                />
                                <input
                                    type="text" value={settings.accentColor || ''} onChange={(e) => handleChange('accentColor', e.target.value)}
                                    className="flex-1 bg-black border border-white/20 rounded-lg p-3 text-white uppercase"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contenido Home */}
                <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
                    <h2 className="text-xl font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">Página de Inicio (Hero)</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-2">Título Principal</label>
                            <input
                                type="text" value={settings.heroTitle || ''} onChange={(e) => handleChange('heroTitle', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Subtítulo</label>
                            <textarea
                                value={settings.heroSubtitle || ''} onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white h-24"
                            />
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
