import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../../api/axiosClient';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function CertificationManager() {
    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            name: '',
            issuer: '',
            date: '',
            imageUrl: ''
        }
    });

    const [certificates, setCertificates] = useState([]);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [editingId, setEditingId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            // API yolunun /certificates veya /certifications olduğuna dikkat et, backendine göre ayarla
            const response = await axiosClient.get('/certificates');
            setCertificates(response.data || []);
        } catch (error) {
            console.log("Sertifikalar çekilemedi.");
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
                setStatusMsg({ type: 'success', text: 'Sertifika başarıyla güncellendi!' });
            } else {
                await axiosClient.post('/certificates', data);
                setStatusMsg({ type: 'success', text: 'Sertifika başarıyla eklendi!' });
            }

            setEditingId(null);
            fetchCertificates();
            reset();
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'İşlem sırasında bir hata oluştu.' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu sertifikayı kalıcı olarak silmek istediğinize emin misiniz?')) return;

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

    // --- SÜRÜKLE-BIRAK (DRAG AND DROP) SIRALAMA İŞLEMİ ---
    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(certificates);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setCertificates(items);

        try {
            const ids = items.map(item => item.id);
            await axiosClient.put('/certificates/update-order', ids);
        } catch (error) {
            console.error("Sıralama kaydedilemedi:", error);
            setStatusMsg({ type: 'error', text: 'Sıralama güncellenirken hata oluştu.' });
            fetchCertificates();
        }
    };

    return (
        <div className="flex flex-col w-full">
            <div className="relative w-full max-w-7xl mx-auto px-space-md sm:px-space-xl py-space-xl flex flex-col gap-space-xl">

                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

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
                        Sahip olduğunuz uzmanlık sertifikalarını ve eğitim belgelerini buradan yönetebilirsiniz.
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
                                    {editingId ? 'edit_document' : 'workspace_premium'}
                                </span>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                    {editingId ? 'Sertifikayı Güncelle' : 'Yeni Sertifika Ekle'}
                                </h2>
                            </div>
                        </div>

                        <div className="p-space-lg flex flex-col gap-space-md">
                            <div className="flex flex-col gap-1.5">
                                <label className="font-label-md text-label-md text-on-surface">Sertifika Adı</label>
                                <input {...register('name', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="Örn: Yapay Zekaya Giriş" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Veren Kurum</label>
                                    <input {...register('issuer', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="Örn: BTK Akademi" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Alınma Tarihi</label>
                                    <input {...register('date', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="Örn: Temmuz 2025" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 p-4 bg-surface-container/50 rounded-xl border border-outline-variant/20 mt-2">
                                <label className="font-label-md text-label-md text-on-surface flex justify-between items-center">
                                    <span>Sertifika Görseli</span>
                                    {isUploading && <span className="material-symbols-outlined text-secondary animate-spin text-sm">sync</span>}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={handleFileUpload}
                                    className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-label-md file:bg-surface-container-high file:text-secondary hover:file:bg-secondary/20 transition-all cursor-pointer border border-outline-variant/10 rounded-lg bg-surface-container-lowest"
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
                            <button type="submit" className="px-6 py-2.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md shadow-[0_0_15px_rgba(76,215,246,0.3)] hover:shadow-[0_0_25px_rgba(76,215,246,0.5)] transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">{editingId ? 'sync' : 'workspace_premium'}</span>
                                <span>{editingId ? 'Güncelle' : 'Kaydet'}</span>
                            </button>
                        </div>
                    </form>

                    {/* Sağ Taraf: Kayıtlı Sertifikalar ve Sürükle-Bırak Alanı */}
                    <div className="lg:col-span-5 flex flex-col gap-space-md sticky top-24">
                        <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-label-md text-on-surface">Kayıtlı Sertifikalar (Sürükle & Sırala)</span>
                                <span className="font-label-tech text-tertiary">{certificates.length} Adet</span>
                            </div>

                            {certificates.length === 0 ? (
                                <span className="text-sm text-outline">Henüz sertifika eklenmedi.</span>
                            ) : (
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="certificates-manager-list">
                                        {(provided) => (
                                            <div
                                                className="flex flex-col gap-2 max-h-[450px] overflow-y-auto pr-1"
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                            >
                                                {certificates.map((cert, index) => (
                                                    <Draggable key={cert.id.toString()} draggableId={cert.id.toString()} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                                                    snapshot.isDragging
                                                                        ? 'bg-surface-container-high shadow-lg border-secondary/50 opacity-90'
                                                                        : editingId === cert.id
                                                                            ? 'bg-secondary-container/10 border-secondary/30'
                                                                            : 'bg-surface-container border-outline-variant/10 hover:border-outline-variant/30'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-2.5 overflow-hidden">
                                                                    {/* 3 Çizgili Tutamaç (Drag Handle) */}
                                                                    <div {...provided.dragHandleProps} className="text-outline hover:text-secondary cursor-grab active:cursor-grabbing flex items-center">
                                                                        <span className="material-symbols-outlined text-lg select-none">drag_indicator</span>
                                                                    </div>
                                                                    <div className="flex flex-col truncate">
                                                                        <span className="font-label-sm text-on-surface font-semibold truncate">{cert.name}</span>
                                                                        <span className="text-xs text-outline truncate">{cert.issuer}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex gap-2 flex-shrink-0">
                                                                    <button onClick={() => handleEdit(cert)} type="button" className="material-symbols-outlined text-sm text-outline hover:text-secondary transition-colors cursor-pointer" title="Düzenle">
                                                                        edit
                                                                    </button>
                                                                    <button onClick={() => handleDelete(cert.id)} type="button" className="material-symbols-outlined text-sm text-outline hover:text-error transition-colors cursor-pointer" title="Sil">
                                                                        delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}