const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        const sqlPath = path.join(__dirname, 'setup_db.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log('Running SQL setup...');
        await pool.query(sql);
        console.log('Setup completed successfully.');
    } catch (err) {
        console.error('Error running setup:', err);
    } finally {
        await pool.end();
    }
}

run();
