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
        
        // Ensure all categories exist in groupedServices even if empty
        categories.forEach(cat => {
            groupedServices[cat.name] = [];
        });

        // Add 'General' if not in categories but used in services
        items.forEach((item: any) => {
            const category = item.category || 'General';
            if (!groupedServices[category]) {
                groupedServices[category] = [];
            }
            groupedServices[category].push(item);
        });

        const affiliateServices = groupedServices['Afiliados'] || [];
        const otherCategories = Object.keys(groupedServices).filter(cat => cat !== 'Afiliados' && groupedServices[cat].length > 0);

        return (
            <div className="min-h-screen bg-black text-white pt-24 pb-20">
                <div className="container mx-auto px-4 mb-16 text-center">
                    <h1
                        className="text-5xl md:text-7xl font-black mb-6 tracking-tight inline-block"
                        style={{
                            backgroundImage: 'linear-gradient(to right, var(--primary-color), var(--accent-color))',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        {servicesTitle}
                    </h1>
                </div>

                {otherCategories.map((category) => (
                    <section key={category} className="mb-24">
                        <div className="container mx-auto px-4 mb-10">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 uppercase tracking-tighter">
                                {category}
                            </h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                        </div>
                        <ServicesList items={groupedServices[category]} servicesTitle="" hideHeader />
                    </section>
                ))}

                {affiliateServices.length > 0 && (
                    <section id="afiliados" className="mt-20 border-t border-white/10 pt-20">
                        <div className="container mx-auto px-4 mb-10">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 uppercase tracking-tighter">
                                Descuentos para Afiliados
                            </h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                        </div>
                        <ServicesList items={affiliateServices} servicesTitle="" hideHeader />
                    </section>
                )}
                
                {items.length === 0 && (
                    <div className="container mx-auto px-4 text-center py-20 bg-zinc-900/40 rounded-2xl border border-white/10">
                        <p className="text-xl text-gray-400">No hay servicios disponibles en este momento.</p>
                    </div>
                )}
            </div>
        );
    } catch (err) {
        console.error("Critical Error loading Services:", err);
        return <div className="min-h-screen bg-black text-white pt-32 text-center">Error cargando servicios.</div>;
    }
}
