const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'dance_club.db');
const dbShm = path.join(process.cwd(), 'dance_club.db-shm');
const dbWal = path.join(process.cwd(), 'dance_club.db-wal');

[dbPath, dbShm, dbWal].forEach(file => {
    if (fs.existsSync(file)) {
        try {
            fs.unlinkSync(file);
            console.log(`Deleted ${file}`);
        } catch (e) {
            console.error(`Error deleting ${file}:`, e.message);
        }
    }
});
