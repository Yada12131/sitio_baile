import Database from 'better-sqlite3';
import path from 'path';
import os from 'os';

let dbInstance: any = null;

export const getDb = () => {
  if (dbInstance) return dbInstance;

  try {
    let dbPath;
    let options = {};

    if (process.env.NODE_ENV === 'production') {
      // In Netlify/Lambda, /tmp is the only writable path
      dbPath = path.join(os.tmpdir(), 'dance_club.db');
      console.log(`Initializing Production DB at ${dbPath}`);
    } else {
      dbPath = path.join(process.cwd(), 'dance_club.db');
      console.log(`Initializing Local DB at ${dbPath}`);
    }

    try {
      dbInstance = new Database(dbPath);
      dbInstance.pragma('journal_mode = WAL');
    } catch (fsError) {
      console.warn("Failed to create file-based DB, falling back to IN-MEMORY database. Data will not persist.", fsError);
      dbInstance = new Database(':memory:');
    }

    initDb(dbInstance);
    return dbInstance;
  } catch (error) {
    console.error("CRITICAL DATABASE ERROR:", error);
    // Ultimate fallback to prevent crash
    dbInstance = new Database(':memory:');
    initDb(dbInstance);
    return dbInstance;
  }
};

// Initialize database tables
const initDb = (db: any) => {
  // Events Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Contact Messages Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Satisfaction Feedback Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rating INTEGER NOT NULL,
      comments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Classes Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      instructor TEXT NOT NULL,
      schedule TEXT NOT NULL,
      capacity INTEGER DEFAULT 20,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Registrations Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      student_name TEXT NOT NULL,
      student_email TEXT NOT NULL,
      student_phone TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Settings Table for Brand & Content
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);



  // Migrations for new fields (safely ignore if they exist)
  try {
    db.prepare("ALTER TABLE messages ADD COLUMN phone TEXT").run();
  } catch (error) {
    // Column already exists or other safe error
  }

  try {
    db.prepare("ALTER TABLE feedback ADD COLUMN name TEXT").run();
  } catch (error) {
    // Column already exists
  }
  // Services Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price TEXT,
      category TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Team Members Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      description TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  seedData(db);
};

const seedData = (db: any) => {
  try {
    // Check if services table is empty
    const serviceCount = (db.prepare('SELECT COUNT(*) as count FROM services').get() as any).count;

    if (serviceCount === 0) {
      console.log('Seeding Services...');
      const insertService = db.prepare('INSERT INTO services (title, description, price, category, image) VALUES (?, ?, ?, ?, ?)');

      // Montajes
      insertService.run('Montajes Coreográficos (15 Años y Bodas)', 'Creamos montajes personalizados para celebraciones especiales. Acompañamos a los protagonistas en todo el proceso coreográfico.', '$500.000 COP', 'Eventos', '/images/extracted/550422d082b7427f47bc866b65fe09d2_p8_i0.png');
      insertService.run('Montaje de Cumpleaños con Bailarines', 'Show estilo carnaval (12 min) con festejado y 2 bailarines profesionales. Animación conjunta e integración con invitados.', '$1.000.000 COP', 'Eventos', '/images/extracted/550422d082b7427f47bc866b65fe09d2_p9_i0.png');

      // Shows
      insertService.run('Show de Baile Deportivo (Clásico)', 'Presentaciones de alto impacto: rumba, bolero, chachachá, samba y jive. Ideal para eventos culturales y empresariales.', '$350.000 COP', 'Shows', '/images/extracted/550422d082b7427f47bc866b65fe09d2_p10_i0.png');
      insertService.run('Show de Baile Deportivo (Homenaje)', 'Incluye cierre especial dedicado al cumpleañer@ con interpretación escénica.', '$450.000 COP', 'Shows', '/images/extracted/550422d082b7427f47bc866b65fe09d2_p10_i0.png'); // Reusing image if specific not found
      insertService.run('Show de Bailes Tradicionales', 'Recorrido por porro, bachata, salsa, tango y folclor colombiano. Resalta la diversidad cultural.', '$350.000 COP', 'Shows', '/images/extracted/550422d082b7427f47bc866b65fe09d2_p11_i0.png');
      insertService.run('Homenaje Especial con Baruc', 'Presentación dancística protagonizada por Baruc, nuestro perro de terapia. Mensaje simbólico de amor y gratitud.', '$650.000 COP', 'Shows', '/images/extracted/550422d082b7427f47bc866b65fe09d2_p12_i0.png');

      // Multimedia
      insertService.run('Fotografía Básico', 'Cubrimiento de 2-3 horas. Entrega de ~50 fotos digitales. Ideal para ceremonias o brindis.', '$350.000 COP', 'Multimedia', '/images/extracted/550422d082b7427f47bc866b65fe09d2_p14_i0.png');
      insertService.run('Fotografía Estándar', 'Cubrimiento de 4-5 horas. Entrega de ~100 fotos digitales. Desde la llegada hasta la celebración.', '$500.000 COP', 'Multimedia', '/images/extracted/550422d082b7427f47bc866b65fe09d2_p14_i0.png');
      insertService.run('Fotografía Completo', 'Cubrimiento de 6-8 horas. Entrega de ~150 fotos digitales. Evento de principio a fin.', '$750.000 COP', 'Multimedia', '/images/extracted/550422d082b7427f47bc866b65fe09d2_p14_i0.png');
      insertService.run('Video Documental', 'Pieza audiovisual íntima con entrevistas y voz en off. Cuenta la historia emocional del evento.', '$250.000 COP', 'Multimedia', '/images/extracted/550422d082b7427f47bc866b65fe09d2_p15_i0.png');
    }

    // Check if team is empty (or force update/check logic? better to check empty for safe seed)
    const teamCount = (db.prepare('SELECT COUNT(*) as count FROM team_members').get() as any).count;
    if (teamCount === 0) {
      console.log('Seeding Team...');
      const insertTeam = db.prepare('INSERT INTO team_members (name, role, description, image) VALUES (?, ?, ?, ?)');

      insertTeam.run('Elizabeth Laverde Ospina', 'Presidenta • Psicóloga • Entrenadora', 'Acompaño procesos psicológicos y entreno. Ganadora de bronce en primera competencia federada. Entrenadora canina.', '/images/extracted/a6482e6edc5f43c965b01c8c14f1dfae_p3_i0.png');
      insertTeam.run('David Stiven Rúa', 'Coordinador Deportivo', 'Licenciado en Ed. Física, profesor de natación y bailes tropicales. Apasionado por transformar vidas a través del baile.', '/images/extracted/a6482e6edc5f43c965b01c8c14f1dfae_p4_i0.png');
      insertTeam.run('Estefania Giraldo Velez', 'Deportista • Artista', 'Deportista, artista plástica, fotógrafa y tatuadora. Medalla de plata en competencia nacional en Bogotá.', '/images/extracted/a6482e6edc5f43c965b01c8c14f1dfae_p5_i0.png');
      insertTeam.run('Andrés Narváez Gómez', 'Entrenador • Coach PNL', 'Coach en PNL. Enfocado en el equilibrio espiritual, mental y físico. Acompañamiento social y desarrollo integral.', '/images/extracted/a6482e6edc5f43c965b01c8c14f1dfae_p6_i0.png');
      insertTeam.run('Baruc', 'Perro de Terapia', 'Labrador Chocolate de 3 años. Ayuda a reducir el estrés y mejora el ánimo. Experto en dar amor y compañía.', '/images/extracted/a6482e6edc5f43c965b01c8c14f1dfae_p7_i0.png');
    }

    // Initial check for settings/events to ensure base items exist
    const eventCount = (db.prepare('SELECT COUNT(*) as count FROM events').get() as any).count;
    if (eventCount === 0) {
      // ... existing event seeding ...
      const insertEvent = db.prepare('INSERT INTO events (title, description, date, image) VALUES (?, ?, ?, ?)');
      insertEvent.run('Noche de Salsa', 'Ven a disfrutar de la mejor salsa de la ciudad con DJ Invitado.', '2023-11-25', '/hero-bg.jpg');

      const insertClass = db.prepare('INSERT INTO classes (name, instructor, schedule, capacity) VALUES (?, ?, ?, ?)');
      insertClass.run('Salsa Principiantes', 'Mateo H.', 'Lunes y Miércoles 7:00 PM', 20);

      const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
      insertSetting.run('siteName', 'Club Deportivo Ritmos');
      insertSetting.run('heroTitle', 'Somos Dancesport');
      insertSetting.run('heroSubtitle', 'Transformación social y personal a través del baile deportivo.');
      insertSetting.run('aboutTitle', '¿Quiénes Somos?');
      insertSetting.run('aboutDescription', 'El Club Deportivo Ritmos nace el 14 de enero de 2019 con el respaldo del INDER de Medellín. Promovemos el baile deportivo como un deporte olímpico y una herramienta de transformación social.');
    }

    // Always ensure "About" text is up to date with new PDF content if it was the default
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('aboutTitle', '¿Quiénes Somos?')").run();
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('aboutDescription', 'El Club Deportivo Ritmos nace el 14 de enero de 2019 con el respaldo del INDER de Medellín. Promovemos el baile deportivo como un deporte olímpico y una herramienta de transformación social. Nos mueven valores como la disciplina, la resiliencia y el sentido de pertenencia.')").run();

  } catch (err) {
    console.warn("Seeding failed (might be read-only DB in some contexts):", err);
  }
};



