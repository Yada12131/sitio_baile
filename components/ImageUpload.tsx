'use client';

import { useState } from 'react';
import { Image as ImageIcon, Loader2, UploadCloud, X } from 'lucide-react';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    className?: string; // Allow minimal styling overrides
}

export default function ImageUpload({ value, onChange, label = "Imagen", className = "" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'club_baile'); // User provided preset

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/dcph4xznt/image/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error?.message || 'Error al subir imagen');
            }

            const data = await res.json();
            onChange(data.secure_url);
        } catch (err: any) {
            console.error("Upload error:", err);
            setError("Error al subir. Intenta de nuevo.");
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        onChange('');
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-gray-400 text-sm font-medium mb-1">{label}</label>

            <div className="flex items-start gap-4">
                {/* Preview Area */}
                <div className="relative w-32 h-32 bg-zinc-800 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden shrink-0 group hover:border-pink-500/50 transition-colors">
                    {uploading ? (
                        <Loader2 className="animate-spin text-pink-500" size={24} />
                    ) : value ? (
                        <>
                            <img src={value} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={handleRemove}
                                type="button"
                                className="absolute top-1 right-1 bg-red-600/80 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                title="Eliminar imagen"
                            >
                                <X size={12} />
                            </button>
                        </>
                    ) : (
                        <ImageIcon className="text-gray-600" size={32} />
                    )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-2">
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                            className="hidden"
                            id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).substr(2, 9)}`}
                        />
                        <label
                            htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).substr(2, 9)}`} // This needs to match the input ID, but generating unique IDs in simple components can be tricky without uuid. 
                        // Let's simplify and just use a customized label approach or accessible File Input styling.
                        // Better approach for ensuring click triggers input:
                        >
                            {/* Actually, let's just make the input visible but styled, or link label to input properly. 
                               Simplest React pattern: use a ref or just a label wrapping the input (hidden) and a button likeness.
                           */}
                        </label>

                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-white/10 transition-colors">
                            <UploadCloud size={18} />
                            <span>{uploading ? 'Subiendo...' : 'Seleccionar Archivo'}</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={uploading}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="text-xs text-gray-500">
                        <p>Formatos: JPG, PNG, WEBP</p>
                        <p>Máx: 10MB</p>
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs">{error}</p>
                    )}

                    {/* Fallback Text Input for manual URL */}
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="O pegar URL directa..."
                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-gray-400 focus:text-white focus:border-pink-500/50 outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
