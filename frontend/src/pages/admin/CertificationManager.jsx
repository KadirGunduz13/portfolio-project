import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../../api/axiosClient';

export default function CertificationManager() {
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            title: 'Yapay Zekaya Giriş',
            issuer: 'BTK Akademi',
            issueDate: 'Temmuz 2025',
            imageUrl: ''
        }
    });

    const [certificates, setCertificates] = useState([]);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [editingId, setEditingId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const liveData = watch();

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const response = await axiosClient.get('/certificates');
            setCertificates(response.data || []);
        } catch (error) {
            console.log("Sertifika verileri çekilemedi.");
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setIsUploading(true);
            setStatusMsg({ type: 'info', text: 'Sertifika görseli yükleniyor...' });

            const response = await axiosClient.post('/admin/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const uploadedUrl = response.data.url;
            setValue('imageUrl', uploadedUrl, { shouldDirty: true, shouldValidate: true });

            setStatusMsg({ type: 'success', text: 'Görsel başarıyla yüklendi!' });
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error("Yükleme Hatası:", error);
            setStatusMsg({ type: 'error', text: 'Görsel yüklenirken hata oluştu.' });
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setStatusMsg({ type: 'info', text: 'İşleniyor...' });

            if (editingId) {
                await axiosClient.put(`/certificates/${editingId}`, data);
                setStatusMsg({ type: 'success', text: 'Sertifika kaydı güncellendi!' });
            } else {
                await axiosClient.post('/certificates', data);
                setStatusMsg({ type: 'success', text: 'Sertifika başarıyla eklendi!' });
            }

            setEditingId(null);
            fetchCertificates();
            reset();
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'Kaydedilirken hata oluştu.' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu sertifikayı silmek istediğinize emin misiniz?')) return;

        try {
            await axiosClient.delete(`/certificates/${id}`);
            setStatusMsg({ type: 'success', text: 'Sertifika başarıyla silindi!' });
            fetchCertificates();

            if (editingId === id) {
                setEditingId(null);
                reset();
            }
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'Silinirken hata oluştu.' });
        }
    };

    const handleEdit = (cert) => {
        setEditingId(cert.id);
        Object.keys(cert).forEach(key => {
            setValue(key, cert[key]);
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

                <div className="absolute top-0 left-1/4 w-96 h-96 bg-tertiary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

                <div className="flex flex-col gap-1 mb-4">
                    <div className="flex items-center gap-space-sm mb-1">
                        <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-high text-tertiary font-label-tech text-label-tech">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                            MODÜL: SERTİFİKALAR
                        </span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
                        Sertifikalar ve Başarılar
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                        Doğrulanmış sertifikalarınızı, yarışma ödüllerinizi ve harici belgelerinizi canlı portfolyoya yayınlayın.
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
                                <span className="material-symbols-outlined text-tertiary text-xl">
                                    {editingId ? 'edit_document' : 'workspace_premium'}
                                </span>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                    {editingId ? 'Sertifika Güncelle' : 'Yeni Sertifika Ekle'}
                                </h2>
                            </div>
                        </div>

                        <div className="p-space-lg flex flex-col gap-space-md">
                            <div className="flex flex-col gap-1.5">
                                <label className="font-label-md text-label-md text-on-surface">Sertifika Adı</label>
                                <input {...register('title', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-tertiary/40 focus:outline-none transition-all" placeholder="Örn: Yapay Zekaya Giriş" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Veren Kurum</label>
                                    <input {...register('issuer', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-tertiary/40 focus:outline-none transition-all" placeholder="Örn: BTK Akademi" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Alınma Tarihi</label>
                                    <input {...register('issueDate')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-tertiary/40 focus:outline-none transition-all" placeholder="Temmuz 2025" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 p-4 bg-surface-container/50 rounded-xl border border-outline-variant/20 mt-2">
                                <label className="font-label-md text-label-md text-on-surface flex justify-between items-center">
                                    <span>Sertifika Görseli</span>
                                    {isUploading && <span className="material-symbols-outlined text-tertiary animate-spin text-sm">sync</span>}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-label-md file:bg-surface-container-high file:text-tertiary hover:file:bg-tertiary/20 transition-all cursor-pointer border border-outline-variant/10 rounded-lg bg-surface-container-lowest"
                                />
                                <input type="hidden" {...register('imageUrl')} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-space-lg py-space-md bg-surface-container-high/30 border-t border-outline-variant/20">
                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="px-6 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-md hover:bg-surface-container-highest transition-all">
                                    İptal
                                </button>
                            )}
                            <button type="submit" className="px-6 py-2.5 rounded-lg bg-tertiary text-on-tertiary font-label-md text-label-md shadow-[0_0_15px_rgba(215,165,248,0.3)] hover:shadow-[0_0_25px_rgba(215,165,248,0.5)] transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">{editingId ? 'sync' : 'add_task'}</span>
                                <span>{editingId ? 'Kaydı Güncelle' : 'Kaydet'}</span>
                            </button>
                        </div>
                    </form>

                    {/* ================= SAĞ: CANLI KART ÖNİZLEMESİ ================= */}
                    <div className="lg:col-span-5 flex flex-col gap-space-md sticky top-24">
                        <div className="flex items-center justify-between px-space-xs">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-tertiary text-base">stream</span>
                                <span className="font-label-tech text-label-tech text-outline uppercase tracking-wider">Kart Ön İzleme</span>
                            </div>
                            <span className="font-label-tech text-label-tech text-tertiary bg-tertiary-container/30 px-2 py-0.5 rounded-full animate-pulse">CANLI</span>
                        </div>

                        <div className="group flex flex-col rounded-2xl bg-surface-container/70 backdrop-blur-md overflow-hidden shadow-xl border border-outline-variant/30">
                            <div className="relative h-40 w-full overflow-hidden bg-surface-container-lowest flex items-center justify-center p-4">
                                {liveData.imageUrl ? (
                                    <img className="w-full h-full object-contain object-center" alt="Sertifika Önizleme" src={liveData.imageUrl} />
                                ) : (
                                    <span className="material-symbols-outlined text-4xl text-outline-variant">workspace_premium</span>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent"></div>
                            </div>

                            <div className="p-space-lg flex flex-col flex-1 gap-space-xs -mt-6 relative z-10">
                                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-tertiary leading-tight">
                                    {liveData.title || 'Sertifika Başlığı'}
                                </h3>
                                <span className="font-label-md text-label-md text-outline mt-1">
                                    {liveData.issuer || 'Veren Kurum'}
                                </span>

                                <div className="flex items-center justify-between mt-4">
                                    <span className="font-label-tech text-label-tech text-on-surface-variant bg-surface-container-high px-2 py-1 rounded">
                                        {liveData.issueDate || 'Tarih'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-label-md text-on-surface">Kayıtlı Sertifikalar</span>
                                <span className="font-label-tech text-tertiary">{certificates.length} Adet</span>
                            </div>
                            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                                {certificates.length === 0 ? (
                                    <span className="text-sm text-outline">Henüz sertifika eklenmedi.</span>
                                ) : (
                                    certificates.map(cert => (
                                        <div key={cert.id} className={`relative z-10 flex items-center justify-between p-3 rounded-lg border transition-colors ${editingId === cert.id ? 'bg-tertiary-container/10 border-tertiary/30' : 'bg-surface-container border-outline-variant/10'}`}>
                                            <div className="flex flex-col min-w-0 pr-2">
                                                <span className="font-label-sm text-on-surface truncate">{cert.title}</span>
                                                <span className="text-xs text-outline truncate">{cert.issuer}</span>
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button onClick={(e) => { e.preventDefault(); handleEdit(cert); }} type="button" className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-high hover:bg-tertiary/20 text-outline hover:text-tertiary transition-all cursor-pointer pointer-events-auto" title="Düzenle">
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                                <button onClick={(e) => { e.preventDefault(); handleDelete(cert.id); }} type="button" className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-high hover:bg-error/20 text-outline hover:text-error transition-all cursor-pointer pointer-events-auto" title="Sil">
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