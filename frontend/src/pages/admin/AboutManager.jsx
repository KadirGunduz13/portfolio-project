import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../../api/axiosClient';

export default function AboutManager() {
    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            fullName: 'Kadir Gündüz',
            title: 'Yazılım Mühendisliği Öğrencisi',
            bio: '',
            avatarUrl: '',
            cvUrl: '',
            email: 'contact@kadirgunduz.dev',
            phone: '',
            location: 'İstanbul, Türkiye',
            githubUrl: 'https://github.com/kadirgunduz',
            linkedinUrl: ''
        }
    });

    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [uploading, setUploading] = useState({ avatar: false, cv: false });

    const liveData = watch();

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await axiosClient.get('/about');
                if (response.data && response.data.length > 0) {
                    Object.keys(response.data[0]).forEach(key => {
                        setValue(key, response.data[0][key]);
                    });
                } else if (response.data && !Array.isArray(response.data)) {
                    Object.keys(response.data).forEach(key => {
                        setValue(key, response.data[key]);
                    });
                }
            } catch (error) {
                console.log("Veri çekilemedi veya henüz veri yok.");
            }
        };
        fetchAboutData();
    }, [setValue]);

    const handleFileUpload = async (event, fieldType) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(prev => ({ ...prev, [fieldType]: true }));
            setStatusMsg({ type: 'info', text: `${fieldType === 'avatar' ? 'Fotoğraf' : 'CV'} yükleniyor...` });

            const response = await axiosClient.post('/admin/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const uploadedUrl = response.data.url;

            if (fieldType === 'avatar') {
                setValue('avatarUrl', uploadedUrl, { shouldDirty: true, shouldValidate: true });
            } else {
                setValue('cvUrl', uploadedUrl, { shouldDirty: true, shouldValidate: true });
            }

            setStatusMsg({ type: 'success', text: 'Dosya başarıyla yüklendi!' });
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error("Yükleme Hatası:", error);
            setStatusMsg({ type: 'error', text: 'Dosya yüklenirken hata oluştu. (Backend ayarlarını kontrol et)' });
        } finally {
            setUploading(prev => ({ ...prev, [fieldType]: false }));
        }
    };

    const onSubmit = async (data) => {
        try {
            setStatusMsg({ type: 'info', text: 'Kaydediliyor...' });

            await axiosClient.put('/about', data);

            setStatusMsg({ type: 'success', text: 'Değişiklikler başarıyla canlıya alındı!' });
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'Kaydedilirken bir hata oluştu.' });
        }
    };

    return (
        <div className="flex flex-col w-full">
            <div className="relative w-full max-w-7xl mx-auto px-space-md sm:px-space-xl py-space-xl flex flex-col gap-space-xl">

                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
                <div className="absolute top-24 right-1/6 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-space-sm mb-1">
                          <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-high text-tertiary font-label-tech text-label-tech">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                            SİSTEM: SENKRONİZE
                          </span>
                        </div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
                            Hakkımda Yapılandırması
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                            Herkese açık biyografinizi, temel iletişim bilgilerinizi ve avatarınızı yönetin.
                        </p>
                    </div>
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

                    <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-8 flex flex-col rounded-xl bg-surface-container-low/90 backdrop-blur-xl shadow-xl overflow-hidden border border-outline-variant/20">
                        <div className="flex items-center justify-between px-space-lg py-space-md bg-surface-container-high/40 border-b border-outline-variant/20">
                            <div className="flex items-center gap-space-sm">
                                <span className="material-symbols-outlined text-primary text-xl">code_blocks</span>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">Genel Bilgiler & Biyografi</h2>
                            </div>
                        </div>

                        <div className="p-space-lg sm:p-space-xl flex flex-col gap-space-xl">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface flex items-center justify-between">
                                        <span>Ad Soyad</span>
                                    </label>
                                    <input {...register('fullName', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-primary/40" placeholder="Örn: Kadir Gündüz" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface flex items-center justify-between">
                                        <span>Başlık / Unvan</span>
                                    </label>
                                    <input {...register('title', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-primary/40" placeholder="Örn: Yazılım Mühendisi" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg p-4 bg-surface-container/50 rounded-xl border border-outline-variant/20">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface flex justify-between">
                                        <span>Profil Fotoğrafı (Avatar)</span>
                                        {uploading.avatar && <span className="material-symbols-outlined text-primary animate-spin text-sm">sync</span>}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, 'avatar')}
                                        className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-label-md file:bg-surface-container-high file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer border border-outline-variant/10 rounded-lg bg-surface-container-lowest"
                                    />
                                    <input type="hidden" {...register('avatarUrl')} />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface flex justify-between">
                                        <span>CV Dokümanı (PDF vb.)</span>
                                        {uploading.cv && <span className="material-symbols-outlined text-primary animate-spin text-sm">sync</span>}
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => handleFileUpload(e, 'cv')}
                                        className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-label-md file:bg-surface-container-high file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer border border-outline-variant/10 rounded-lg bg-surface-container-lowest"
                                    />
                                    <input type="hidden" {...register('cvUrl')} />
                                    {liveData.cvUrl && (
                                        <a href={liveData.cvUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1 truncate">
                                            Mevcut CV'yi Görüntüle
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">E-Posta</label>
                                    <input type="email" {...register('email')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-primary/40" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Telefon</label>
                                    <input {...register('phone')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-primary/40" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Konum</label>
                                    <input {...register('location')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-primary/40" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">GitHub Bağlantısı</label>
                                    <input {...register('githubUrl')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-primary/40" />
                                </div>
                                <div className="flex flex-col gap-1.5 md:col-span-2">
                                    <label className="font-label-md text-label-md text-on-surface">LinkedIn Bağlantısı</label>
                                    <input {...register('linkedinUrl')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-primary/40" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-label-md text-label-md text-on-surface flex items-center gap-2">
                                    <span>Biyografi</span>
                                </label>
                                <textarea {...register('bio', { required: true })} className="w-full p-4 rounded-xl bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-primary/40 resize-y" rows="5"></textarea>
                            </div>
                        </div>

                        <div className="flex items-center justify-end px-space-lg py-space-md bg-surface-container-high/30 border-t border-outline-variant/20">
                            <button type="submit" className="px-6 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-md flex items-center gap-2 hover:bg-primary/20 transition-all">
                                <span className="material-symbols-outlined text-lg">save</span>
                                <span>Kaydet</span>
                            </button>
                        </div>
                    </form>

                    {/* ================= SAĞ: CANLI ÖNİZLEME ================= */}
                    <div className="lg:col-span-4 flex flex-col gap-space-md sticky top-24">
                        <div className="flex items-center justify-between px-space-xs">
                            <span className="font-label-tech text-label-tech text-outline uppercase">Canlı Ön İzleme</span>
                        </div>

                        <div className="rounded-xl bg-surface-container-lowest shadow-2xl overflow-hidden flex flex-col border border-outline-variant/30">
                            <div className="p-space-lg flex flex-col gap-space-md bg-gradient-to-b from-surface-container/30 to-surface-container-lowest">

                                <div className="flex items-center gap-3">
                                    {liveData.avatarUrl ? (
                                        <img alt="Profil" className="w-16 h-16 rounded-xl object-cover shadow-md border border-outline-variant/20" src={liveData.avatarUrl} />
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center text-outline border border-outline-variant/20">
                                            <span className="material-symbols-outlined">person</span>
                                        </div>
                                    )}
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-headline-sm text-headline-sm text-on-surface truncate">{liveData.fullName || 'İsim'}</span>
                                        <span className="font-label-tech text-label-tech text-secondary truncate">{liveData.email || 'E-Posta'}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5 border-t border-b border-outline-variant/10 py-3">
                                    {liveData.location && (
                                        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-label-tech">
                                            <span className="material-symbols-outlined text-sm text-outline">location_on</span>
                                            {liveData.location}
                                        </div>
                                    )}
                                    {liveData.phone && (
                                        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-label-tech">
                                            <span className="material-symbols-outlined text-sm text-outline">phone_iphone</span>
                                            {liveData.phone}
                                        </div>
                                    )}
                                </div>

                                <div className="px-3 py-1.5 rounded-lg bg-surface-container-high/60 text-primary font-code-inline text-code-inline">
                                    <span className="text-tertiary font-semibold">&gt;</span> {liveData.title || 'Unvan'}
                                </div>

                                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-4">
                                    {liveData.bio || 'Biyografi ön izlemesi burada görünecek...'}
                                </p>

                                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-outline-variant/10">
                                    {liveData.githubUrl && (
                                        <a href={liveData.githubUrl} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-all border border-outline-variant/20 text-xs font-label-md">
                                            <span className="material-symbols-outlined text-sm">code</span>
                                            GitHub
                                        </a>
                                    )}
                                    {liveData.linkedinUrl && (
                                        <a href={liveData.linkedinUrl} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-all border border-outline-variant/20 text-xs font-label-md">
                                            <span className="material-symbols-outlined text-sm">work</span>
                                            LinkedIn
                                        </a>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}