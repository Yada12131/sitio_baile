import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
// ...
                <div className="flex justify-center space-x-6 mb-8">
                    {settingsObj.facebookUrl && (
                        <a href={settingsObj.facebookUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-80" style={{ color: 'var(--body-color)', ':hover': { color: 'var(--primary-color)' } } as any}>
                            <Facebook className="hover:text-[var(--primary-color)]" />
                        </a>
                    )}
                    {settingsObj.instagramUrl && (
                        <a href={settingsObj.instagramUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-80">
                            <Instagram className="hover:text-[var(--primary-color)]" />
                        </a>
                    )}
                    {settingsObj.tiktokUrl && (
                        <a href={settingsObj.tiktokUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-80">
                            <span className="font-bold hover:text-[var(--primary-color)]">TikTok</span>
                        </a>
                    )}
                    {settingsObj.youtubeUrl && (
                        <a href={settingsObj.youtubeUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-80">
                            <Youtube className="hover:text-[var(--primary-color)]" />
                        </a>
                    )}
                </div>

                <p className="mb-4">&copy; {new Date().getFullYear()} {settingsObj.siteName || 'Elite Dance Club'}. Todos los derechos reservados.</p>
                <div className="flex justify-center space-x-6 text-sm">
                    <a href="/privacy" className="hover:text-white transition-colors">Privacidad</a>
                    <a href="/terms" className="hover:text-white transition-colors">Términos</a>
                    {/* <a href="/admin/login" className="hover:text-white transition-colors">Admin Login</a> */}
                </div>
            </div >
        </footer >
    );
}
