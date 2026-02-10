import { Users, Target, Heart, Award } from 'lucide-react';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function About() {
    let teamMembers: any[] = [];
    let settingsObj: any = {};

    try {
        const teamRes = await query('SELECT * FROM team_members');
        teamMembers = teamRes.rows;

        const settingsRes = await query('SELECT * FROM settings WHERE key IN ($1, $2)', ['aboutTitle', 'aboutDescription']);
        settingsObj = settingsRes.rows.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
    } catch (e) {
        console.error("Failed to load about data:", e);
    }

    const title = settingsObj.aboutTitle || '¿Quiénes Somos?';
    const description = settingsObj.aboutDescription || 'El Club Deportivo Ritmos nace el 14 de enero de 2019 con el respaldo del INDER de Medellín, afiliado a la Liga de Baile Deportivo de Antioquia. Somos una organización comprometida con fomentar la práctica del deporte y el arte como herramientas de transformación social.';

    return (
        <div className="bg-black min-h-screen text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-20">

                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold text-gradient">
                        {title}
                    </h1>
                    <p className="text-xl max-w-3xl mx-auto leading-relaxed whitespace-pre-line text-center" style={{ color: 'var(--body-color)' }}>
                        {description}
                    </p>
                </div>

                {/* Mission & Vision Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/10 transition-colors hover:border-[var(--primary-color)]">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(var(--primary-color), 0.2)' }}>
                            <Target style={{ color: 'var(--primary-color)' }} size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gradient">Nuestra Misión</h3>
                        <p className="leading-relaxed" style={{ color: 'var(--body-color)' }}>
                            Promovemos el baile deportivo como un deporte artístico y competitivo, y como un medio de desarrollo integral
                            que combina la disciplina, el bienestar mental y la innovación.
                        </p>
                    </div>
                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/10 transition-colors hover:border-[var(--accent-color)]">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(var(--accent-color), 0.2)' }}>
                            <Heart style={{ color: 'var(--accent-color)' }} size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gradient">Nuestros Valores</h3>
                        <p className="leading-relaxed" style={{ color: 'var(--body-color)' }}>
                            Nos mueven la disciplina, la resiliencia y el sentido de pertenencia. Llevamos el deporte más allá del escenario,
                            generando experiencias memorables para todos.
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <div>
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3 text-gradient">
                        <Users style={{ color: 'var(--primary-color)' }} /> Nuestro Equipo
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member: any) => (
                            <div key={member.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 hover:-translate-y-1 group hover:border-[var(--primary-color)]">
                                <div className="h-2" style={{ backgroundImage: 'linear-gradient(to right, var(--primary-color), var(--accent-color))' }}></div>
                                <div className="p-8">
                                    <div className="w-full aspect-[3/4] bg-zinc-800 flex items-center justify-center mb-6 mx-auto group-hover:scale-[1.02] transition-transform overflow-hidden relative">
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-bold text-gray-700">{member.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-center mb-2 text-gradient">{member.name}</h3>
                                    <p className="text-center text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--primary-color)' }}>{member.role}</p>
                                    <p className="text-left text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--body-color)' }}>{member.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Closing Statement */}
                <div className="text-center bg-gradient-to-r from-zinc-900 to-black p-12 rounded-3xl border border-white/10">
                    <Award className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--heading-color)' }}>Más que un Club</h3>
                    <p className="max-w-2xl mx-auto" style={{ color: 'var(--body-color)' }}>
                        En Ritmos, el deporte se vive, se siente y se transforma en una verdadera forma de vida.
                        Ofrecemos desde presentaciones artísticas únicas hasta talleres psicodeportivos con intervenciones asistidas con perros.
                    </p>
                </div>
            </div>
        </div>
    );
}
