import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axiosClient from '../../api/axiosClient';

export default function VolunteerActivityManager() {
    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            organization: '',
            role: '',
            startDate: '',
            endDate: '',
            description: ''
        }
    });

    const [activities, setActivities] = useState([]);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await axiosClient.get('/volunteer-activities');
            setActivities(response.data || []);
        } catch (error) {
            console.error("Gönüllülük faaliyetleri çekilemedi:", error);
        }
    };

    const onSubmit = async (data) => {
        try {
            setStatusMsg({ type: 'info', text: 'İşleniyor...' });

            if (editingId) {
                await axiosClient.put(`/volunteer-activities/${editingId}`, data);
                setStatusMsg({ type: 'success', text: 'Faaliyet başarıyla güncellendi!' });
            } else {
                await axiosClient.post('/volunteer-activities', data);
                setStatusMsg({ type: 'success', text: 'Faaliyet başarıyla eklendi!' });
            }

            setEditingId(null);
            fetchActivities();
            reset();
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'İşlem sırasında bir hata oluştu.' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu faaliyeti kalıcı olarak silmek istediğinize emin misiniz?')) return;

        try {
            await axiosClient.delete(`/volunteer-activities/${id}`);
            setStatusMsg({ type: 'success', text: 'Faaliyet başarıyla silindi!' });
            fetchActivities();

            if (editingId === id) {
                setEditingId(null);
                reset();
            }
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'Silinirken hata oluştu.' });
        }
    };

    const handleEdit = (activity) => {
        setEditingId(activity.id);
        Object.keys(activity).forEach(key => {
            setValue(key, activity[key]);
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    // SÜRÜKLE BIRAK (DRAG & DROP) İŞLEMİNİ YAKALAYAN FONKSİYON
    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(activities);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Ekranı anında güncelle (Optimistic UI Update)
        setActivities(items);

        try {
            // Sadece sıralanmış ID'leri backend'e gönder
            const orderedIds = items.map(item => item.id);
            await axiosClient.put('/volunteer-activities/update-order', orderedIds);
        } catch (error) {
            console.error("Sıralama güncellenirken hata oluştu:", error);
            // Hata olursa ekranı eski haline döndür
            fetchActivities();
            setStatusMsg({ type: 'error', text: 'Sıralama kaydedilemedi.' });
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
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
                            MODÜL: GÖNÜLLÜLÜK
                        </span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
                        Gönüllülük Faaliyetleri
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                        Sivil toplum kuruluşlarındaki rollerinizi ve sosyal sorumluluk projelerinizi yönetin.
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
                    {/* FORM ALANI */}
                    <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 flex flex-col rounded-xl bg-surface-container-low/90 backdrop-blur-xl shadow-xl overflow-hidden border border-outline-variant/20">
                        <div className="flex items-center justify-between px-space-lg py-space-md bg-surface-container-high/40 border-b border-outline-variant/20">
                            <div className="flex items-center gap-space-sm">
                                <span className="material-symbols-outlined text-secondary text-xl">
                                    {editingId ? 'edit_document' : 'volunteer_activism'}
                                </span>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                    {editingId ? 'Faaliyeti Güncelle' : 'Yeni Faaliyet Ekle'}
                                </h2>
                            </div>
                        </div>

                        <div className="p-space-lg flex flex-col gap-space-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Kurum / Organizasyon</label>
                                    <input {...register('organization', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="Örn: Teknofest Kulübü" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Rol / Görev</label>
                                    <input {...register('role', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="Örn: Takım Kaptanı" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Başlangıç Tarihi</label>
                                    <input {...register('startDate')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="Örn: Oca 2025" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface">Bitiş Tarihi</label>
                                    <input {...register('endDate')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all" placeholder="Örn: Devam Ediyor" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="font-label-md text-label-md text-on-surface">Açıklama</label>
                                <textarea {...register('description')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/10 focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all resize-y" rows="3" placeholder="Bu faaliyetteki katkılarınızı anlatın..."></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-space-lg py-space-md bg-surface-container-high/30 border-t border-outline-variant/20">
                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="px-6 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-md hover:bg-surface-container-highest transition-all">
                                    İptal
                                </button>
                            )}
                            <button type="submit" className="px-6 py-2.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md shadow-[0_0_15px_rgba(76,215,246,0.3)] hover:shadow-[0_0_25px_rgba(76,215,246,0.5)] transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">{editingId ? 'sync' : 'add_circle'}</span>
                                <span>{editingId ? 'Güncelle' : 'Kaydet'}</span>
                            </button>
                        </div>
                    </form>

                    {/* SÜRÜKLE BIRAK DESTEKLİ LİSTELEME ALANI */}
                    <div className="lg:col-span-5 flex flex-col gap-space-md sticky top-24">
                        <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-label-md text-on-surface">Kayıtlı Faaliyetler</span>
                                <span className="font-label-tech text-tertiary">{activities.length} Adet</span>
                            </div>

                            {activities.length === 0 ? (
                                <span className="text-sm text-outline">Henüz faaliyet eklenmedi.</span>
                            ) : (
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="volunteer-activities">
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="flex flex-col gap-2 max-h-[450px] overflow-y-auto pr-1"
                                            >
                                                {activities.map((activity, index) => (
                                                    <Draggable key={String(activity.id)} draggableId={String(activity.id)} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                                                    snapshot.isDragging ? 'bg-surface-container-highest border-primary/50 shadow-lg scale-[1.02]' :
                                                                        editingId === activity.id ? 'bg-secondary-container/10 border-secondary/30' :
                                                                            'bg-surface-container border-outline-variant/10 hover:border-outline-variant/30'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-3 overflow-hidden">
                                                                    {/* Sürükleme İkonu */}
                                                                    <div {...provided.dragHandleProps} className="text-outline-variant hover:text-on-surface cursor-grab active:cursor-grabbing">
                                                                        <span className="material-symbols-outlined text-lg">drag_indicator</span>
                                                                    </div>
                                                                    <div className="flex flex-col truncate pr-2">
                                                                        <span className="font-label-sm text-on-surface font-semibold truncate">{activity.organization}</span>
                                                                        <span className="text-xs text-outline truncate">{activity.role}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2 flex-shrink-0">
                                                                    <button onClick={() => handleEdit(activity)} type="button" className="material-symbols-outlined text-sm text-outline hover:text-secondary transition-colors cursor-pointer">
                                                                        edit
                                                                    </button>
                                                                    <button onClick={() => handleDelete(activity.id)} type="button" className="material-symbols-outlined text-sm text-outline hover:text-error transition-colors cursor-pointer">
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