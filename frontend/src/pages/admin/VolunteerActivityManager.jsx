import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axiosClient from '../../api/axiosClient';

export default function VolunteerActivityManager() {
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            organization: '', role: '', startDate: '', endDate: '', description: '', images: []
        }
    });

    const [activities, setActivities] = useState([]);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [editingId, setEditingId] = useState(null);

    // Formdaki resimleri anlık izlemek için
    const currentImages = watch('images') || [];

    useEffect(() => { fetchActivities(); }, []);

    const fetchActivities = async () => {
        try {
            const response = await axiosClient.get('/volunteer-activities');
            setActivities(response.data || []);
        } catch (error) { console.error("Veriler çekilemedi:", error); }
    };

    // Görselleri Base64 formatına çeviren fonksiyon
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        Promise.all(files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        })).then(base64Images => {
            setValue('images', [...currentImages, ...base64Images]);
        });
    };

    const removeImage = (indexToRemove) => {
        setValue('images', currentImages.filter((_, index) => index !== indexToRemove));
    };

    const onSubmit = async (data) => {
        try {
            setStatusMsg({ type: 'info', text: 'İşleniyor...' });
            if (editingId) {
                await axiosClient.put(`/volunteer-activities/${editingId}`, data);
                setStatusMsg({ type: 'success', text: 'Güncellendi!' });
            } else {
                await axiosClient.post('/volunteer-activities', data);
                setStatusMsg({ type: 'success', text: 'Eklendi!' });
            }
            setEditingId(null);
            fetchActivities();
            reset();
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (error) { setStatusMsg({ type: 'error', text: 'Hata oluştu.' }); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Silmek istediğinize emin misiniz?')) return;
        try {
            await axiosClient.delete(`/volunteer-activities/${id}`);
            fetchActivities();
            if (editingId === id) { setEditingId(null); reset(); }
        } catch (error) { alert('Hata oluştu.'); }
    };

    const handleEdit = (activity) => {
        setEditingId(activity.id);
        Object.keys(activity).forEach(key => setValue(key, activity[key]));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        const items = Array.from(activities);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setActivities(items);
        try {
            const orderedIds = items.map(item => item.id);
            await axiosClient.put('/volunteer-activities/update-order', orderedIds);
        } catch (error) { fetchActivities(); }
    };

    return (
        <div className="flex flex-col w-full">
            <div className="relative w-full max-w-7xl mx-auto px-space-md sm:px-space-xl py-space-xl flex flex-col gap-space-xl">

                {/* Üst Başlık Kısmı */}
                <div className="flex flex-col gap-1 mb-4">
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Gönüllülük Faaliyetleri</h1>
                </div>

                {statusMsg.text && <div className="p-4 rounded-lg bg-surface-container-high text-on-surface">{statusMsg.text}</div>}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                    {/* FORM ALANI */}
                    <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 flex flex-col rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <div className="p-space-lg flex flex-col gap-space-md">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-on-surface">Kurum</label>
                                    <input {...register('organization', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/10 text-on-surface focus:ring-2 focus:ring-secondary/40" placeholder="Örn: Teknofest Kulübü" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-on-surface">Rol</label>
                                    <input {...register('role', { required: true })} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/10 text-on-surface focus:ring-2 focus:ring-secondary/40" placeholder="Örn: Takım Kaptanı" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-on-surface">Başlangıç Tarihi</label>
                                    <input {...register('startDate')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/10 text-on-surface focus:ring-2 focus:ring-secondary/40" placeholder="Örn: 20 Ağustos 2026" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-on-surface">Bitiş Tarihi <span className="text-outline text-xs">(Opsiyonel)</span></label>
                                    <input {...register('endDate')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/10 text-on-surface focus:ring-2 focus:ring-secondary/40" placeholder="Boş bırakılırsa: Devam Ediyor" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="font-label-md text-on-surface">Açıklama</label>
                                <textarea {...register('description')} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/10 text-on-surface focus:ring-2 focus:ring-secondary/40 resize-y" rows="3"></textarea>
                            </div>

                            {/* GÖRSEL YÜKLEME ALANI */}
                            <div className="flex flex-col gap-2 mt-2 p-4 rounded-xl border border-dashed border-outline-variant/50 bg-surface-container-lowest/50">
                                <label className="font-label-md text-on-surface flex justify-between items-center">
                                    <span>Görseller <span className="text-outline text-xs">(İsteğe Bağlı - Maks 1MB önerilir)</span></span>
                                    <label className="cursor-pointer px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-md text-xs hover:bg-secondary hover:text-on-secondary transition-colors">
                                        + Görsel Seç
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                </label>

                                {currentImages.length > 0 && (
                                    <div className="flex flex-wrap gap-3 mt-2">
                                        {currentImages.map((imgSrc, index) => (
                                            <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden border border-outline-variant/30 group">
                                                <img src={imgSrc} alt="Önizleme" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-error text-on-error w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-[12px]">close</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>

                        <div className="flex justify-end gap-3 px-space-lg py-space-md bg-surface-container-high/30 border-t border-outline-variant/20">
                            {editingId && <button type="button" onClick={() => {setEditingId(null); reset();}} className="px-6 py-2.5 rounded-lg bg-surface-container-high text-on-surface">İptal</button>}
                            <button type="submit" className="px-6 py-2.5 rounded-lg bg-secondary text-on-secondary shadow-lg">
                                {editingId ? 'Güncelle' : 'Kaydet'}
                            </button>
                        </div>
                    </form>

                    {/* SÜRÜKLE BIRAK DESTEKLİ LİSTELEME ALANI (Öncekiyle Aynı) */}
                    <div className="lg:col-span-5 flex flex-col gap-space-md sticky top-24">
                        <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20">
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="volunteer-activities">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-2 max-h-[450px] overflow-y-auto">
                                            {activities.map((activity, index) => (
                                                <Draggable key={String(activity.id)} draggableId={String(activity.id)} index={index}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} className="flex items-center justify-between p-3 rounded-xl border bg-surface-container border-outline-variant/10">
                                                            <div className="flex items-center gap-3">
                                                                <div {...provided.dragHandleProps} className="text-outline-variant cursor-grab"><span className="material-symbols-outlined">drag_indicator</span></div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-semibold text-on-surface">{activity.organization}</span>
                                                                    <span className="text-xs text-outline">{activity.role}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button onClick={() => handleEdit(activity)} type="button" className="text-outline hover:text-secondary"><span className="material-symbols-outlined text-sm">edit</span></button>
                                                                <button onClick={() => handleDelete(activity.id)} type="button" className="text-outline hover:text-error"><span className="material-symbols-outlined text-sm">delete</span></button>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}