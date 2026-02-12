'use client';

import { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import ImageUpload from './ImageUpload';
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
                            <ImageUpload
                                label="Logo del Sitio"
                                value={settings.logoUrl || ''}
                                onChange={(url) => handleChange('logoUrl', url)}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-gray-400 mb-2">Tamaño del Logo (px): {settings.logoHeight || 40}px</label>
                            <input
                                type="range"
                                min="30"
                                max="200"
                                value={settings.logoHeight || 40}
                                onChange={(e) => handleChange('logoHeight', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 border-t border-white/10 pt-4 mt-2">
                            <h3 className="text-lg font-semibold text-white mb-4">Tipografía General</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-gray-400 mb-2">Color de Títulos</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color" value={settings.headingColor || '#ffffff'} onChange={(e) => handleChange('headingColor', e.target.value)}
                                            className="h-12 w-12 rounded bg-transparent cursor-pointer"
                                        />
                                        <input
                                            type="text" value={settings.headingColor || ''} onChange={(e) => handleChange('headingColor', e.target.value)}
                                            className="flex-1 bg-black border border-white/20 rounded-lg p-3 text-white uppercase"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Color de Párrafos</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color" value={settings.bodyColor || '#9ca3af'} onChange={(e) => handleChange('bodyColor', e.target.value)}
                                            className="h-12 w-12 rounded bg-transparent cursor-pointer"
                                        />
                                        <input
                                            type="text" value={settings.bodyColor || ''} onChange={(e) => handleChange('bodyColor', e.target.value)}
                                            className="flex-1 bg-black border border-white/20 rounded-lg p-3 text-white uppercase"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Escala de Fuente ({settings.fontScale || 1}x)</label>
                                    <input
                                        type="range"
                                        min="0.8"
                                        max="1.5"
                                        step="0.05"
                                        value={settings.fontScale || 1}
                                        onChange={(e) => handleChange('fontScale', e.target.value)}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>
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
                            <label className="block text-gray-400 mb-2">Color Secundaria (Hex)</label>
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

                        {/* Animation Settings */}
                        <div className="col-span-1 md:col-span-2 border-t border-white/10 pt-4 mt-2">
                            <h3 className="text-lg font-semibold text-pink-400 mb-4">Animación de Fondo</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-400 mb-2">Color Humo 1</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color" value={settings.animColor1 || '#9333ea'} onChange={(e) => handleChange('animColor1', e.target.value)}
                                            className="h-12 w-12 rounded bg-transparent cursor-pointer"
                                        />
                                        <input
                                            type="text" value={settings.animColor1 || ''} onChange={(e) => handleChange('animColor1', e.target.value)}
                                            className="flex-1 bg-black border border-white/20 rounded-lg p-3 text-white uppercase"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Color Humo 2</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color" value={settings.animColor2 || '#db2777'} onChange={(e) => handleChange('animColor2', e.target.value)}
                                            className="h-12 w-12 rounded bg-transparent cursor-pointer"
                                        />
                                        <input
                                            type="text" value={settings.animColor2 || ''} onChange={(e) => handleChange('animColor2', e.target.value)}
                                            className="flex-1 bg-black border border-white/20 rounded-lg p-3 text-white uppercase"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Color Humo 3</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color" value={settings.animColor3 || '#06b6d4'} onChange={(e) => handleChange('animColor3', e.target.value)}
                                            className="h-12 w-12 rounded bg-transparent cursor-pointer"
                                        />
                                        <input
                                            type="text" value={settings.animColor3 || ''} onChange={(e) => handleChange('animColor3', e.target.value)}
                                            className="flex-1 bg-black border border-white/20 rounded-lg p-3 text-white uppercase"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Opacidad ({settings.animOpacity || 0.3})</label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1.0"
                                        step="0.1"
                                        value={settings.animOpacity || 0.3}
                                        onChange={(e) => handleChange('animOpacity', e.target.value)}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Más bajo es más sutil. Más alto es más visible.</p>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Velocidad ({settings.animSpeed || 30}s)</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="120"
                                        step="5"
                                        value={settings.animSpeed || 30}
                                        onChange={(e) => handleChange('animSpeed', e.target.value)}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Tiempo en completar un ciclo (Más alto = Más lento).</p>
                                </div>
                            </div>
                        </div>
                        {/* Navbar Settings */}
                        <div className="md:col-span-2 border-t border-white/10 pt-4 mt-2">
                            <h3 className="text-lg font-semibold text-white mb-4">Personalización de Barra de Navegación</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-400 mb-2">Color de Fondo (Navbar)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color" value={settings.navbarBgColor || '#000000'} onChange={(e) => handleChange('navbarBgColor', e.target.value)}
                                            className="h-12 w-12 rounded bg-transparent cursor-pointer"
                                        />
                                        <input
                                            type="text" value={settings.navbarBgColor || ''} onChange={(e) => handleChange('navbarBgColor', e.target.value)}
                                            className="flex-1 bg-black border border-white/20 rounded-lg p-3 text-white uppercase"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Color del Texto (Navbar)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color" value={settings.navbarTextColor || '#ffffff'} onChange={(e) => handleChange('navbarTextColor', e.target.value)}
                                            className="h-12 w-12 rounded bg-transparent cursor-pointer"
                                        />
                                        <input
                                            type="text" value={settings.navbarTextColor || ''} onChange={(e) => handleChange('navbarTextColor', e.target.value)}
                                            className="flex-1 bg-black border border-white/20 rounded-lg p-3 text-white uppercase"
                                        />
                                    </div>
                                </div>
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

                {/* Contenido Home (Destacados) */}
                <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
                    <h2 className="text-xl font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">Página de Inicio (Destacados)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="space-y-4">
                                <h3 className="font-bold text-white">Destacado {num}</h3>
                                <div>
                                    <label className="block text-gray-400 mb-2">Título</label>
                                    <input
                                        type="text" value={settings[`highlight${num}Title`] || ''} onChange={(e) => handleChange(`highlight${num}Title`, e.target.value)}
                                        className="w-full bg-black border border-white/20 rounded-lg p-3 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Descripción</label>
                                    <textarea
                                        value={settings[`highlight${num}Desc`] || ''} onChange={(e) => handleChange(`highlight${num}Desc`, e.target.value)}
                                        className="w-full bg-black border border-white/20 rounded-lg p-3 text-white h-24"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contenido Sobre Nosotros */}
                <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
                    <h2 className="text-xl font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">Sobre Nosotros</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-2">Título</label>
                            <input
                                type="text" value={settings.aboutTitle || ''} onChange={(e) => handleChange('aboutTitle', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Descripción Principal</label>
                            <textarea
                                value={settings.aboutDescription || ''} onChange={(e) => handleChange('aboutDescription', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white h-32"
                            />
                        </div>
                    </div>
                </section>

                {/* Información de Contacto */}
                <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
                    <h2 className="text-xl font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">Contacto</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">Dirección</label>
                            <input
                                type="text" value={settings.contactAddress || ''} onChange={(e) => handleChange('contactAddress', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Teléfono</label>
                            <input
                                type="text" value={settings.contactPhone || ''} onChange={(e) => handleChange('contactPhone', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Email</label>
                            <input
                                type="text" value={settings.contactEmail || ''} onChange={(e) => handleChange('contactEmail', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white"
                            />
                        </div>
                    </div>
                </section >

                {/* Redes Sociales */}
                < section className="bg-zinc-900 p-6 rounded-xl border border-white/10" >
                    <h2 className="text-xl font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">Redes Sociales (URLs)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">Facebook</label>
                            <input
                                type="text" value={settings.facebookUrl || ''} onChange={(e) => handleChange('facebookUrl', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Instagram</label>
                            <input
                                type="text" value={settings.instagramUrl || ''} onChange={(e) => handleChange('instagramUrl', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">TikTok</label>
                            <input
                                type="text" value={settings.tiktokUrl || ''} onChange={(e) => handleChange('tiktokUrl', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">YouTube</label>
                            <input
                                type="text" value={settings.youtubeUrl || ''} onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded-lg p-3 text-white"
                            />
                        </div>
                    </div>
                </section >
            </div >
        </div >
    );
}
