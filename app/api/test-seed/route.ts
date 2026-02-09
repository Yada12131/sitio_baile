import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({
                error: 'Configuration Error',
                message: 'DATABASE_URL environment variable is MISSING on the server.',
                solution: 'Go to Netlify Site Settings > Environment Variables and add DATABASE_URL.'
            }, { status: 500 });
        }

        // Force re-run initDb which calls seedData
        await initDb();

        // Let's also verify what's in there
        let servicesCount = 0;
        let settingsCount = 0;
        let teamCount = 0;

        try {
            const services = await query('SELECT count(*) FROM services');
            if (services.rows && services.rows[0]) servicesCount = parseInt(services.rows[0].count);

            const settings = await query('SELECT count(*) FROM settings');
            if (settings.rows && settings.rows[0]) settingsCount = parseInt(settings.rows[0].count);

            // Force Seed Team if empty
            const teamCheck = await query('SELECT count(*) FROM team_members');
            if (teamCheck.rows && teamCheck.rows[0]) {
                teamCount = parseInt(teamCheck.rows[0].count);
                if (teamCount === 0) {
                    console.log('Force seeding team...');
                    const team = [
                        { name: 'David Ospina', role: 'Director General e Instructor', description: 'Especialista en Salsa Casino y Bailes Populares. Con más de 10 años de experiencia formando bailarines.', image: '/images/team/david.jpg' },
                        { name: 'Laura Martínez', role: 'Instructora de Bachata', description: 'Apasionada por la Bachata Sensual y la expresión corporal. Enfocada en la técnica y la conexión.', image: '/images/team/laura.jpg' },
                        { name: 'Carlos Ruiz', role: 'Instructor de Porro', description: 'Experto en folclore colombiano y ritmos tropicales. Transmite la alegría del baile tradicional.', image: '/images/team/carlos.jpg' },
                        { name: 'Ana María', role: 'Instructora de Técnica', description: 'Formación en ballet y danza contemporánea. Ayuda a los alumnos a mejorar su postura y elegancia.', image: '/images/team/ana.jpg' },
                        { name: 'Roberto', role: 'Maestro de Tango', description: 'Elegancia y pasión en cada paso. Experto en Tango Argentino y Milonga.', image: '/images/team/roberto.jpg' }
                    ];
                    for (const t of team) {
                        await query('INSERT INTO team_members (name, role, description, image) VALUES ($1, $2, $3, $4)', [t.name, t.role, t.description, t.image]);
                    }
                    teamCount = team.length; // Update count for display
                }
            }
        } catch (dbErr: any) {
            return NextResponse.json({ error: 'Database Query Failed', details: dbErr.message }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Database initialization attempted.',
            stats: {
                services: servicesCount,
                settings: settingsCount,
                team: teamCount
            }
        });
    } catch (e: any) {
        return NextResponse.json({
            error: 'Failed to seed',
            details: e.message,
            stack: e.stack
        }, { status: 500 });
    }
}
