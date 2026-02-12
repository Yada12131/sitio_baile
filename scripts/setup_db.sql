CREATE TABLE IF NOT EXISTS form_fields (
    id SERIAL PRIMARY KEY,
    form_type VARCHAR(50) NOT NULL DEFAULT 'affiliate',
    label VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    required BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    options TEXT
);

CREATE TABLE IF NOT EXISTS service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO service_categories (name, slug) VALUES 
('Eventos', 'eventos'),
('Shows', 'shows'),
('Multimedia', 'multimedia'),
('Clases', 'clases'),
('Otros', 'otros'),
('Afiliados', 'afiliados')
ON CONFLICT (name) DO NOTHING;
