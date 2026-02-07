'use client';

import Link from 'next/link';
import { LayoutDashboard, Calendar, MessageSquare, Star, LogOut, Settings, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Eventos', href: '/admin/dashboard/events', icon: Calendar },
        { name: 'Clases', href: '/admin/dashboard/classes', icon: Star },
        { name: 'Inscripciones', href: '/admin/dashboard/registrations', icon: MessageSquare },
        { name: 'Mensajes', href: '/admin/dashboard/messages', icon: MessageSquare },
        { name: 'Feedback', href: '/admin/dashboard/feedback', icon: Star },
        { name: 'Equipo', href: '/admin/dashboard/team', icon: Users },
        { name: 'Configuración', href: '/admin/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-black text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 border-r border-white/10 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                        Admin Panel
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/10 transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-black p-8">
                {children}
            </main>
        </div>
    );
}
