import { Users, Target, Heart, Award } from 'lucide-react';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function About() {
    let teamMembers: any[] = [];
    try {
        const res = await query('SELECT * FROM team_members');
        teamMembers = res.rows;
    } catch (e) {
        console.error("Failed to load team members:", e);
    }

    return (
        <div className="bg-black min-h-screen text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-20">

                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                        ¿Quiénes Somos?
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        El Club Deportivo Ritmos nace el 14 de enero de 2019 con el respaldo del INDER de Medellín,
                        afiliado a la Liga de Baile Deportivo de Antioquia. Somos una organización comprometida con
                        fomentar la práctica del deporte y el arte como herramientas de transformación social.
                    </p>
                </div>

                {/* Mission & Vision Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/10 hover:border-pink-500/30 transition-colors">
                        <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-6">
                            <Target className="text-pink-500" size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Nuestra Misión</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Promovemos el baile deportivo como un deporte artístico y competitivo, y como un medio de desarrollo integral
                            que combina la disciplina, el bienestar mental y la innovación.
                        </p>
                    </div>
                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-colors">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                            <Heart className="text-purple-500" size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Nuestros Valores</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Nos mueven la disciplina, la resiliencia y el sentido de pertenencia. Llevamos el deporte más allá del escenario,
                            generando experiencias memorables para todos.
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <div>
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
                        <Users className="text-pink-500" /> Nuestro Equipo
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member: any) => (
                            <div key={member.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-1 group">
                                <div className="h-2 bg-gradient-to-r from-pink-500 to-purple-600"></div>
                                <div className="p-8">
                                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform ring-2 ring-white/10 group-hover:ring-pink-500/50">
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <span className="text-2xl font-bold text-gray-500">{member.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-center text-white mb-2">{member.name}</h3>
                                    <p className="text-pink-400 text-center text-xs font-bold uppercase tracking-wider mb-4">{member.role}</p>
                                    <p className="text-gray-400 text-center text-sm leading-relaxed">{member.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Closing Statement */}
                <div className="text-center bg-gradient-to-r from-zinc-900 to-black p-12 rounded-3xl border border-white/10">
                    <Award className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-4">Más que un Club</h3>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        En Ritmos, el deporte se vive, se siente y se transforma en una verdadera forma de vida.
                        Ofrecemos desde presentaciones artísticas únicas hasta talleres psicodeportivos con intervenciones asistidas con perros.
                    </p>
                </div>
            </div>
        </div>
    );
}
