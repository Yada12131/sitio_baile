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

    return <ServicesList items={items} servicesTitle={servicesTitle} />;
}
