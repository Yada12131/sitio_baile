import Database from 'better-sqlite3';
import path from 'path';
import os from 'os';

let dbInstance: any = null;

export const getDb = () => {
  if (dbInstance) return dbInstance;

  try {
    const dbPath = process.env.NODE_ENV === 'production'
      ? path.join(os.tmpdir(), 'dance_club.db')
      : path.join(process.cwd(), 'dance_club.db');

    console.log(`Initializing DB at ${dbPath}`);
    dbInstance = new Database(dbPath);
    dbInstance.pragma('journal_mode = WAL');

    initDb(dbInstance);
    return dbInstance;
  } catch (error) {
    console.error("FAILED TO INITIALIZE DATABASE:", error);
    throw error;
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

  seedData(db);

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
};

const seedData = (db: any) => {
  try {
    const eventCount = (db.prepare('SELECT COUNT(*) as count FROM events').get() as any).count;
    if (eventCount === 0) {
      console.log('Seeding data...');
      const insertEvent = db.prepare('INSERT INTO events (title, description, date, image) VALUES (?, ?, ?, ?)');
      insertEvent.run('Noche de Salsa', 'Ven a disfrutar de la mejor salsa de la ciudad con DJ Invitado.', '2023-11-25', '/hero-bg.jpg');
      insertEvent.run('Bachata Sensual', 'Clase abierta y baile social toda la noche.', '2023-11-30', '/hero-bg.jpg');
      insertEvent.run('Fiesta de Neon', 'Vístete de colores brillantes y brilla en la pista.', '2023-12-05', '/hero-bg.jpg');

      const insertClass = db.prepare('INSERT INTO classes (name, instructor, schedule, capacity) VALUES (?, ?, ?, ?)');
      insertClass.run('Salsa Principiantes', 'Mateo H.', 'Lunes y Miércoles 7:00 PM', 20);
      insertClass.run('Bachata Intermedio', 'Elena R.', 'Martes y Jueves 8:00 PM', 15);
      insertClass.run('Kizomba Basics', 'Carlos D.', 'Viernes 6:00 PM', 10);

      /* 
      // Test Data Removed for Production
      const insertMsg = db.prepare('INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)');
      insertMsg.run('Ana García', 'ana@test.com', 'Información de precios', 'Hola, me gustaría saber los precios del VIP.');
      insertMsg.run('Luis Diaz', 'luis@test.com', 'Clases privadas', '¿Ofrecen clases particulares para parejas?');

      const insertFeedback = db.prepare('INSERT INTO feedback (rating, comments) VALUES (?, ?)');
      insertFeedback.run(5, '¡El mejor ambiente de la ciudad!');
      insertFeedback.run(4, 'Buena música, pero un poco lleno.');
      */

      // Default Settings
      const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
      insertSetting.run('siteName', 'Elite Dance Club');
      insertSetting.run('heroTitle', 'Siente el Ritmo');
      insertSetting.run('heroSubtitle', 'El club de baile más exclusivo de la ciudad. Momentos inolvidables te esperan.');
      insertSetting.run('primaryColor', '#ec4899'); // pink-500
      insertSetting.run('accentColor', '#a855f7');  // purple-500
    }

    // Ensure all settings exist (even if events already exist)
    const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');

    // Brand
    insertSetting.run('siteName', 'Elite Dance Club');
    insertSetting.run('heroTitle', 'Siente el Ritmo');
    insertSetting.run('heroSubtitle', 'El club de baile más exclusivo de la ciudad. Momentos inolvidables te esperan.');
    insertSetting.run('primaryColor', '#ec4899');
    insertSetting.run('accentColor', '#a855f7');

    // Highlights
    insertSetting.run('highlight1Title', 'Sonido Envolvente');
    insertSetting.run('highlight1Desc', 'Sistema de audio de alta fidelidad que te hará sentir cada beat.');
    insertSetting.run('highlight2Title', 'Experiencia VIP');
    insertSetting.run('highlight2Desc', 'Zonas exclusivas, servicio a la mesa y atención personalizada.');
    insertSetting.run('highlight3Title', 'Ambiente Único');
    insertSetting.run('highlight3Desc', 'La mejor gente, la mejor energía y noches que no terminan.');

    // About
    insertSetting.run('aboutTitle', 'Sobre Nosotros');
    insertSetting.run('aboutDescription', 'Elite Club nació en 2024 con una misión simple: redefinir la vida nocturna en la ciudad. No somos solo una discoteca, somos un destino para aquellos que buscan excelencia en música, servicio y ambiente.');

    // Contact
    insertSetting.run('contactAddress', 'Calle 123 #45-67, Zona Rosa, Ciudad');
    insertSetting.run('contactPhone', '+57 300 123 4567');
    insertSetting.run('contactEmail', 'info@eliteclub.com');

    // Socials
    insertSetting.run('facebookUrl', 'https://facebook.com');
    insertSetting.run('instagramUrl', 'https://instagram.com');
    insertSetting.run('tiktokUrl', 'https://tiktok.com');

    // Services Page
    insertSetting.run('servicesTitle', 'Nuestros Servicios');
    insertSetting.run('services1Title', 'Reserva de Mesas VIP');
    insertSetting.run('services1Desc', 'La mejor ubicación de la casa. Incluye servicio de botella premium, mesero dedicado y acceso prioritario.');
    insertSetting.run('services1Price', 'Desde $200');
    insertSetting.run('services2Title', 'Eventos Privados');
    insertSetting.run('services2Desc', 'Celebra tu cumpleaños o evento corporativo con nosotros. Alquila una zona o el club completo.');
    insertSetting.run('services2Price', 'Personalizado');
    insertSetting.run('services3Title', 'Coctelería de Autor');
    insertSetting.run('services3Desc', 'Disfruta de nuestra carta exclusiva de cócteles diseñados por mixólogos expertos.');
    insertSetting.run('services3Price', 'A la carta');

    // Events Page
    insertSetting.run('eventsTitle', 'Próximos Eventos');
    insertSetting.run('eventsSubtitle', 'Descubre las fiestas más exclusivas de la ciudad. Reserva tu lugar antes de que se agoten.');

    // Classes Page
    insertSetting.run('classesTitle', 'Clases de Baile');
    insertSetting.run('classesSubtitle', 'Aprende a bailar con los mejores instructores. Ofrecemos clases para todos los niveles, desde principiantes hasta avanzados.');

    // Feedback Page
    insertSetting.run('feedbackTitle', 'Tu Opinión Importa');
    insertSetting.run('feedbackSubtitle', 'Ayúdanos a mejorar tu experiencia en Elite Club.');
  } catch (err) {
    console.warn("Seeding failed (might be read-only DB in some contexts):", err);
  }
};



