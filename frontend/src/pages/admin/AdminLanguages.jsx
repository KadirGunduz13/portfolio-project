import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

export default function AdminLanguages() {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', level: '' });

    const fetchLanguages = async () => {
        try {
            const response = await axiosClient.get('/languages');
            setLanguages(response.data);
        } catch (error) {
            console.error("Diller çekilirken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLanguages();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axiosClient.put(`/languages/${editingId}`, formData);
            } else {
                await axiosClient.post('/languages', formData);
            }
            setIsModalOpen(false);
            setFormData({ name: '', level: '' });
            setEditingId(null);
            fetchLanguages();
        } catch (error) {
            alert("İşlem sırasında bir hata oluştu.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bu dili silmek istediğinize emin misiniz?")) {
            try {
                await axiosClient.delete(`/languages/${id}`);
                fetchLanguages();
            } catch (error) {
                alert("Silme işlemi başarısız.");
            }
        }
    };

    const openEditModal = (lang) => {
        setFormData({ name: lang.name, level: lang.level });
        setEditingId(lang.id);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setFormData({ name: '', level: '' });
        setEditingId(null);
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-8 text-on-surface">Yükleniyor...</div>;

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto text-on-surface">
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-headline-md text-3xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary">translate</span>
                    Dil Yönetimi
                </h1>
                <button
                    onClick={openAddModal}
                    className="bg-primary text-on-primary px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all font-semibold"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Yeni Dil Ekle
                </button>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm">
                {languages.length === 0 ? (
                    <div className="p-8 text-center text-outline-variant">Henüz bir dil eklenmemiş.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-surface-container border-b border-outline-variant/20 text-on-surface-variant font-label-lg">
                            <th className="p-4">Dil Adı</th>
                            <th className="p-4">Seviye</th>
                            <th className="p-4 text-right">İşlemler</th>
                        </tr>
                        </thead>
                        <tbody>
                        {languages.map((lang) => (
                            <tr key={lang.id} className="border-b border-outline-variant/10 hover:bg-surface-container-high/30 transition-colors">
                                <td className="p-4 font-semibold">{lang.name}</td>
                                <td className="p-4">
                                        <span className="px-3 py-1 bg-tertiary/10 text-tertiary rounded-full text-sm font-semibold border border-tertiary/20">
                                            {lang.level}
                                        </span>
                                </td>
                                <td className="p-4 flex justify-end gap-2">
                                    <button onClick={() => openEditModal(lang)} className="p-2 bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-colors">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(lang.id)} className="p-2 bg-error/10 text-error rounded hover:bg-error/20 transition-colors">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-surface-container border border-outline-variant/20 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">{editingId ? 'Dili Düzenle' : 'Yeni Dil Ekle'}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Dil Adı (Örn: İngilizce, Almanca)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-surface px-4 py-2 rounded-lg border border-outline-variant/30 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Seviye (Örn: B2, İleri Seviye, Anadil)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.level}
                                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                                    className="w-full bg-surface px-4 py-2 rounded-lg border border-outline-variant/30 focus:border-primary outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors">
                                    İptal
                                </button>
                                <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-colors font-semibold">
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}