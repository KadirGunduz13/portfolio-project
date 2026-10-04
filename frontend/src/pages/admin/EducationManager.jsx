import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../../api/axiosClient';

export default function EducationManager() {
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            institution: 'Kırklareli Üniversitesi',
            degree: 'Lisans',
            fieldOfStudy: 'Yazılım Mühendisliği',
            startDate: '2023',
            endDate: '2027',
            gpa: '3.50'
        }
    });

    const [educations, setEducations] = useState([]);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [editingId, setEditingId] = useState(null);

    const liveData = watch();

    useEffect(() => {
        fetchEducations();
    }, []);

    const fetchEducations = async () => {
        try {
            const response = await axiosClient.get('/educations');
            setEducations(response.data || []);
        } catch (error) {
            console.log("Eğitim verileri çekilemedi.");
        }
    };

    const onSubmit = async (data) => {
        try {
            setStatusMsg({ type: 'info', text: 'İşleniyor...' });

            if (editingId) {
                await axiosClient.put(`/educations/${editingId}`, data);
                setStatusMsg({ type: 'success', text: 'Eğitim kaydı güncellendi!' });
            } else {
                await axiosClient.post('/educations', data);
                setStatusMsg({ type: 'success', text: 'Eğitim başarıyla eklendi!' });
            }

            setEditingId(null);
            fetchEducations();
            reset();
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'Kaydedilirken hata oluştu.' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu eğitim kaydını silmek istediğinize emin misiniz?')) return;

        try {
            await axiosClient.delete(`/educations/${id}`);
            setStatusMsg({ type: 'success', text: 'Kayıt başarıyla silindi!' });
            fetchEducations();

            if (editingId === id) {
                setEditingId(null);
                reset();
            }
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'Silinirken hata oluştu.' });
        }
    };

    const handleEdit = (edu) => {
        setEditingId(edu.id);
        Object.keys(edu).forEach(key => {
            setValue(key, edu[key]);
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

                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

                <div className="flex flex-col gap-1 mb-4">
                    <div className="flex items-center gap-space-sm mb-1">
                        <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-high text-tertiary font-label-tech text-label-tech">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                            MODÜL: EĞİTİMLER
                        </span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
                        Akademik Geçmiş
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                        Eğitim hayatınızı, aldığınız dereceleri ve bölüm bilgilerinizi yöneterek akademik temelinizi sergileyin.
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
                                <span className="material-symbols-outlined text-primary text-xl">
                                    {editingId ? 'edit_document' : 'school'}
                                </span>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                    {editingId ? 'Eğitim Kaydını Güncelle' : 'Yeni Eğitim Ekle'}
                                </h2>
                            </div>
                        </div>

                        <div className="p-space-lg flex flex-col gap-space-md">
                            <div className="flex flex-col gap-1.5">
                                <label className="font-label-md text-label-md text-on-surface">Okul Adı</label>
                                <input {...register('institution', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all" placeholder="Örn: Kırklareli Üniversitesi" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Derece</label>
                                    <input {...register('degree', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all" placeholder="Örn: Lisans" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Bölüm</label>
                                    <input {...register('fieldOfStudy')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all" placeholder="Örn: Yazılım Mühendisliği" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Başlangıç Tarihi</label>
                                    <input {...register('startDate')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all" placeholder="Örn: 2023" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Bitiş Tarihi</label>
                                    <input {...register('endDate')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all" placeholder="Örn: 2027 veya Devam Ediyor" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Ortalama (GPA)</label>
                                    <input {...register('gpa')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all" placeholder="Örn: 3.50" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-space-lg py-space-md bg-surface-container-high/30 border-t border-outline-variant/20">
                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="px-6 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-md hover:bg-surface-container-highest transition-all">
                                    İptal
                                </button>
                            )}
                            <button type="submit" className="px-6 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md shadow-lg shadow-primary-container/20 hover:shadow-primary-container/40 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">{editingId ? 'sync' : 'add_task'}</span>
                                <span>{editingId ? 'Kaydı Güncelle' : 'Kaydet'}</span>
                            </button>
                        </div>
                    </form>

                    {/* ================= SAĞ: CANLI KART ÖNİZLEMESİ ================= */}
                    <div className="lg:col-span-5 flex flex-col gap-space-md sticky top-24">
                        <div className="flex items-center justify-between px-space-xs">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-primary text-base">stream</span>
                                <span className="font-label-tech text-label-tech text-outline uppercase tracking-wider">Zaman Çizelgesi</span>
                            </div>
                            <span className="font-label-tech text-label-tech text-tertiary bg-tertiary-container/30 px-2 py-0.5 rounded-full animate-pulse">CANLI</span>
                        </div>

                        <div className="group relative flex flex-col rounded-2xl bg-surface-container-low/70 backdrop-blur-md overflow-hidden shadow-xl border border-outline-variant/30 p-space-lg pl-12">
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-outline-variant/20 to-transparent"></div>

                            <div className="absolute left-[19px] top-8 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--color-primary),0.5)]"></div>

                            <div className="flex flex-col gap-1 mb-2">
                                <span className="font-label-tech text-label-tech text-primary bg-primary-container/20 px-2 py-0.5 rounded w-max">
                                    {liveData.startDate || 'Başlangıç'} — {liveData.endDate || 'Bitiş'}
                                </span>
                                <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 font-semibold">
                                    {liveData.institution || 'Okul Adı'}
                                </h3>
                                <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                                    <span className="font-medium text-outline">{liveData.degree || 'Derece'}</span>
                                    {liveData.fieldOfStudy && (
                                        <>
                                            <span className="text-outline-variant">•</span>
                                            <span>{liveData.fieldOfStudy}</span>
                                        </>
                                    )}
                                </span>
                            </div>

                            {liveData.gpa && (
                                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/20 w-max">
                                    <span className="material-symbols-outlined text-sm text-tertiary">grade</span>
                                    <span className="font-label-tech text-label-tech text-on-surface">Ortalama: {liveData.gpa}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-label-md text-on-surface">Kayıtlı Eğitimler</span>
                                <span className="font-label-tech text-primary">{educations.length} Adet</span>
                            </div>
                            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                                {educations.length === 0 ? (
                                    <span className="text-sm text-outline">Henüz eğitim eklenmedi.</span>
                                ) : (
                                    educations.map(edu => (
                                        <div key={edu.id} className={`relative z-10 flex items-center justify-between p-3 rounded-lg border transition-colors ${editingId === edu.id ? 'bg-primary-container/10 border-primary/30' : 'bg-surface-container border-outline-variant/10'}`}>
                                            <div className="flex flex-col min-w-0 pr-2">
                                                <span className="font-label-sm text-on-surface truncate">{edu.institution}</span>
                                                <span className="text-xs text-outline truncate">{edu.degree} - {edu.fieldOfStudy}</span>
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button onClick={(e) => { e.preventDefault(); handleEdit(edu); }} type="button" className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-high hover:bg-primary/20 text-outline hover:text-primary transition-all cursor-pointer pointer-events-auto" title="Düzenle">
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                                <button onClick={(e) => { e.preventDefault(); handleDelete(edu.id); }} type="button" className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-high hover:bg-error/20 text-outline hover:text-error transition-all cursor-pointer pointer-events-auto" title="Sil">
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