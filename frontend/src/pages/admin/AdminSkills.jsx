import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

export default function AdminSkills() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', level: 'Orta' });

    // Verileri Getir
    const fetchSkills = async () => {
        try {
            const response = await axiosClient.get('/skills');
            setSkills(response.data);
        } catch (error) {
            console.error("Yetenekler çekilirken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    // Formu Gönder (Ekle veya Güncelle)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axiosClient.put(`/skills/${editingId}`, formData);
            } else {
                await axiosClient.post('/skills', formData);
            }
            setIsModalOpen(false);
            setFormData({ name: '', level: 'Orta' }); // percentage yerine level sıfırlandı
            setEditingId(null);
            fetchSkills(); // Listeyi yenile
        } catch (error) {
            alert("İşlem sırasında bir hata oluştu.");
        }
    };

    // Silme İşlemi
    const handleDelete = async (id) => {
        if (window.confirm("Bu yeteneği silmek istediğinize emin misiniz?")) {
            try {
                await axiosClient.delete(`/skills/${id}`);
                fetchSkills();
            } catch (error) {
                alert("Silme işlemi başarısız.");
            }
        }
    };

    // Düzenleme Modu
    const openEditModal = (skill) => {
        setFormData({ name: skill.name, level: skill.level }); // percentage yerine level atandı
        setEditingId(skill.id);
        setIsModalOpen(true);
    };

    // Yeni Ekleme Modu
    const openAddModal = () => {
        setFormData({ name: '', level: 'Orta' }); // percentage yerine level sıfırlandı
        setEditingId(null);
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-8 text-on-surface">Yükleniyor...</div>;

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto text-on-surface">
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-headline-md text-3xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">code</span>
                    Yetenek Yönetimi
                </h1>
                <button
                    onClick={openAddModal}
                    className="bg-primary text-on-primary px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all font-semibold"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Yeni Yetenek Ekle
                </button>
            </div>

            {/* Yetenekler Listesi */}
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm">
                {skills.length === 0 ? (
                    <div className="p-8 text-center text-outline-variant">Henüz bir yetenek eklenmemiş.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-surface-container border-b border-outline-variant/20 text-on-surface-variant font-label-lg">
                            <th className="p-4">Yetenek Adı</th>
                            <th className="p-4">Seviye</th>
                            <th className="p-4 text-right">İşlemler</th>
                        </tr>
                        </thead>
                        <tbody>
                        {skills.map((skill) => (
                            <tr key={skill.id} className="border-b border-outline-variant/10 hover:bg-surface-container-high/30 transition-colors">
                                <td className="p-4 font-semibold">{skill.name}</td>

                                {/* Çubuk yerine metin seviyesi gösteriliyor */}
                                <td className="p-4 font-semibold text-primary">{skill.level}</td>

                                <td className="p-4 flex justify-end gap-2">
                                    <button onClick={() => openEditModal(skill)} className="p-2 bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-colors">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(skill.id)} className="p-2 bg-error/10 text-error rounded hover:bg-error/20 transition-colors">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal (Ekle/Düzenle) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-surface-container border border-outline-variant/20 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">{editingId ? 'Yeteneği Düzenle' : 'Yeni Yetenek Ekle'}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Yetenek Adı (Örn: Java, React)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-surface px-4 py-2 rounded-lg border border-outline-variant/30 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Seviye</label>
                                <select
                                    required
                                    value={formData.level}
                                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                                    className="w-full bg-surface px-4 py-2 rounded-lg border border-outline-variant/30 focus:border-primary outline-none"
                                >
                                    <option value="Temel">Temel</option>
                                    <option value="Orta">Orta</option>
                                    <option value="İyi">İyi</option>
                                    <option value="Çok İyi">Çok İyi</option>
                                </select>
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