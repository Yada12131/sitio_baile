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
    } catch (err) {
        console.error("Critical Error loading Services:", err);
        items = [];
    }

    const affiliateServices = items.filter((item: any) => item.category === 'Afiliados');
    const generalServices = items.filter((item: any) => item.category !== 'Afiliados');

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            {/* General Services Section */}
            <ServicesList items={generalServices} servicesTitle={servicesTitle} />

            {/* Affiliates Section - Only show if there are affiliate items */}
            {affiliateServices.length > 0 && (
                <div className="mt-20 border-t border-white/10 pt-20">
                    <ServicesList
                        items={affiliateServices}
                        servicesTitle="Descuentos para Afiliados"
                    />
                </div>
            )}
        </div>
    );
}
