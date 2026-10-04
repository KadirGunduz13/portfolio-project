import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    // Sol menüde görünecek bağlantılar ve ikonlar
    // Sol menüde görünecek bağlantılar ve ikonlar
    const menuItems = [
        { path: '/admin/about', name: 'Hakkımda', icon: 'person' },
        { path: '/admin/projects', name: 'Projeler', icon: 'terminal' },
        { path: '/admin/experiences', name: 'Deneyimler', icon: 'work' },
        { path: '/admin/skills', name: 'Yetenekler', icon: 'code' }, // YENİ EKLENDİ
        { path: '/admin/educations', name: 'Eğitimler', icon: 'school' },
        { path: '/admin/certificates', name: 'Sertifikalar', icon: 'verified' },
        { path: '/admin/languages', name: 'Diller', icon: 'translate' }, // YENİ EKLENDİ
    ];

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">

            {/* ================= SOL MENÜ (SIDEBAR) ================= */}
            <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-low/90 backdrop-blur-xl z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col flex-1 overflow-y-auto">
                    {/* Logo ve Marka */}
                    <div className="h-16 flex items-center justify-between px-space-lg">
                        <div className="flex items-center gap-space-sm">
                            {/* Geçici Logo Kutusu */}
                            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-on-primary font-display font-bold text-lg">
                                K
                            </div>
                            <div className="flex flex-col">
                                <span className="font-headline-sm text-headline-sm text-on-surface leading-tight">Portfolyo</span>
                                <span className="font-label-tech text-label-tech text-outline tracking-wider uppercase">Yönetici Paneli</span>
                            </div>
                        </div>
                        <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-tertiary font-label-tech text-label-tech">v1.4.2</span>
                    </div>

                    <div className="px-space-lg py-space-sm">
                        <div className="h-px w-full bg-surface-container-highest"></div>
                    </div>

                    <div className="px-space-md py-space-xs">
                        <span className="px-space-sm font-label-tech text-label-tech uppercase tracking-widest text-outline">Modüller</span>
                    </div>

                    {/* Menü Linkleri */}
                    <nav className="flex flex-col gap-1 px-space-md mt-space-xs">
                        {menuItems.map((item) => {
                            const isActive = location.pathname.includes(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-space-md px-space-md py-2.5 rounded-lg transition-all ${
                                        isActive
                                            ? 'bg-primary-container text-on-primary-container font-label-md text-label-md shadow-[0_0_20px_rgba(77,142,255,0.35)]'
                                            : 'font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="px-space-lg py-space-sm">
                        <div className="h-px w-full bg-surface-container-highest"></div>
                    </div>

                    {/* Canlı Siteye Git Butonu */}
                    <div className="px-space-md">
                        <Link to="/" target="_blank" className="flex items-center justify-between px-space-md py-2 rounded-lg font-label-sm text-label-sm text-outline hover:bg-surface-container-high hover:text-on-surface transition-colors">
                            <div className="flex items-center gap-space-sm">
                                <span className="material-symbols-outlined text-lg">open_in_new</span>
                                <span>Canlı Siteyi Gör</span>
                            </div>
                            <span className="font-label-tech text-label-tech text-secondary">AKTİF</span>
                        </Link>
                    </div>
                </div>

                {/* Kullanıcı Profili ve Çıkış */}
                <div className="p-space-md bg-surface-container-lowest/60">
                    <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container/60">
                        <div className="flex items-center gap-space-sm">
                            <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-on-surface">
                                <span className="material-symbols-outlined text-sm">person</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-label-md text-label-md text-on-surface leading-tight">Kadir Gündüz</span>
                                <span className="font-label-tech text-label-tech text-outline">Sistem Yöneticisi</span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-surface-container-high transition-colors flex items-center justify-center"
                            title="Çıkış Yap"
                        >
                            <span className="material-symbols-outlined text-xl">logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* ================= SAĞ İÇERİK ALANI (MAIN CONTENT WRAPPER) ================= */}
            <div className="pl-72">

                {/* ÜST BİLGİ ÇUBUĞU (HEADER) */}
                <header className="fixed top-0 left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl z-40 flex items-center justify-between px-space-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-space-md">
                        <div className="flex items-center gap-space-xs font-code-inline text-code-inline text-outline">
                            <span className="text-outline">workspace</span>
                            <span className="text-outline-variant">/</span>
                            <span className="text-primary font-medium">portfolio-core</span>
                            <span className="text-outline-variant">/</span>
                            <span className="text-on-surface font-medium">aktif</span>
                        </div>
                        <div className="hidden lg:flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-tertiary-container/20 text-tertiary">
                            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                            <span className="font-label-tech text-label-tech uppercase tracking-wide">Üretim Ortamı Aktif</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-space-lg">
                        <div className="hidden md:flex items-center gap-space-sm px-space-md py-1 rounded bg-surface-container-low font-code-inline text-code-inline text-outline">
                            <span className="material-symbols-outlined text-base text-secondary">sync</span>
                            <span>Güvenle senkronize edildi</span>
                        </div>
                        <button className="relative p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center" type="button" title="Bildirimler">
                            <span className="material-symbols-outlined text-xl">notifications</span>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-container"></span>
                        </button>
                    </div>
                </header>

                {/* ALT SAYFALARIN ÇAĞRILACAĞI YER (OUTLET) */}
                <main className="relative pt-16 w-full min-h-screen bg-background">
                    <Outlet />
                </main>
            </div>

        </div>
    );
}