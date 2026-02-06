import { Users } from 'lucide-react';

export default function About() {
    return (
        <div className="bg-black min-h-screen text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Sobre Nosotros
                </h1>

                <div className="glass-panel p-8 rounded-2xl mb-12">
                    <p className="text-xl text-gray-300 leading-relaxed mb-6">
                        Elite Club nació en 2024 con una misión simple: redefinir la vida nocturna en la ciudad.
                        No somos solo una discoteca, somos un destino para aquellos que buscan excelencia en música,
                        servicio y ambiente.
                    </p>
                    <p className="text-lg text-gray-400">
                        Nuestras instalaciones cuentan con tecnología de sonido de última generación,
                        diseño acústico impecable y un sistema de iluminación que te transportará a otra dimensión.
                    </p>
                </div>

                <h2 className="text-3xl font-bold mb-8 text-center">Nuestro Equipo</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                        { role: "Fundador", name: "Carlos M.", desc: "Visionario de la vida nocturna con 15 años de experiencia." },
                        { role: "Jefe de Barra", name: "Ana R.", desc: "Mixóloga premiada, creadora de nuestros cócteles insignia." },
                    ].map((member, i) => (
                        <div key={i} className="bg-zinc-900 rounded-xl p-6 border border-white/5 hover:border-pink-500/30 transition-colors">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <Users className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-center">{member.name}</h3>
                            <p className="text-pink-500 text-center text-sm uppercase tracking-wide mb-2">{member.role}</p>
                            <p className="text-gray-400 text-center text-sm">{member.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
