import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../../api/axiosClient';

export default function ProjectManager() {
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            title: '',
            description: '',
            technologies: '',
            imageUrl: '',
            githubUrl: '',
            liveUrl: ''
        }
    });

    const [projects, setProjects] = useState([]);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [editingId, setEditingId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const liveData = watch();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axiosClient.get('/projects');
            setProjects(response.data || []);
        } catch (error) {
            console.log("Projeler çekilemedi.");
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setIsUploading(true);
            setStatusMsg({ type: 'info', text: 'Proje görseli yükleniyor...' });

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
                // Düzenleme Modu (PUT isteği)
                await axiosClient.put(`/projects/${editingId}`, data);
                setStatusMsg({ type: 'success', text: 'Proje başarıyla güncellendi!' });
            } else {
                // Yeni Ekleme Modu (POST isteği)
                await axiosClient.post('/projects', data);
                setStatusMsg({ type: 'success', text: 'Proje başarıyla eklendi!' });
            }

            setEditingId(null);
            fetchProjects();
            reset();
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'İşlem sırasında bir hata oluştu.' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu projeyi kalıcı olarak silmek istediğinize emin misiniz?')) return;

        try {
            await axiosClient.delete(`/projects/${id}`);
            setStatusMsg({ type: 'success', text: 'Proje başarıyla silindi!' });
            fetchProjects();

            if (editingId === id) {
                setEditingId(null);
                reset();
            }
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'Silinirken hata oluştu.' });
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.id);
        Object.keys(project).forEach(key => {
            setValue(key, project[key]);
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
                            MODÜL: PROJELER
                        </span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
                        Proje Mimarisi
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                        Portfolyonuza yeni mühendislik çalışmalarınızı ekleyin veya mevcut projelerinizi güncelleyin.
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
                                    {editingId ? 'edit_document' : 'terminal'}
                                </span>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                    {editingId ? 'Mevcut Projeyi Güncelle' : 'Yeni Proje Ekle'}
                                </h2>
                            </div>
                        </div>

                        <div className="p-space-lg flex flex-col gap-space-md">
                            <div className="flex flex-col gap-1.5">
                                <label className="font-label-md text-label-md text-on-surface flex justify-between">
                                    <span>Proje Adı</span>
                                </label>
                                <input {...register('title', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="Örn: TaskMaster" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="font-label-md text-label-md text-on-surface flex justify-between">
                                    <span>Teknolojiler (Virgülle ayırın)</span>
                                </label>
                                <input {...register('technologies', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="Örn: Java, Spring Boot, React" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="font-label-md text-label-md text-on-surface flex justify-between">
                                    <span>Açıklama</span>
                                </label>
                                <textarea {...register('description', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all resize-y" rows="3" placeholder="Projenin mimarisini ve amacını açıklayın..."></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Kaynak Kod URL (GitHub)</label>
                                    <input {...register('githubUrl')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="https://github.com/..." />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Canlı Demo URL</label>
                                    <input {...register('liveUrl')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="https://..." />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 p-4 bg-surface-container/50 rounded-xl border border-outline-variant/20 mt-2">
                                <label className="font-label-md text-label-md text-on-surface flex justify-between items-center">
                                    <span>Proje Görseli</span>
                                    {isUploading && <span className="material-symbols-outlined text-secondary animate-spin text-sm">sync</span>}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
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
                                <span className="material-symbols-outlined text-lg">{editingId ? 'sync' : 'rocket_launch'}</span>
                                <span>{editingId ? 'Kaydı Güncelle' : 'Kaydet'}</span>
                            </button>
                        </div>
                    </form>

                    <div className="lg:col-span-5 flex flex-col gap-space-md sticky top-24">
                        <div className="flex items-center justify-between px-space-xs">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-secondary text-base">stream</span>
                                <span className="font-label-tech text-label-tech text-outline uppercase tracking-wider">Kart Ön İzleme</span>
                            </div>
                            <span className="font-label-tech text-label-tech text-tertiary bg-tertiary-container/30 px-2 py-0.5 rounded-full animate-pulse">CANLI</span>
                        </div>

                        <div className="group flex flex-col rounded-2xl bg-surface-container/70 backdrop-blur-md overflow-hidden shadow-xl border border-outline-variant/30">
                            <div className="relative h-48 w-full overflow-hidden bg-surface-container-lowest flex items-center justify-center">
                                {liveData.imageUrl ? (
                                    <img className="w-full h-full object-cover object-center" alt="Önizleme" src={liveData.imageUrl} />
                                ) : (
                                    <span className="material-symbols-outlined text-4xl text-outline-variant">image</span>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/20 to-transparent"></div>
                            </div>

                            <div className="p-space-lg flex flex-col flex-1 gap-space-md">
                                <div className="flex flex-col gap-space-xs">
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-secondary">
                                        {liveData.title || 'Proje Adı'}
                                    </h3>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-3">
                                        {liveData.description || 'Proje açıklaması burada görünecek...'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {(liveData.technologies ? liveData.technologies.split(',') : []).map((tech, i) => (
                                        tech.trim() && (
                                            <span key={i} className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-tech text-[10px]">
                                                {tech.trim()}
                                            </span>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-label-md text-on-surface">Kayıtlı Projeler</span>
                                <span className="font-label-tech text-tertiary">{projects.length} Adet</span>
                            </div>
                            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                                {projects.length === 0 ? (
                                    <span className="text-sm text-outline">Henüz proje eklenmedi.</span>
                                ) : (
                                    projects.map(proj => (
                                        <div key={proj.id} className={`flex items-center justify-between p-2 rounded border transition-colors ${editingId === proj.id ? 'bg-secondary-container/10 border-secondary/30' : 'bg-surface-container border-outline-variant/10'}`}>
                                            <span className="font-label-sm text-on-surface truncate pr-2">{proj.title}</span>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button onClick={() => handleEdit(proj)} type="button" className="material-symbols-outlined text-sm text-outline hover:text-secondary transition-colors cursor-pointer" title="Düzenle">
                                                    edit
                                                </button>
                                                <button onClick={() => handleDelete(proj.id)} type="button" className="material-symbols-outlined text-sm text-outline hover:text-error transition-colors cursor-pointer" title="Sil">
                                                    delete
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