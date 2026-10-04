import axios from 'axios';

const axiosClient = axios.create({
    // VITE ortam değişkenlerinden API adresini çeker. Eğer bulamazsa (geliştirme ortamında) localhost'u kullanır.
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

// Her istekten önce çalışır: LocalStorage'da token varsa isteğe ekler
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;