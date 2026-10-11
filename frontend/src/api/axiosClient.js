import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

// 1. İSTEK GİTMEDEN ÖNCE: Token varsa ekle
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. CEVAP GELDİKTEN SONRA: Hata kontrolü ve otomatik temizlik (Kendi Kendini İyileştirme)
axiosClient.interceptors.response.use(
    (response) => {
        // Her şey yolundaysa cevabı direkt döndür
        return response;
    },
    (error) => {
        try {
            const { response } = error;

            // Eğer sunucu 401 (Yetkisiz) veya 500 (Token Süresi Dolmuş - JwtException) dönerse
            if (response && (response.status === 401 || response.status === 500)) {
                const token = localStorage.getItem('token');

                if (token) {
                    console.warn("Süresi dolmuş token tespit edildi. Otomatik temizleniyor...");
                    // Bozuk/Süresi dolmuş bileti çöpe at
                    localStorage.removeItem('token');

                    // Eğer kullanıcı admin panelinde değilse (ziyaretçi ekranındaysa),
                    // verilerin hatasız gelmesi için sayfayı arka planda sessizce bir kez yenile
                    if (!window.location.pathname.includes('/admin')) {
                        window.location.reload();
                    }
                }
            }
        } catch (e) {
            console.error("Interceptor hatası:", e);
        }

        return Promise.reject(error);
    }
);

export default axiosClient;