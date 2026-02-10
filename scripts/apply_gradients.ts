
import { run } from '../lib/db';

async function applyGradients() {
    try {
        console.log('Applying Premium Gradients...');

        // Reset Primary/Accent
        await run("INSERT INTO settings (key, value) VALUES ('primaryColor', '#ec4899') ON CONFLICT(key) DO UPDATE SET value = '#ec4899'");
        await run("INSERT INTO settings (key, value) VALUES ('accentColor', '#a855f7') ON CONFLICT(key) DO UPDATE SET value = '#a855f7'");

        // Set Navbar to a subtle vertical gradient (black to transparent black) or horizontal with tint
        // User wanted "bonitos y como en degradado".
        // Let's try a "Glass" gradient: Black with a touch of purple at the end.
        const gradient = "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(20,0,10,0.95) 50%, rgba(40,0,30,0.9) 100%)";
        await run("INSERT INTO settings (key, value) VALUES ('navbarBgColor', $1) ON CONFLICT(key) DO UPDATE SET value = $1", [gradient]);

        // Ensure Text is White
        await run("INSERT INTO settings (key, value) VALUES ('navbarTextColor', '#ffffff') ON CONFLICT(key) DO UPDATE SET value = '#ffffff'");

        console.log('Gradients Applied!');
    } catch (e) {
        console.error(e);
    }
}

applyGradients();
