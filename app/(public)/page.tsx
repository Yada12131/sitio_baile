import Hero from '@/components/Hero';
import EventSlider from '@/components/EventSlider';
import { Music, Users, Star, Calendar } from 'lucide-react';
import Link from 'next/link';
import { query } from '@/lib/db';
import ClassesSection from '@/components/ClassesSection';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let events = [];
  let classes = [];
  let settingsObj: Record<string, string> = {};

  try {
    const eventsRes = await query('SELECT * FROM events ORDER BY date ASC LIMIT 3');
    events = eventsRes.rows;

    const classesRes = await query('SELECT * FROM classes ORDER BY name ASC LIMIT 3');
    classes = classesRes.rows;

    const settingsRes = await query('SELECT * FROM settings');
    settingsObj = settingsRes.rows.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
  } catch (e) {
    console.error("Failed to load home data", e);
  }

  const heroTitle = settingsObj.heroTitle || 'Bienvenido a Elite Club';
  const heroSubtitle = settingsObj.heroSubtitle || 'La mejor experiencia de baile, música y diversión en la ciudad.';

  const highlights = [
    {
      icon: Music,
      title: settingsObj.highlight1Title || "Sonido Envolvente",
      desc: settingsObj.highlight1Desc || "Sistema de audio de alta fidelidad que te hará sentir cada beat."
    },
    {
      icon: Star,
      title: settingsObj.highlight2Title || "Experiencia VIP",
      desc: settingsObj.highlight2Desc || "Zonas exclusivas, servicio a la mesa y atención personalizada."
    },
    {
      icon: Users,
      title: settingsObj.highlight3Title || "Ambiente Único",
      desc: settingsObj.highlight3Desc || "La mejor gente, la mejor energía y noches que no terminan."
    },
  ];

  return (
    <div className="flex flex-col gap-16 pb-20">
      <Hero title={heroTitle} subtitle={heroSubtitle} />

      {/* Highlights Section */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 inline-block"
              style={{
                backgroundImage: 'linear-gradient(to right, var(--primary-color), var(--accent-color))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block'
              }}
            >
              ¿Por qué elegirnos?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Creamos momentos inolvidables con la mejor atmósfera, DJs exclusivos y un servicio premium.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {highlights.map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 transition-all hover:-translate-y-2 glass-panel">
                <feature.icon className="w-12 h-12 text-pink-500 mb-6" />
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Preview Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4 inline-block"
              style={{
                backgroundImage: 'linear-gradient(to right, var(--primary-color), var(--accent-color))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block'
              }}
            >
              Nuestras Clases
            </h2>
            <p className="text-xl text-gray-300">Aprende a bailar con los mejores instructores de la ciudad.</p>
          </div>

          <ClassesSection classes={classes} />

          <div className="text-center mt-12">
            <Link href="/classes" className="inline-flex items-center gap-2 px-8 py-3 border border-white/20 text-white rounded-full font-bold hover:bg-white hover:text-black transition-colors">
              Ver Todas las Clases
            </Link>
          </div>
        </div>
      </section>

      {/* Events Slider Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4 inline-block"
              style={{
                backgroundImage: 'linear-gradient(to right, var(--primary-color), var(--accent-color))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block'
              }}
            >
              Próximos Eventos
            </h2>
            <p className="text-xl text-gray-300">No te pierdas nuestras noches temáticas y fiestas especiales.</p>
          </div>

          <div className="mb-12">
            <EventSlider events={events} />
          </div>

          <div className="text-center">
            <Link href="/events" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 hover:shadow-white/20 transform hover:-translate-y-1">
              <Calendar className="w-5 h-5" /> Ver Calendario Completo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
