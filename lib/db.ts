import path from 'path';
import os from 'os';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */

let dbInstance: any = null;

// Mock Data for Fallback (Serverless/Build environments where sqlite fails)
const MOCK_DATA: any = {
    services: [
        { id: 1, title: 'Montajes Coreográficos (15 Años y Bodas)', description: 'Creamos montajes personalizados para celebraciones especiales. Acompañamos a los protagonistas en todo el proceso coreográfico.', price: '$500.000 COP', category: 'Eventos', image: '/images/extracted/550422d082b7427f47bc866b65fe09d2_p8_i0.png', created_at: new Date().toISOString() },
        { id: 2, title: 'Montaje de Cumpleaños con Bailarines', description: 'Show estilo carnaval (12 min) con festejado y 2 bailarines profesionales. Animación conjunta e integración con invitados.', price: '$1.000.000 COP', category: 'Eventos', image: '/images/extracted/550422d082b7427f47bc866b65fe09d2_p9_i0.png', created_at: new Date().toISOString() },
        { id: 3, title: 'Show de Baile Deportivo (Clásico)', description: 'Presentaciones de alto impacto: rumba, bolero, chachachá, samba y jive. Ideal para eventos culturales y empresariales.', price: '$350.000 COP', category: 'Shows', image: '/images/extracted/550422d082b7427f47bc866b65fe09d2_p10_i0.png', created_at: new Date().toISOString() },
        { id: 4, title: 'Show de Baile Deportivo (Homenaje)', description: 'Incluye cierre especial dedicado al cumpleañer@ con interpretación escénica.', price: '$450.000 COP', category: 'Shows', image: '/images/extracted/550422d082b7427f47bc866b65fe09d2_p10_i0.png', created_at: new Date().toISOString() },
        { id: 5, title: 'Show de Bailes Tradicionales', description: 'Recorrido por porro, bachata, salsa, tango y folclor colombiano. Resalta la diversidad cultural.', price: '$350.000 COP', category: 'Shows', image: '/images/extracted/550422d082b7427f47bc866b65fe09d2_p11_i0.png', created_at: new Date().toISOString() },
        { id: 6, title: 'Homenaje Especial con Baruc', description: 'Presentación dancística protagonizada por Baruc, nuestro perro de terapia. Mensaje simbólico de amor y gratitud.', price: '$650.000 COP', category: 'Shows', image: '/images/extracted/550422d082b7427f47bc866b65fe09d2_p12_i0.png', created_at: new Date().toISOString() },
        { id: 7, title: 'Fotografía Básico', description: 'Cubrimiento de 2-3 horas. Entrega de ~50 fotos digitales. Ideal para ceremonias o brindis.', price: '$350.000 COP', category: 'Multimedia', image: '/images/extracted/550422d082b7427f47bc866b65fe09d2_p14_i0.png', created_at: new Date().toISOString() },
        { id: 8, title: 'Fotografía Estándar', description: 'Cubrimiento de 4-5 horas. Entrega de ~100 fotos digitales. Desde la llegada hasta la celebración.', price: '$500.000 COP', category: 'Multimedia', image: '/images/extracted/550422d082b7427f47bc866b65fe09d2_p14_i0.png', created_at: new Date().toISOString() },
        { id: 9, title: 'Fotografía Completo', description: 'Cubrimiento de 6-8 horas. Entrega de ~150 fotos digitales. Evento de principio a fin.', price: '$750.000 COP', category: 'Multimedia', image: '/images/extracted/550422d082b7427f47bc866b65fe09d2_p14_i0.png', created_at: new Date().toISOString() },
        { id: 10, title: 'Video Documental', description: 'Pieza audiovisual íntima con entrevistas y voz en off. Cuenta la historia emocional del evento.', price: '$250.000 COP', category: 'Multimedia', image: '/images/extracted/550422d082b7427f47bc866b65fe09d2_p15_i0.png', created_at: new Date().toISOString() },
    ],
    team_members: [
        { id: 1, name: 'Elizabeth Laverde Ospina', role: 'Presidenta • Psicóloga • Entrenadora', description: 'Acompaño procesos psicológicos y entreno. Ganadora de bronce en primera competencia federada. Entrenadora canina.', image: '/images/extracted/a6482e6edc5f43c965b01c8c14f1dfae_p3_i0.png', created_at: new Date().toISOString() },
        { id: 2, name: 'David Stiven Rúa', role: 'Coordinador Deportivo', description: 'Licenciado en Ed. Física, profesor de natación y bailes tropicales. Apasionado por transformar vidas a través del baile.', image: '/images/extracted/a6482e6edc5f43c965b01c8c14f1dfae_p4_i0.png', created_at: new Date().toISOString() },
        { id: 3, name: 'Estefania Giraldo Velez', role: 'Deportista • Artista', description: 'Deportista, artista plástica, fotógrafa y tatuadora. Medalla de plata en competencia nacional en Bogotá.', image: '/images/extracted/a6482e6edc5f43c965b01c8c14f1dfae_p5_i0.png', created_at: new Date().toISOString() },
        { id: 4, name: 'Andrés Narváez Gómez', role: 'Entrenador • Coach PNL', description: 'Coach en PNL. Enfocado en el equilibrio espiritual, mental y físico. Acompañamiento social y desarrollo integral.', image: '/images/extracted/a6482e6edc5f43c965b01c8c14f1dfae_p6_i0.png', created_at: new Date().toISOString() },
        { id: 5, name: 'Baruc', role: 'Perro de Terapia', description: 'Labrador Chocolate de 3 años. Ayuda a reducir el estrés y mejora el ánimo. Experto en dar amor y compañía.', image: '/images/extracted/a6482e6edc5f43c965b01c8c14f1dfae_p7_i0.png', created_at: new Date().toISOString() },
    ],
    settings: [
        { key: 'siteName', value: 'Club Deportivo Ritmos' },
        { key: 'servicesTitle', value: 'Nuestros Servicios' },
        { key: 'aboutTitle', value: '¿Quiénes Somos?' },
        { key: 'aboutDescription', value: 'El Club Deportivo Ritmos nace el 14 de enero de 2019 con el respaldo del INDER de Medellín. Promovemos el baile deportivo como un deporte olímpico y una herramienta de transformación social. Nos mueven valores como la disciplina, la resiliencia y el sentido de pertenencia.' }
    ],
    events: [],
    classes: [],
    messages: [],
    feedback: [],
    registrations: []
};

class MockDB {
    prepare(query: string) {
        const q = query.toLowerCase().trim();

        return {
            all: () => {
                if (q.includes('from services')) return MOCK_DATA.services;
                if (q.includes('from team_members')) return MOCK_DATA.team_members;
                if (q.includes('from settings')) return MOCK_DATA.settings;
                if (q.includes('from events')) return MOCK_DATA.events;
                if (q.includes('from classes')) return MOCK_DATA.classes;
                if (q.includes('from messages')) return MOCK_DATA.messages;
                if (q.includes('from feedback')) return MOCK_DATA.feedback;
                if (q.includes('from registrations')) return MOCK_DATA.registrations;
                return [];
            },
            get: () => {
                if (q.includes('count(*) as count from team_members')) return { count: MOCK_DATA.team_members.length };
                if (q.includes('count(*) as count from services')) return { count: MOCK_DATA.services.length };
                if (q.includes('count(*) as count from events')) return { count: MOCK_DATA.events.length };
                if (q.includes('count(*) as count from classes')) return { count: MOCK_DATA.classes.length };
                if (q.includes('count(*) as count from messages')) return { count: MOCK_DATA.messages.length };
                if (q.includes('count(*) as count from registrations')) return { count: MOCK_DATA.registrations.length };
                if (q.includes('avg(rating) as avg from feedback')) {
                    const total = MOCK_DATA.feedback.reduce((sum: number, f: any) => sum + f.rating, 0);
                    return { avg: MOCK_DATA.feedback.length ? total / MOCK_DATA.feedback.length : 0 };
                }
                return null;
            },
            run: (...args: any[]) => {
                console.log('Mock DB run:', query, args);

                // HELPERS
                const getNewId = (arr: any[]) => (arr.length > 0 ? Math.max(...arr.map(m => m.id)) + 1 : 1);
                const updateItem = (arr: any[], id: number, newData: any) => {
                    const idx = arr.findIndex(i => i.id === id);
                    if (idx !== -1) arr[idx] = { ...arr[idx], ...newData };
                };
                const deleteItem = (arr: any[], id: number) => {
                    const idx = arr.findIndex(i => i.id === id);
                    if (idx !== -1) arr.splice(idx, 1);
                };

                // TEAM MEMBERS
                if (q.startsWith('update team_members')) {
                    updateItem(MOCK_DATA.team_members, args[args.length - 1], { name: args[0], role: args[1], description: args[2], image: args[3] });
                }
                if (q.startsWith('insert into team_members')) {
                    const id = getNewId(MOCK_DATA.team_members);
                    MOCK_DATA.team_members.push({ id, name: args[0], role: args[1], description: args[2], image: args[3], created_at: new Date().toISOString() });
                    return { changes: 1, lastInsertRowid: id };
                }

                // SERVICES
                if (q.startsWith('update services')) {
                    updateItem(MOCK_DATA.services, args[args.length - 1], { title: args[0], description: args[1], price: args[2], category: args[3], image: args[4] });
                }
                if (q.startsWith('insert into services')) {
                    const id = getNewId(MOCK_DATA.services);
                    MOCK_DATA.services.push({ id, title: args[0], description: args[1], price: args[2], category: args[3], image: args[4], created_at: new Date().toISOString() });
                    return { changes: 1, lastInsertRowid: id };
                }
                if (q.startsWith('delete from services')) {
                    deleteItem(MOCK_DATA.services, args[0]);
                }

                // EVENTS
                if (q.startsWith('update events')) {
                    updateItem(MOCK_DATA.events, args[args.length - 1], { title: args[0], description: args[1], date: args[2], image: args[3] });
                }
                if (q.startsWith('insert into events')) {
                    const id = getNewId(MOCK_DATA.events);
                    MOCK_DATA.events.push({ id, title: args[0], description: args[1], date: args[2], image: args[3], created_at: new Date().toISOString() });
                    return { changes: 1, lastInsertRowid: id };
                }
                if (q.startsWith('delete from events')) {
                    deleteItem(MOCK_DATA.events, args[0]);
                }

                // CLASSES
                if (q.startsWith('update classes')) {
                    updateItem(MOCK_DATA.classes, args[args.length - 1], { name: args[0], instructor: args[1], schedule: args[2], capacity: args[3] });
                }
                if (q.startsWith('insert into classes')) {
                    const id = getNewId(MOCK_DATA.classes);
                    MOCK_DATA.classes.push({ id, name: args[0], instructor: args[1], schedule: args[2], capacity: args[3], created_at: new Date().toISOString() });
                    return { changes: 1, lastInsertRowid: id };
                }
                if (q.startsWith('delete from classes')) {
                    deleteItem(MOCK_DATA.classes, args[0]);
                }

                return { changes: 1, lastInsertRowid: 1 };
            }
        };
    }
    exec(query: string) { console.log('Mock DB exec', query); }
    pragma(query: string) { console.log('Mock DB pragma', query); }
}

export const getDb = () => {
    if (dbInstance) return dbInstance;

    // FORCE MOCK DB IN PRODUCTION (NETLIFY) TO AVOID SQLITE BINARY ISSUES
    if (process.env.NODE_ENV === 'production') {
        console.log('Running in PRODUCTION mode. Forcing Mock DB Adapter.');
        dbInstance = new MockDB();
        return dbInstance;
    }

    try {
        // Hide better-sqlite3 from Webpack to prevent bundling errors in production
        const glb = global as any;
        const Database = (new Function('return require'))()('better-sqlite3');

        const dbPath = path.join(process.cwd(), 'dance_club.db');

        console.log(`Initializing DB at ${dbPath}`);
        // Try creating file-based DB
        try {
            dbInstance = new Database(dbPath);
            dbInstance.pragma('journal_mode = WAL');
            initDb(dbInstance);
        } catch (e) {
            console.warn('File-based DB failed, trying memory...', e);
            try {
                // fallback to memory if file creation fails (e.g. permission issues)
                dbInstance = new Database(':memory:');
                initDb(dbInstance);
            } catch (memErr) {
                console.error('Memory DB also failed (driver issue?), forcing MockDB', memErr);
                dbInstance = new MockDB();
            }
        }

        return dbInstance;
    } catch (error) {
        console.error("FAILED TO LOAD SQLITE DRIVER. Using Mock Adapter.", error);
        dbInstance = new MockDB();
        return dbInstance;
    }
};

const initDb = (db: any) => {
    if (!db.exec) return;

    try {
        console.log('Creating tables...');

        // Events Table
        db.exec(`CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT NOT NULL, date TEXT NOT NULL, image TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);

        // Contact Messages Table
        db.exec(`CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT NOT NULL, message TEXT NOT NULL, phone TEXT, read INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);

        // Satisfaction Feedback Table
        db.exec(`CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, rating INTEGER NOT NULL, comments TEXT, name TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);

        // Classes Table
        db.exec(`CREATE TABLE IF NOT EXISTS classes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, instructor TEXT NOT NULL, schedule TEXT NOT NULL, capacity INTEGER DEFAULT 20, image TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);

        // Registrations Table
        db.exec(`CREATE TABLE IF NOT EXISTS registrations (id INTEGER PRIMARY KEY AUTOINCREMENT, class_id INTEGER NOT NULL, student_name TEXT NOT NULL, student_email TEXT NOT NULL, student_phone TEXT, status TEXT DEFAULT 'pending', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);

        // Settings
        db.exec(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)`);

        // Services
        db.exec(`CREATE TABLE IF NOT EXISTS services (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT NOT NULL, price TEXT, category TEXT, image TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);

        // Team Members
        db.exec(`CREATE TABLE IF NOT EXISTS team_members (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, role TEXT NOT NULL, description TEXT, image TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);

        seedData(db);
    } catch (err: any) {
        console.error("Error creating tables:", err);
    }
};

const seedData = (db: any) => {
    try {
        const serviceCount = (db.prepare('SELECT COUNT(*) as count FROM services').get() as any).count;
        if (serviceCount === 0) {
            console.log('Seeding Services...');
            const insertService = db.prepare('INSERT INTO services (title, description, price, category, image) VALUES (?, ?, ?, ?, ?)');
            MOCK_DATA.services.forEach(s => insertService.run(s.title, s.description, s.price, s.category, s.image));
        }

        const teamCount = (db.prepare('SELECT COUNT(*) as count FROM team_members').get() as any).count;
        if (teamCount === 0) {
            console.log('Seeding Team...');
            const insertTeam = db.prepare('INSERT INTO team_members (name, role, description, image) VALUES (?, ?, ?, ?)');
            MOCK_DATA.team_members.forEach(t => insertTeam.run(t.name, t.role, t.description, t.image));
        }

        // SEED TEST CLASSES
        const classCount = (db.prepare('SELECT COUNT(*) as count FROM classes').get() as any).count;
        if (classCount === 0) {
            console.log('Seeding Test Classes...');
            const insertClass = db.prepare('INSERT INTO classes (name, instructor, schedule, capacity) VALUES (?, ?, ?, ?)');
            insertClass.run('Salsa Casino (Basico)', 'David Stiven Rúa', 'Martes y Jueves 7:00 PM', 20);
            insertClass.run('Bachata Sensual', 'Estefania Giraldo', 'Sábados 4:00 PM', 15);
        }

        // SEED TEST EVENTS
        const eventCount = (db.prepare('SELECT COUNT(*) as count FROM events').get() as any).count;
        if (eventCount === 0) {
            console.log('Seeding Test Events...');
            const insertEvent = db.prepare('INSERT INTO events (title, description, date, image) VALUES (?, ?, ?, ?)');
            // Next Saturday
            const nextSat = new Date();
            nextSat.setDate(nextSat.getDate() + (6 - nextSat.getDay() + 7) % 7);
            nextSat.setHours(20, 0, 0, 0);

            // Next Sunday
            const nextSun = new Date();
            nextSun.setDate(nextSun.getDate() + (7 - nextSun.getDay() + 7) % 7);
            nextSun.setHours(10, 0, 0, 0);

            insertEvent.run('Gran Baile Social', 'Noche de práctica y baile social para todos los niveles. Entrada libre para alumnos.', nextSat.toISOString(), '/hero-bg.jpg');
            insertEvent.run('Taller Intensivo de Rumba', 'Aprende los fundamentos de la Rumba Bolero en este taller de 3 horas.', nextSun.toISOString(), '/hero-bg.jpg');
        }

        const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
        MOCK_DATA.settings.forEach(k => insertSetting.run(k.key, k.value));

    } catch (err) {
        console.error("Seeding failed:", err);
    }
};
