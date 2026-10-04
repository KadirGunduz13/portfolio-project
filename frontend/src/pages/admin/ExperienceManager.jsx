import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../../api/axiosClient';

export default function ExperienceManager() {
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            company: 'Smartera',
            role: 'Software Engineering Intern',
            location: 'İstanbul, Türkiye',
            startDate: 'Haziran 2026',
            endDate: 'Temmuz 2026',
            description: 'Kurumsal yazılım süreçlerine katılım, backend servislerinin geliştirilmesi ve modern teknolojilerle sistem entegrasyonları üzerine çalışmalar gerçekleştirildi.'
        }
    });

    const [experiences, setExperiences] = useState([]);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [editingId, setEditingId] = useState(null);

    const liveData = watch();

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const response = await axiosClient.get('/experiences');
            setExperiences(response.data || []);
        } catch (error) {
            console.log("Deneyim verileri çekilemedi.");
        }
    };

    const onSubmit = async (data) => {
        try {
            setStatusMsg({ type: 'info', text: 'İşleniyor...' });

            if (editingId) {
                await axiosClient.put(`/experiences/${editingId}`, data);
                setStatusMsg({ type: 'success', text: 'Deneyim kaydı güncellendi!' });
            } else {
                await axiosClient.post('/experiences', data);
                setStatusMsg({ type: 'success', text: 'Deneyim başarıyla eklendi!' });
            }

            setEditingId(null);
            fetchExperiences();
            reset();
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'Kaydedilirken hata oluştu.' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu deneyim kaydını silmek istediğinize emin misiniz?')) return;

        try {
            await axiosClient.delete(`/experiences/${id}`);
            setStatusMsg({ type: 'success', text: 'Kayıt başarıyla silindi!' });
            fetchExperiences();

            if (editingId === id) {
                setEditingId(null);
                reset();
            }
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'Silinirken hata oluştu.' });
        }
    };

    const handleEdit = (exp) => {
        setEditingId(exp.id);
        Object.keys(exp).forEach(key => {
            setValue(key, exp[key]);
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    return (
        <div className="flex flex-col w-full">
            <div className="relative w-full max-w-7xl mx-auto px-space-md sm:px-space-xl py-space-xl flex flex-col gap-space-xl">

                <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

                <div className="flex flex-col gap-1 mb-4">
                    <div className="flex items-center gap-space-sm mb-1">
                        <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-high text-tertiary font-label-tech text-label-tech">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                            MODÜL: DENEYİMLER
                        </span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
                        Profesyonel Deneyimler
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                        Çalışma geçmişinizi, stajlarınızı ve sektörel uzmanlığınızı vurgulayan temel sorumluluklarınızı yönetin.
                    </p>
                </div>

                {statusMsg.text && (
                    <div className={`p-4 rounded-lg font-label-md flex items-center gap-2 ${
                        statusMsg.type === 'success' ? 'bg-tertiary-container/20 text-tertiary border border-tertiary/30' :
                            statusMsg.type === 'error' ? 'bg-error-container/20 text-error border border-error/30' :
                                'bg-surface-container-high text-on-surface'
                    }`}>
                        <span className="material-symbols-outlined">
                            {statusMsg.type === 'success' ? 'check_circle' : statusMsg.type === 'error' ? 'error' : 'sync'}
                        </span>
                        {statusMsg.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">

                    <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 flex flex-col rounded-xl bg-surface-container-low/90 backdrop-blur-xl shadow-xl overflow-hidden border border-outline-variant/20">
                        <div className="flex items-center justify-between px-space-lg py-space-md bg-surface-container-high/40 border-b border-outline-variant/20">
                            <div className="flex items-center gap-space-sm">
                                <span className="material-symbols-outlined text-secondary text-xl">
                                    {editingId ? 'edit_document' : 'work'}
                                </span>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                    {editingId ? 'Deneyim Kaydını Güncelle' : 'Yeni Deneyim Ekle'}
                                </h2>
                            </div>
                        </div>

                        <div className="p-space-lg flex flex-col gap-space-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Şirket/Kurum Adı</label>
                                    <input {...register('company', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="Örn: Smartera" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Pozisyon</label>
                                    <input {...register('role', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="Örn: Yazılım Mühendisi Stajyeri" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Konum</label>
                                    <input {...register('location')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="Örn: İstanbul" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Başlangıç Tarihi</label>
                                    <input {...register('startDate')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="Örn: Haz 2026" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Bitiş Tarihi</label>
                                    <input {...register('endDate')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="Örn: Tem 2026" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="font-label-md text-label-md text-on-surface flex justify-between">
                                    <span>Açıklama (Sorumluluklar ve Başarılar)</span>
                                </label>
                                <textarea {...register('description')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all resize-y" rows="4"></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-space-lg py-space-md bg-surface-container-high/30 border-t border-outline-variant/20">
                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="px-6 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-md hover:bg-surface-container-highest transition-all">
                                    İptal
                                </button>
                            )}
                            <button type="submit" className="px-6 py-2.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md shadow-[0_0_15px_rgba(76,215,246,0.3)] hover:shadow-[0_0_25px_rgba(76,215,246,0.5)] transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">{editingId ? 'sync' : 'add_task'}</span>
                                <span>{editingId ? 'Kaydı Güncelle' : 'Kaydet'}</span>
                            </button>
                        </div>
                    </form>

                    {/* ================= SAĞ: CANLI KART ÖNİZLEMESİ ================= */}
                    <div className="lg:col-span-5 flex flex-col gap-space-md sticky top-24">
                        <div className="flex items-center justify-between px-space-xs">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-secondary text-base">stream</span>
                                <span className="font-label-tech text-label-tech text-outline uppercase tracking-wider">Zaman Çizelgesi Ön İzleme</span>
                            </div>
                            <span className="font-label-tech text-label-tech text-tertiary bg-tertiary-container/30 px-2 py-0.5 rounded-full animate-pulse">CANLI</span>
                        </div>

                        <div className="group relative flex flex-col rounded-2xl bg-surface-container-low/70 backdrop-blur-md overflow-hidden shadow-xl border border-outline-variant/30 p-space-lg pl-12">
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-secondary/50 via-outline-variant/20 to-transparent"></div>

                            <div className="absolute left-[19px] top-8 w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_rgba(76,215,246,0.5)]"></div>

                            <div className="flex flex-col gap-1 mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-label-tech text-label-tech text-secondary bg-secondary-container/20 px-2 py-0.5 rounded w-max">
                                        {liveData.startDate || 'Başlangıç'} — {liveData.endDate || 'Bitiş'}
                                    </span>
                                    <span className="font-label-tech text-label-tech text-outline">
                                        {liveData.location || ''}
                                    </span>
                                </div>
                                <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 font-semibold">
                                    {liveData.role || 'Pozisyon'}
                                </h3>
                                <span className="font-label-md text-label-md text-outline flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm">domain</span>
                                    {liveData.company || 'Şirket Adı'}
                                </span>
                            </div>

                            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                                {liveData.description || 'Açıklama metni burada görünecek...'}
                            </p>
                        </div>

                        <div className="mt-4 p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-label-md text-on-surface">Kayıtlı Deneyimler</span>
                                <span className="font-label-tech text-secondary">{experiences.length} Adet</span>
                            </div>
                            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                                {experiences.length === 0 ? (
                                    <span className="text-sm text-outline">Henüz deneyim eklenmedi.</span>
                                ) : (
                                    experiences.map(exp => (
                                        <div key={exp.id} className={`relative z-10 flex items-center justify-between p-3 rounded-lg border transition-colors ${editingId === exp.id ? 'bg-secondary-container/10 border-secondary/30' : 'bg-surface-container border-outline-variant/10'}`}>
                                            <div className="flex flex-col min-w-0 pr-2">
                                                <span className="font-label-sm text-on-surface truncate">{exp.role}</span>
                                                <span className="text-xs text-outline truncate">{exp.company}</span>
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button onClick={(e) => { e.preventDefault(); handleEdit(exp); }} type="button" className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-high hover:bg-secondary/20 text-outline hover:text-secondary transition-all cursor-pointer pointer-events-auto" title="Düzenle">
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                                <button onClick={(e) => { e.preventDefault(); handleDelete(exp.id); }} type="button" className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-high hover:bg-error/20 text-outline hover:text-error transition-all cursor-pointer pointer-events-auto" title="Sil">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}