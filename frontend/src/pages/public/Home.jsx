import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

export default function Home() {
    const [about, setAbout] = useState(null);
    const [projects, setProjects] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [educations, setEducations] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [volunteerActivities, setVolunteerActivities] = useState([]);

    const [galleryImages, setGalleryImages] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openGallery = (images) => {
        setGalleryImages(images);
        setCurrentImageIndex(0);
    };

    // YENİ STATE'LER (Yetenekler ve Diller için)
    const [skills, setSkills] = useState([]);
    const [languages, setLanguages] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedCertImage, setSelectedCertImage] = useState(null);
    const [activeSection, setActiveSection] = useState('about');

    // HAMBURGER MENÜ STATE'İ EKLENDİ
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'success', title: '', message: '' });

    // --- HAREKETLİ YAZI (TYPING EFFECT) STATE'LERİ ---
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);

    // Dilleri ve Hello World kodlarını barındıran dizi
    const codeSnippets = [
        { lang: "PYTHON", code: 'print("Hello World!")' },
        { lang: "JAVA", code: 'System.out.println("Hello World!");' },
        { lang: "C#", code: 'Console.WriteLine("Hello World!");' },
        { lang: "JAVASCRIPT", code: 'console.log("Hello World!");' },
        { lang: "C++", code: 'cout << "Hello World!";' },
        { lang: "C", code: 'printf("Hello World!")'}
    ];

    // O anki aktif dili seç
    const currentLanguage = codeSnippets[loopNum % codeSnippets.length].lang;

    useEffect(() => {
        const typingSpeed = 70; // Kod yazımı olduğu için biraz hızlandırdık
        const deletingSpeed = 40;
        const delayBetweenWords = 2500; // Ekranda kalma süresi

        const fullText = codeSnippets[loopNum % codeSnippets.length].code;

        const handleTyping = () => {
            setCurrentText(
                isDeleting
                    ? fullText.substring(0, currentText.length - 1)
                    : fullText.substring(0, currentText.length + 1)
            );

            if (!isDeleting && currentText === fullText) {
                setTimeout(() => setIsDeleting(true), delayBetweenWords);
            } else if (isDeleting && currentText === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
        return () => clearTimeout(timer);
    }, [currentText, isDeleting, loopNum]);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const [aboutRes, projRes, expRes, eduRes, certRes, skillsRes, langRes, volunteerRes] = await Promise.all([
                    axiosClient.get('/about'),
                    axiosClient.get('/projects'),
                    axiosClient.get('/experiences'),
                    axiosClient.get('/educations'),
                    axiosClient.get('/certificates'),
                    axiosClient.get('/skills'),
                    axiosClient.get('/languages'),
                    axiosClient.get('/volunteer-activities')
                ]);

                if (aboutRes.data) setAbout(aboutRes.data);
                if (projRes.data) setProjects(projRes.data);
                if (expRes.data) setExperiences(expRes.data);
                if (eduRes.data) setEducations(eduRes.data);
                if (certRes.data) setCertificates(certRes.data);
                if (skillsRes.data) setSkills(skillsRes.data);
                if (langRes.data) setLanguages(langRes.data);
                if (volunteerRes.data) setVolunteerActivities(volunteerRes.data);

            } catch (error) {
                console.error("Veriler çekilirken hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioData();
    }, []);

    // Scroll-Spy: Yeni bölümler listeye eklendi
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['about', 'projects', 'experience', 'volunteer', 'skills', 'education', 'certifications', 'languages', 'contact'];
            let current = 'about';

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 4) {
                        current = section;
                    }
                }
            }

            if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
                current = 'contact';
            }

            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        setTimeout(handleScroll, 100);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axiosClient.post('/contact', contactForm);
            setModalConfig({
                isOpen: true,
                type: 'success',
                title: 'Mesajınız İletildi!',
                message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağım.'
            });
            setContactForm({ name: '', email: '', message: '' });
        } catch (error) {
            if (error.response && error.response.status === 429) {
                setModalConfig({
                    isOpen: true,
                    type: 'error',
                    title: 'Gönderim Sınırı Aşıldı',
                    message: 'Spam koruması nedeniyle 24 saat içinde sadece 1 mesaj gönderebilirsiniz. Lütfen daha sonra tekrar deneyin.'
                });
            } else {
                setModalConfig({
                    isOpen: true,
                    type: 'error',
                    title: 'Gönderim Başarısız',
                    message: 'Mesajınız gönderilirken bir sunucu hatası oluştu. Lütfen doğrudan e-posta göndermeyi deneyin.'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <span className="font-label-tech text-primary tracking-widest animate-pulse">SİSTEM BAŞLATILIYOR...</span>
            </div>
        );
    }

    if (selectedCertImage || modalConfig.isOpen || isMenuOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }

    const getNavLinkClass = (section) => {
        const isActive = activeSection === section;
        return `px-3 py-2 rounded-lg transition-all font-label-md font-semibold cursor-pointer whitespace-nowrap ${
            isActive
                ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(var(--color-primary),0.4)]'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
        }`;
    };

    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        setIsMenuOpen(false); // Menüyü kapat
        if (sectionId === 'about') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const element = document.getElementById(sectionId);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden selection:bg-primary/30 selection:text-primary scroll-smooth relative">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-tertiary/5 rounded-full blur-[100px]"></div>
            </div>

            {/* --- NAVİGASYON (HEADER) - RESPONSIVE DÜZENLEME --- */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <button onClick={(e) => scrollToSection(e, 'about')} className="font-headline-sm font-bold tracking-tighter flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span className="w-8 h-8 rounded bg-primary-container text-on-primary-container flex items-center justify-center text-sm shadow-sm">
                            {about?.fullName ? about.fullName.charAt(0) : 'K'}
                        </span>
                        {about?.fullName || 'Kadir Gündüz'}
                    </button>

                    {/* MASAÜSTÜ MENÜ */}
                    <div className="hidden lg:flex items-center justify-end flex-1 gap-1 xl:gap-2">
                        <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className={getNavLinkClass('about')}>Hakkımda</a>
                        <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')} className={getNavLinkClass('projects')}>Projeler</a>
                        <a href="#experience" onClick={(e) => scrollToSection(e, 'experience')} className={getNavLinkClass('experience')}>Deneyim</a>
                        <a href="#volunteer" onClick={(e) => scrollToSection(e, 'volunteer')} className={getNavLinkClass('volunteer')}>Gönüllülük</a>
                        <a href="#skills" onClick={(e) => scrollToSection(e, 'skills')} className={getNavLinkClass('skills')}>Yetenekler</a>
                        <a href="#education" onClick={(e) => scrollToSection(e, 'education')} className={getNavLinkClass('education')}>Eğitim</a>
                        <a href="#certifications" onClick={(e) => scrollToSection(e, 'certifications')} className={getNavLinkClass('certifications')}>Sertifikalar</a>
                        <a href="#languages" onClick={(e) => scrollToSection(e, 'languages')} className={getNavLinkClass('languages')}>Diller</a>
                        <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className={getNavLinkClass('contact')}>İletişim</a>
                    </div>

                    {/* MOBİL HAMBURGER BUTONU */}
                    <button
                        className="lg:hidden p-2 text-on-surface hover:bg-surface-container rounded-md"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {isMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>

                {/* MOBİL AÇILIR MENÜ */}
                <div className={`lg:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant/10 shadow-lg transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen py-4' : 'max-h-0 py-0 border-none'}`}>
                    <div className="flex flex-col px-4 gap-2">
                        <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className={`p-3 text-center ${getNavLinkClass('about')}`}>Hakkımda</a>
                        <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')} className={`p-3 text-center ${getNavLinkClass('projects')}`}>Projeler</a>
                        <a href="#experience" onClick={(e) => scrollToSection(e, 'experience')} className={`p-3 text-center ${getNavLinkClass('experience')}`}>Deneyim</a>
                        <a href="#volunteer" onClick={(e) => scrollToSection(e, 'volunteer')} className={getNavLinkClass('volunteer')}>Gönüllülük</a>
                        <a href="#skills" onClick={(e) => scrollToSection(e, 'skills')} className={`p-3 text-center ${getNavLinkClass('skills')}`}>Yetenekler</a>
                        <a href="#education" onClick={(e) => scrollToSection(e, 'education')} className={`p-3 text-center ${getNavLinkClass('education')}`}>Eğitim</a>
                        <a href="#certifications" onClick={(e) => scrollToSection(e, 'certifications')} className={`p-3 text-center ${getNavLinkClass('certifications')}`}>Sertifikalar</a>
                        <a href="#languages" onClick={(e) => scrollToSection(e, 'languages')} className={`p-3 text-center ${getNavLinkClass('languages')}`}>Diller</a>
                        <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className={`p-3 text-center ${getNavLinkClass('contact')}`}>İletişim</a>
                    </div>
                </div>
            </nav>

            {/* --- 1. HERO (HAKKIMDA) BÖLÜMÜ - RESPONSIVE DÜZENLEME --- */}
            <main id="about" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-20 min-h-[90vh] flex items-center">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16 md:gap-12 w-full mt-10 md:mt-0">
                    <div className="flex-1 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/20 w-max">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="font-label-tech text-xs text-on-surface-variant tracking-wider uppercase">
                                {about?.title ? 'YAZILIM MÜHENDİSİ' : '2027 Mezuniyet Hedefli'}
                            </span>
                        </div>
                        <h1 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                            {about?.title ? (
                                <>
                                    {about.title.split(' ')[0]} <br className="hidden lg:block"/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary ml-1 lg:ml-0">
                                        {about.title.split(' ').slice(1).join(' ')}
                                    </span>
                                </>
                            ) : (
                                <>
                                    Yazılım <br className="hidden lg:block"/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary ml-1 lg:ml-0">
                                        Mühendisliği
                                    </span>
                                </>
                            )}
                        </h1>
                        <p className="font-body-lg text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                            {about?.bio || "Backend servisleri, yapay zeka entegrasyonları ve modern web mimarileri üzerine çalışan tutkulu bir mühendislik öğrencisi."}
                        </p>
                        <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-3 mt-4 w-full">
                            <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')} className="px-6 py-3 rounded-lg bg-primary text-on-primary font-label-md shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] transition-all w-full sm:w-auto text-center">
                                Projeleri İncele
                            </a>
                            {about?.githubUrl && (
                                <a href={about.githubUrl} target="_blank" rel="noreferrer" className="px-4 py-3 rounded-lg bg-surface-container flex items-center justify-center gap-2 text-on-surface hover:bg-surface-container-high transition-all border border-outline-variant/20 font-label-md w-full sm:w-auto">
                                    <span className="material-symbols-outlined text-[20px]">code</span>
                                    <span>GitHub</span>
                                </a>
                            )}
                            {about?.linkedinUrl && (
                                <a href={about.linkedinUrl} target="_blank" rel="noreferrer" className="px-4 py-3 rounded-lg bg-surface-container flex items-center justify-center gap-2 text-on-surface hover:bg-surface-container-high transition-all border border-outline-variant/20 font-label-md w-full sm:w-auto">
                                    <span className="material-symbols-outlined text-[20px]">work</span>
                                    <span>LinkedIn</span>
                                </a>
                            )}
                            {about?.cvUrl && (
                                <a href={about.cvUrl} target="_blank" rel="noreferrer" className="px-4 py-3 rounded-lg bg-surface-container flex items-center justify-center gap-2 text-on-surface hover:bg-surface-container-high transition-all border border-outline-variant/20 font-label-md w-full sm:w-auto" title="CV İndir">
                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                    <span>CV İndir</span>
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center relative w-full mt-16 lg:mt-0">
                        {/* Terminal Kutusunun Konumu - RESPONSIVE DÜZELTME */}
                        <div className="absolute -top-16 sm:-top-24 lg:-top-32 left-1/2 -translate-x-1/2 z-20 flex flex-col bg-[#0F172A]/90 backdrop-blur-xl border border-outline-variant/20 rounded-xl shadow-[0_10px_40px_rgba(var(--color-primary),0.2)] overflow-hidden transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 group w-[90%] sm:w-max max-w-sm sm:max-w-none">
                            {/* Terminal Üst Bar */}
                            <div className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-black/50 border-b border-outline-variant/10">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-sm"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-sm"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-sm"></div>

                                {/* DİNAMİK DİL ETİKETİ */}
                                <span className="ml-auto font-label-tech text-[9px] sm:text-[10px] text-primary tracking-widest uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20 transition-all duration-300">
                                    {currentLanguage}
                                </span>
                            </div>

                            {/* Terminal İçeriği */}
                            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="flex items-center font-label-tech text-sm sm:text-base md:text-lg flex-shrink-0">
                                    <span className="text-green-400">➜</span>
                                    <span className="text-blue-400 ml-1 sm:ml-2 font-bold">~</span>
                                </div>

                                <span className="font-label-tech text-on-surface tracking-wide text-xs sm:text-sm md:text-base text-left truncate">
                                    {currentText}
                                    <span className="inline-block w-1.5 sm:w-2 h-4 sm:h-5 bg-primary animate-[pulse_0.8s_ease-in-out_infinite] ml-1 align-middle translate-y-[-1px] sm:translate-y-[-2px] rounded-sm"></span>
                                </span>
                            </div>
                        </div>
                        <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mt-6 sm:mt-10 lg:mt-0 mx-auto">
                            <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-dashed animate-[spin_15s_linear_infinite]"></div>
                            <div className="absolute inset-[-20px] rounded-full bg-primary/10 blur-2xl z-0"></div>
                            <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-[0_0_40px_rgba(var(--color-primary),0.2)] z-10 bg-surface-container">
                                {about?.avatarUrl ? (
                                    <img src={about.avatarUrl} alt="Profil" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-outline-variant">
                                        <span className="material-symbols-outlined text-4xl sm:text-6xl">person</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- 2. PROJELER BÖLÜMÜ --- */}
            <section id="projects" className="relative z-10 w-full bg-surface-container-lowest py-16 sm:py-20 border-t border-outline-variant/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 mb-8 sm:mb-12">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl text-primary">terminal</span>
                        <h2 className="font-headline-md text-2xl sm:text-3xl font-bold">Öne Çıkan Projeler</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {projects.length === 0 ? (
                            <p className="text-outline-variant">Henüz proje eklenmedi.</p>
                        ) : (
                            projects.map((project) => (
                                <div key={project.id} className="group flex flex-col rounded-2xl bg-surface-container-low/70 backdrop-blur-md border border-outline-variant/20 overflow-hidden hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(var(--color-primary),0.15)] hover:-translate-y-1">
                                    <div className="h-40 sm:h-48 bg-surface-container-high overflow-hidden relative">
                                        {project.imageUrl ? (
                                            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-outline">Görsel Yok</div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                                    </div>
                                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                                        <h3 className="font-headline-sm text-lg sm:text-xl font-semibold mb-2">{project.title}</h3>
                                        <p className="text-on-surface-variant text-sm mb-4 line-clamp-3 flex-1">
                                            {project.description}
                                        </p>
                                        <div className="flex gap-3 mt-auto pt-4 border-t border-outline-variant/10">
                                            {project.githubUrl && (
                                                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-label-tech text-outline hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-sm">code</span> Kaynak Kod
                                                </a>
                                            )}
                                            {project.liveUrl && (
                                                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-label-tech text-outline hover:text-secondary transition-colors">
                                                    <span className="material-symbols-outlined text-sm">open_in_new</span> Canlı Site
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* --- 3. DENEYİM BÖLÜMÜ --- */}
            <section id="experience" className="relative z-10 w-full py-16 sm:py-20 border-t border-outline-variant/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 mb-8 sm:mb-10">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl text-secondary">work</span>
                        <h2 className="font-headline-md text-2xl sm:text-3xl font-bold">Deneyim</h2>
                    </div>
                    <div className="flex flex-col gap-6 sm:gap-8 max-w-4xl">
                        {experiences.length === 0 ? (
                            <p className="text-outline-variant">Henüz deneyim eklenmedi.</p>
                        ) : (
                            experiences.map((exp) => (
                                <div key={exp.id} className="relative pl-6 sm:pl-8 md:pl-0">
                                    <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-outline-variant/20"></div>
                                    <div className="md:hidden absolute left-[-4px] top-6 w-2 h-2 rounded-full bg-secondary"></div>
                                    <div className="flex flex-col md:flex-row md:items-start gap-2 sm:gap-4 md:gap-12 p-4 sm:p-6 rounded-2xl bg-surface-container/50 border border-outline-variant/10 hover:bg-surface-container transition-colors">
                                        <div className="md:w-56 flex-shrink-0 pt-1 mb-2 md:mb-0">
                                            <span className="inline-block px-3 py-1 rounded-full bg-secondary-container/20 text-secondary font-label-tech text-[10px] sm:text-xs tracking-wider">
                                                {exp.startDate} - {exp.endDate || 'Devam Ediyor'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <h3 className="font-headline-sm text-lg sm:text-xl font-semibold text-on-surface">{exp.role}</h3>
                                            <span className="font-label-md text-secondary mb-2 sm:mb-3 text-sm sm:text-base">{exp.company}</span>
                                            <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                                                {exp.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* --- GÖNÜLLÜLÜK BÖLÜMÜ --- */}
            <section id="volunteer" className="relative z-10 w-full py-16 sm:py-20 border-t border-outline-variant/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 mb-8 sm:mb-12">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl text-secondary">volunteer_activism</span>
                        <h2 className="font-headline-md text-2xl sm:text-3xl font-bold">Gönüllülük Faaliyetleri</h2>
                    </div>

                    <div className="flex flex-col gap-6 max-w-5xl">
                        {volunteerActivities.length === 0 ? (
                            <p className="text-outline-variant">Henüz gönüllülük faaliyeti eklenmedi.</p>
                        ) : (
                            volunteerActivities.map((activity) => (
                                <div key={activity.id} className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-surface-container/40 border border-outline-variant/10 hover:bg-surface-container/60 hover:border-outline-variant/30 transition-all">

                                    {/* SOL: Tarih (Senin tasarımındaki gibi dikey) */}
                                    <div className="flex flex-col items-center justify-center flex-shrink-0 w-full md:w-36 h-min py-3 px-2 bg-secondary-container/10 rounded-xl text-secondary font-code-inline text-xs sm:text-sm text-center">
                                        <span>{activity.startDate}</span>
                                        <span className="my-1 text-outline-variant/50">-</span>
                                        <span>{activity.endDate || 'Devam Ediyor'}</span>
                                    </div>

                                    {/* ORTA: İçerik */}
                                    <div className="flex flex-col flex-1 justify-center">
                                        <h3 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface mb-1">{activity.role}</h3>
                                        <span className="font-label-md text-secondary mb-3">{activity.organization}</span>
                                        {activity.description && (
                                            <p className="text-on-surface-variant text-sm leading-relaxed">
                                                {activity.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* SAĞ: Görsel Kutusu (Eğer görsel eklendiyse görünür) */}
                                    {activity.images && activity.images.length > 0 && (
                                        <div
                                            onClick={() => openGallery(activity.images)}
                                            className="w-full md:w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer border border-outline-variant/20 hover:border-secondary/50 transition-all relative group"
                                        >
                                            <img src={activity.images[0]} alt={activity.role} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                                            {/* Resimlerin üzerine gelen karanlık katman ve ikon */}
                                            <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all text-3xl drop-shadow-md">
                                        zoom_in
                                    </span>
                                            </div>

                                            {/* Birden fazla görsel varsa "+X Görsel" etiketi */}
                                            {activity.images.length > 1 && (
                                                <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-label-tech text-on-surface">
                                                    +{activity.images.length - 1} Görsel
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* --- 5. YETENEKLER BÖLÜMÜ --- */}
            <section id="skills" className="relative z-10 w-full py-16 sm:py-24 border-t border-outline-variant/5 bg-surface-container-lowest/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 mb-10 sm:mb-14">
                        <span className="material-symbols-outlined text-3xl sm:text-4xl text-primary drop-shadow-[0_0_15px_rgba(var(--color-primary),0.5)]">integration_instructions</span>
                        <h2 className="font-headline-md text-2xl sm:text-3xl md:text-4xl font-bold">Teknoloji & Yetenekler</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {skills.length === 0 ? (
                            <p className="text-outline-variant col-span-full">Henüz yetenek eklenmedi.</p>
                        ) : (
                            skills.map(skill => {
                                let styleConfig = { text: 'text-primary', bg: 'bg-primary', hoverText: 'group-hover:text-primary', hoverBg: 'group-hover:bg-primary/10', width: '0%' };
                                switch(skill.level) {
                                    case 'Temel': styleConfig = { text: 'text-orange-500', bg: 'bg-orange-500', hoverText: 'group-hover:text-orange-500', hoverBg: 'group-hover:bg-orange-500/10', width: '25%' }; break;
                                    case 'Orta': styleConfig = { text: 'text-yellow-400', bg: 'bg-yellow-400', hoverText: 'group-hover:text-yellow-400', hoverBg: 'group-hover:bg-yellow-400/10', width: '50%' }; break;
                                    case 'İyi': styleConfig = { text: 'text-lime-400', bg: 'bg-lime-400', hoverText: 'group-hover:text-lime-400', hoverBg: 'group-hover:bg-lime-400/10', width: '75%' }; break;
                                    case 'Çok İyi': styleConfig = { text: 'text-green-500', bg: 'bg-green-500', hoverText: 'group-hover:text-green-500', hoverBg: 'group-hover:bg-green-500/10', width: '100%' }; break;
                                }

                                return (
                                    <div key={skill.id} className={`group relative bg-surface-container-low/40 backdrop-blur-md border border-outline-variant/20 rounded-3xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden hover:bg-surface-container transition-all duration-500 hover:-translate-y-2 hover:shadow-lg cursor-default`}>
                                        <div className="absolute -right-12 -top-12 w-32 h-32 bg-surface-container-high/20 rounded-full blur-3xl transition-colors duration-500"></div>
                                        <div className="relative z-10 flex items-start justify-between mb-8 sm:mb-10">
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-surface-container-high/50 flex items-center justify-center border border-outline-variant/10 group-hover:scale-110 ${styleConfig.hoverBg} transition-all duration-500 shadow-sm`}>
                                                <span className={`material-symbols-outlined text-outline-variant ${styleConfig.hoverText} transition-colors text-xl sm:text-2xl`}>code_blocks</span>
                                            </div>
                                            <span className={`font-label-tech text-xs sm:text-sm tracking-widest text-outline-variant ${styleConfig.hoverText} transition-colors duration-300 font-bold`}>
                                                {skill.level.toLocaleUpperCase('tr-TR')}
                                            </span>
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className={`font-headline-sm text-base sm:text-lg font-bold text-on-surface mb-3 sm:mb-4 ${styleConfig.hoverText} transition-colors duration-300 tracking-wide`}>
                                                {skill.name}
                                            </h3>
                                            <div className="w-full h-1.5 bg-surface-container-highest/50 rounded-full overflow-hidden">
                                                <div className={`h-full ${styleConfig.bg} rounded-full relative transition-all duration-1000 ease-out`} style={{ width: styleConfig.width }}>
                                                    <div className="absolute top-0 bottom-0 right-0 w-6 bg-white/40 blur-[2px] animate-[shimmer_2s_infinite]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* --- 6. EĞİTİM BÖLÜMÜ --- */}
            <section id="education" className="relative z-10 w-full py-16 sm:py-20 border-t border-outline-variant/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 mb-8 sm:mb-10">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl text-tertiary">school</span>
                        <h2 className="font-headline-md text-2xl sm:text-3xl font-bold">Eğitim</h2>
                    </div>
                    <div className="flex flex-col gap-6 sm:gap-8 max-w-4xl">
                        {educations.length === 0 ? (
                            <p className="text-outline-variant">Henüz eğitim eklenmedi.</p>
                        ) : (
                            educations.map((edu) => (
                                <div key={edu.id} className="relative pl-6 sm:pl-8 md:pl-0">
                                    <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-outline-variant/20"></div>
                                    <div className="md:hidden absolute left-[-4px] top-6 w-2 h-2 rounded-full bg-tertiary"></div>
                                    <div className="flex flex-col md:flex-row md:items-start gap-2 sm:gap-4 md:gap-12 p-4 sm:p-6 rounded-2xl bg-surface-container/50 border border-outline-variant/10 hover:bg-surface-container transition-colors">
                                        <div className="md:w-56 flex-shrink-0 pt-1 mb-2 md:mb-0">
                                            <span className="inline-block px-3 py-1 rounded-full bg-tertiary-container/20 text-tertiary font-label-tech text-[10px] sm:text-xs tracking-wider">
                                                {edu.startDate} - {edu.endDate || 'Devam Ediyor'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <h3 className="font-headline-sm text-lg sm:text-xl font-semibold text-on-surface">{edu.institution}</h3>
                                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 mb-2 text-sm sm:text-base">
                                                <span className="font-label-md text-outline">{edu.degree}</span>
                                                {edu.fieldOfStudy && (
                                                    <>
                                                        <span className="text-outline-variant hidden sm:inline">•</span>
                                                        <span className="font-label-md text-outline">{edu.fieldOfStudy}</span>
                                                    </>
                                                )}
                                            </div>
                                            {edu.gpa && (
                                                <div className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded bg-surface-container-high border border-outline-variant/10 w-max mt-1 sm:mt-2">
                                                    <span className="material-symbols-outlined text-xs sm:text-sm text-tertiary">grade</span>
                                                    <span className="font-label-tech text-[10px] sm:text-xs text-on-surface-variant">GPA: {edu.gpa}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* --- 7. SERTİFİKALAR BÖLÜMÜ --- */}
            <section id="certifications" className="relative z-10 w-full bg-surface-container-lowest/50 py-16 sm:py-20 border-t border-outline-variant/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 mb-8 sm:mb-12">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl text-tertiary">workspace_premium</span>
                        <h2 className="font-headline-md text-2xl sm:text-3xl font-bold">Sertifikalar ve Başarılar</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {certificates.length === 0 ? (
                            <p className="text-outline-variant">Henüz sertifika eklenmedi.</p>
                        ) : (
                            certificates.map((cert) => (
                                <div key={cert.id} className="group flex flex-col rounded-xl bg-surface-container-low border border-outline-variant/20 overflow-hidden hover:border-tertiary/50 transition-all hover:shadow-lg hover:-translate-y-1">
                                    <div className="h-40 sm:h-44 w-full bg-surface-container-lowest overflow-hidden relative cursor-pointer" onClick={() => cert.imageUrl && setSelectedCertImage(cert.imageUrl)}>
                                        {cert.imageUrl ? (
                                            <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <span className="material-symbols-outlined text-4xl sm:text-5xl text-outline-variant">workspace_premium</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-surface-container-lowest/30 pointer-events-none">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-tertiary/90 text-on-tertiary flex items-center justify-center shadow-lg">
                                                <span className="material-symbols-outlined text-lg sm:text-xl">zoom_in</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 sm:p-5 flex flex-col flex-1 relative z-10">
                                        <h3 className="font-headline-sm text-sm sm:text-base font-semibold mb-1 line-clamp-2">{cert.title}</h3>
                                        <span className="text-outline text-xs sm:text-sm font-label-md mb-2 sm:mb-3">{cert.issuer}</span>
                                        <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3 border-t border-outline-variant/10">
                                            <span className="font-label-tech text-[10px] sm:text-xs text-on-surface-variant bg-surface-container-high px-2 py-1 rounded">
                                                {cert.issueDate || 'Tarihsiz'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* --- 8. DİLLER BÖLÜMÜ --- */}
            <section id="languages" className="relative z-10 w-full py-16 sm:py-20 border-t border-outline-variant/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 mb-8 sm:mb-12">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl text-secondary">translate</span>
                        <h2 className="font-headline-md text-2xl sm:text-3xl font-bold">Diller</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {languages.length === 0 ? (
                            <p className="text-outline-variant">Henüz dil eklenmedi.</p>
                        ) : (
                            languages.map(lang => (
                                <div key={lang.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-surface-container/50 border border-outline-variant/20 rounded-2xl hover:bg-surface-container-high transition-colors">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-secondary text-xl sm:text-2xl">language</span>
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="font-headline-sm text-base sm:text-lg font-bold text-on-surface truncate">{lang.name}</span>
                                        <span className="font-label-tech text-xs sm:text-sm text-secondary truncate">{lang.level}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* --- 9. İLETİŞİM & FOOTER BÖLÜMÜ --- */}
            <section id="contact" className="w-full bg-surface-container-lowest pt-16 sm:pt-20 pb-8 sm:pb-10 border-t border-outline-variant/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 mb-16 sm:mb-20">
                        {/* İletişim Formu Tarafı */}
                        <div className="flex flex-col gap-5 sm:gap-6 bg-surface-container-low/30 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-outline-variant/20 shadow-lg order-2 lg:order-1">
                            <h3 className="font-headline-sm text-xl sm:text-2xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">chat_bubble</span>
                                Bana Mesaj Gönderin
                            </h3>
                            <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleContactSubmit}>
                                <div className="flex flex-col gap-1 sm:gap-1.5">
                                    <label className="font-label-md text-sm sm:text-base text-on-surface-variant">Ad Soyad</label>
                                    <input type="text" required value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-surface-container border border-outline-variant/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-body-md text-sm sm:text-base" placeholder="Adınız Soyadınız" />
                                </div>
                                <div className="flex flex-col gap-1 sm:gap-1.5">
                                    <label className="font-label-md text-sm sm:text-base text-on-surface-variant">E-Posta</label>
                                    <input type="email" required value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-surface-container border border-outline-variant/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-body-md text-sm sm:text-base" placeholder="ornek@mail.com" />
                                </div>
                                <div className="flex flex-col gap-1 sm:gap-1.5">
                                    <label className="font-label-md text-sm sm:text-base text-on-surface-variant">Mesajınız</label>
                                    <textarea required value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-surface-container border border-outline-variant/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-body-md resize-y text-sm sm:text-base" rows="4" placeholder="Mesajınızı buraya yazın..."></textarea>
                                </div>
                                <button type="submit" disabled={isSubmitting} className="mt-2 px-6 py-3 sm:py-3.5 rounded-lg sm:rounded-xl bg-primary text-on-primary font-label-md text-sm sm:text-base hover:shadow-[0_0_20px_rgba(var(--color-primary),0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                    {isSubmitting ? (
                                        <><span className="material-symbols-outlined text-lg sm:text-xl animate-spin">sync</span>Gönderiliyor...</>
                                    ) : (
                                        <><span className="material-symbols-outlined text-lg sm:text-xl">send</span>Gönder</>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Sosyal Medya ve Bilgi Tarafı */}
                        <div className="flex flex-col justify-center gap-4 sm:gap-6 order-1 lg:order-2 text-center lg:text-left items-center lg:items-start">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-1 sm:mb-2 shadow-inner">
                                <span className="material-symbols-outlined text-3xl sm:text-4xl">rocket_launch</span>
                            </div>
                            <h2 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Benimle İletişime Geçin</h2>
                            <p className="text-on-surface-variant text-base sm:text-lg font-body-lg leading-relaxed max-w-lg">
                                Yeni fırsatlar, takım arkadaşlıkları veya projeler için benimle iletişime geçebilirsiniz. Formu doldurarak veya doğrudan e-posta aracılığıyla bana ulaşabilirsiniz.
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 mt-2 sm:mt-4 w-full">
                                {about?.email && (
                                    <a href={`mailto:${about.email}`} className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg sm:rounded-xl bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-label-md text-sm sm:text-base transition-all border border-outline-variant/20 flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
                                        <span className="material-symbols-outlined text-xl sm:text-[22px]">mail</span>
                                        E-Posta Gönder
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="h-px w-full bg-outline-variant/10 mb-6 sm:mb-8"></div>

                    {/* FOOTER */}
                    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 text-center">
                        <p className="font-body-sm text-xs sm:text-sm text-outline">
                            © {new Date().getFullYear()} {about?.fullName || 'Kadir Gündüz'}. Tüm Hakları Saklıdır.
                        </p>
                        <div className="flex gap-4">
                            {about?.githubUrl && (
                                <a href={about.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 sm:gap-2 text-outline hover:text-primary transition-colors font-label-md text-xs sm:text-sm">
                                    <span className="material-symbols-outlined text-base sm:text-lg">code</span>
                                    <span>GitHub</span>
                                </a>
                            )}
                            {about?.linkedinUrl && (
                                <a href={about.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 sm:gap-2 text-outline hover:text-primary transition-colors font-label-md text-xs sm:text-sm">
                                    <span className="material-symbols-outlined text-base sm:text-lg">work</span>
                                    <span>LinkedIn</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- MODALLAR --- */}
            {modalConfig.isOpen && (
                <div className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}>
                    <div className="bg-surface-container border border-outline-variant/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-5 ${modalConfig.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-error/10 text-error'}`}>
                            <span className="material-symbols-outlined text-3xl sm:text-4xl">{modalConfig.type === 'success' ? 'check_circle' : 'error'}</span>
                        </div>
                        <h3 className="font-headline-sm text-xl sm:text-2xl font-bold text-on-surface mb-2">{modalConfig.title}</h3>
                        <p className="font-body-md text-sm sm:text-base text-on-surface-variant mb-6 sm:mb-8">{modalConfig.message}</p>
                        <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="w-full py-3 sm:py-3.5 rounded-lg sm:rounded-xl bg-primary text-on-primary font-label-md text-sm sm:text-base font-semibold hover:shadow-[0_0_20px_rgba(var(--color-primary),0.4)] transition-all">Tamam</button>
                    </div>
                </div>
            )}

            {selectedCertImage && (
                <div className="fixed inset-0 z-[100] bg-surface/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200" onClick={() => setSelectedCertImage(null)}>
                    <div className="relative w-full max-w-5xl flex items-center justify-center">
                        <img src={selectedCertImage} alt="Sertifika Büyük Boy" className="max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
                        <button className="absolute -top-10 sm:-top-6 right-0 sm:-right-6 w-8 h-8 sm:w-10 sm:h-10 bg-surface-container-high border border-outline-variant/20 rounded-full flex items-center justify-center text-on-surface hover:bg-error hover:text-white transition-all shadow-lg z-10" onClick={(e) => { e.stopPropagation(); setSelectedCertImage(null); }} title="Kapat">
                            <span className="material-symbols-outlined text-sm sm:text-base">close</span>
                        </button>
                    </div>
                </div>
            )}

            {/* --- RESİM GALERİSİ MODALI --- */}
            {galleryImages && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">

                    {/* Kapat Butonu */}
                    <button onClick={() => setGalleryImages(null)} className="absolute top-6 right-6 p-2 bg-surface-container rounded-full text-on-surface hover:text-error transition-colors z-10">
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>

                    <div className="relative w-full max-w-4xl max-h-[85vh] flex items-center justify-center">

                        {/* Önceki Resim Butonu */}
                        {galleryImages.length > 1 && (
                            <button
                                onClick={() => setCurrentImageIndex(prev => prev === 0 ? galleryImages.length - 1 : prev - 1)}
                                className="absolute left-2 md:-left-12 p-2 bg-surface-container/50 hover:bg-secondary hover:text-on-secondary rounded-full transition-colors backdrop-blur-md"
                            >
                                <span className="material-symbols-outlined text-2xl">chevron_left</span>
                            </button>
                        )}

                        {/* Ana Resim */}
                        <img
                            src={galleryImages[currentImageIndex]}
                            alt="Galeri"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />

                        {/* Sonraki Resim Butonu */}
                        {galleryImages.length > 1 && (
                            <button
                                onClick={() => setCurrentImageIndex(prev => prev === galleryImages.length - 1 ? 0 : prev + 1)}
                                className="absolute right-2 md:-right-12 p-2 bg-surface-container/50 hover:bg-secondary hover:text-on-secondary rounded-full transition-colors backdrop-blur-md"
                            >
                                <span className="material-symbols-outlined text-2xl">chevron_right</span>
                            </button>
                        )}

                        {/* Resim Sayacı */}
                        {galleryImages.length > 1 && (
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-label-tech text-sm text-outline">
                                {currentImageIndex + 1} / {galleryImages.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}