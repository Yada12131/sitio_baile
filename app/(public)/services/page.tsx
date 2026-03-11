import { query } from '@/lib/db';
import ServicesList from '@/components/ServicesList';

export const metadata = {
    title: 'Servicios de Baile | Club Deportivo Ritmos',
    description: 'Ofrecemos clases de baile, montajes coreográficos para 15 años y bodas, shows profesionales y mucho más en Medellín.'
};

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
    let items = [];
    let settings: any[] = [];
    let servicesTitle = 'Nuestros Servicios';

    try {
        const settingsRes = await query('SELECT * FROM settings');
        settings = settingsRes.rows;

        servicesTitle = settings.find((s: any) => s.key === 'servicesTitle')?.value || 'Nuestros Servicios';

        const itemsRes = await query('SELECT * FROM services ORDER BY created_at DESC');
        items = itemsRes.rows;

        const categoriesRes = await query('SELECT * FROM service_categories ORDER BY name ASC');
        const categories = categoriesRes.rows;

        // Group services by category
        const groupedServices: { [key: string]: any[] } = {};
        
        // Ensure all categories from DB exist in groupedServices
        categories.forEach(cat => {
            groupedServices[cat.name] = [];
        });

        // Add services to their categories, normalizing names
        items.forEach((item: any) => {
            const categoryName = item.category?.trim() || 'General';
            if (!groupedServices[categoryName]) {
                groupedServices[categoryName] = [];
            }
            groupedServices[categoryName].push(item);
        });

        const affiliateServices = (groupedServices['Afiliados'] || []).concat(groupedServices['Descuentos para Afiliados'] || []);
        const otherCategories = Object.keys(groupedServices)
            .filter(cat => cat !== 'Afiliados' && cat !== 'Descuentos para Afiliados' && groupedServices[cat].length > 0)
            .sort();

        return (
            <div className="min-h-screen bg-black text-white pt-24 pb-20">
                <div className="container mx-auto px-4 mb-20 text-center">
                    <h1
                        className="text-6xl md:text-8xl font-black mb-8 tracking-tighter inline-block"
                        style={{
                            backgroundImage: 'linear-gradient(to right, var(--primary-color), var(--accent-color))',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        {servicesTitle}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Explora nuestra amplia gama de servicios diseñados para llevar tu talento al siguiente nivel.
                    </p>
                </div>

                {otherCategories.map((category) => (
                    <section key={category} className="mb-32">
                        <div className="container mx-auto px-4 mb-12">
                            <div className="flex items-center gap-6 mb-4">
                                <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
                                    {category}
                                </h2>
                                <div className="h-px flex-grow bg-white/10"></div>
                            </div>
                            <div className="h-1.5 w-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                        </div>
                        <ServicesList items={groupedServices[category]} servicesTitle="" hideHeader />
                    </section>
                ))}

                {affiliateServices.length > 0 && (
                    <section id="afiliados" className="mt-20 border-t border-white/20 pt-32 mb-20">
                        <div className="container mx-auto px-4 mb-12">
                            <h2 className="text-5xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter text-center">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                                    Descuentos para Afiliados
                                </span>
                            </h2>
                            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-10">
                                Beneficios exclusivos para los miembros de nuestra comunidad.
                            </p>
                            <div className="h-1.5 w-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
                        </div>
                        <ServicesList items={affiliateServices} servicesTitle="" hideHeader />
                    </section>
                )}
                
                {items.length === 0 && (
                    <div className="container mx-auto px-4 text-center py-32 bg-zinc-900/40 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <p className="text-2xl text-gray-400 font-medium">No hay servicios disponibles en este momento.</p>
                        <p className="text-gray-500 mt-4">Vuelve pronto para ver nuestras novedades.</p>
                    </div>
                )}
            </div>
        );
    } catch (err) {
        console.error("Critical Error loading Services:", err);
        return <div className="min-h-screen bg-black text-white pt-32 text-center">Error cargando servicios.</div>;
    }
}
