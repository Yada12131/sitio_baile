
import { query } from '../lib/db';

async function updateLogo() {
    try {
        console.log('Current Settings:');
        const resBefore = await query("SELECT * FROM settings WHERE key = 'logoHeight'");
        console.log(resBefore.rows);

        console.log('Updating logoHeight to 150...');
        await query("INSERT INTO settings (key, value) VALUES ('logoHeight', '150') ON CONFLICT(key) DO UPDATE SET value = '150'");

        const resAfter = await query("SELECT * FROM settings WHERE key = 'logoHeight'");
        console.log('New Settings:', resAfter.rows);
    } catch (e) {
        console.error(e);
    }
}

updateLogo();
