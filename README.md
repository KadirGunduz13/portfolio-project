<div align="center">

# 🚀 Full-Stack Geliştirici Portfolyo & Yönetim Sistemi

**Modern web teknolojileri kullanılarak geliştirilmiş, sürükle-bırak destekli dinamik admin paneline sahip tam kapsamlı (full-stack) kişisel portfolyo uygulaması.**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

</div>

---

## 📖 Proje Hakkında

Bu proje, bir yazılım geliştiricisinin yeteneklerini, projelerini, eğitimini ve iş deneyimlerini sergilemesi için tasarlanmış statik olmayan, tamamen dinamik bir web uygulamasıdır. İçeriklerin koda dokunulmadan yönetilebilmesi için özel bir **Admin Paneli** (İçerik Yönetim Sistemi - CMS) entegre edilmiştir. 

Masaüstü ve mobil cihazlarda kusursuz çalışan modern bir arayüze, yüksek güvenlikli JWT kimlik doğrulamasına ve IP tabanlı spam korumasına sahip iletişim altyapısına sahiptir.

---

## ✨ Öne Çıkan Özellikler

* 🛠️ **Dinamik İçerik Yönetimi (Admin Paneli):** Projeler, Deneyimler, Eğitimler, Sertifikalar, Yetenekler ve Diller modüllerinde tam CRUD (Oluşturma, Okuma, Güncelleme, Silme) desteği.
* 🖱️ **Sürükle ve Bırak (Drag & Drop):** React `@hello-pangea/dnd` entegrasyonu sayesinde admin panelinde tüm içeriklerin sıralamasını anlık olarak değiştirme özelliği.
* 🔒 **Gelişmiş Güvenlik:** JWT (JSON Web Token) tabanlı oturum yönetimi ve BCrypt ile şifrelenmiş admin kimlik doğrulaması. Otomatik veritabanı tohumlama (Data Initializer) ile güvenli hesap oluşturma.
* 📧 **Anti-Spam İletişim Formu:** Ziyaretçi iletişim formunda IP tabanlı Hız Sınırı (Rate Limiting) uygulanarak (24 saat kuralı) spam mesajların önüne geçilmiş ve SMTP ile otomatik e-posta bildirimleri entegre edilmiştir.
* 📱 **Tam Duyarlı (Responsive) Tasarım:** Tailwind CSS ile "Mobile First" (Önce Mobil) yaklaşımıyla tasarlanmış, her ekrana kusursuz uyum sağlayan modern karanlık tema (Dark UI).
* ☁️ **Canlı Bulut Mimarisi:** Frontend **Vercel**'de, Backend **Render**'da, Veritabanı ise **Neon.tech (Serverless PostgreSQL)** üzerinde yüksek erişilebilirlikle çalışmaktadır.

---

## 📸 Ekran Görüntüleri

### 💻 Ziyaretçi Arayüzü (Ana Sayfa)
> *Hareketli terminal efekti, projeler, deneyimler ve yeteneklerin listelendiği modern ziyaretçi ekranı.*
> <img width="1917" height="907" alt="image" src="https://github.com/user-attachments/assets/fa2f8ed3-6ba6-4de3-85ac-cfd87574f7c2" />


### ⚙️ Yönetim Paneli (Admin Dashboard)
> *İçeriklerin yönetildiği, güvenli ve kullanıcı dostu admin paneli.*
> <img width="1917" height="902" alt="image" src="https://github.com/user-attachments/assets/fb88fd44-9a40-427d-b296-1643edda2b78" />


### 📱 Mobil Görünüm
> *Responsive tasarım ve özel mobil Hamburger menü görünümü.*
> <img width="446" height="792" alt="image" src="https://github.com/user-attachments/assets/eb1f42a1-7ca8-4a4a-a44d-4af511b079ed" />


---

## 🛠️ Kullanılan Teknolojiler

### Frontend (İstemci)
* **Framework:** React.js (Vite ile oluşturuldu)
* **Stil:** Tailwind CSS
* **Form Yönetimi:** React Hook Form
* **HTTP İstemcisi:** Axios
* **Sürükle & Bırak:** @hello-pangea/dnd
* **Yönlendirme:** React Router Dom

### Backend (Sunucu)
* **Dil & Framework:** Java 17, Spring Boot 3.x
* **Güvenlik:** Spring Security, JWT (JSON Web Tokens)
* **Veritabanı Etkileşimi:** Spring Data JPA, Hibernate
* **Veritabanı:** PostgreSQL (Neon.tech)

---

## ⚙️ Kurulum ve Çalıştırma (Yerel Geliştirme)

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

### Ön Koşullar
* Node.js (v18+)
* Java (JDK 17+)
* Maven
* PostgreSQL

### 1. Depoyu Klonlayın
```bash
git clone [https://github.com/](https://github.com/)<KULLANICI_ADIN>/portfolio-project.git
cd portfolio-project
```

### 2. Backend Kurulumu
1. `backend` klasörüne gidin.
2. `src/main/resources/application.yml` (veya `.properties`) dosyasını kendi PostgreSQL veritabanı bilgilerinize göre düzenleyin.
3. Çevresel değişkenleri ayarlayın (Bkz. Çevresel Değişkenler tablosu).
4. Projeyi derleyin ve çalıştırın:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
*(Backend varsayılan olarak `http://localhost:8080` portunda çalışacaktır.)*

### 3. Frontend Kurulumu
1. `frontend` klasörüne gidin.
2. Gerekli paketleri yükleyin:
```bash
cd frontend
npm install
```
3. `.env` dosyası oluşturup backend URL'sini belirtin: `VITE_API_BASE_URL=http://localhost:8080/api`
4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```
*(Frontend varsayılan olarak `http://localhost:5173` portunda çalışacaktır.)*

## 🔐 Çevresel Değişkenler (Environment Variables)

Uygulamanın güvenli çalışması için aşağıdaki değişkenlerin sisteminizde (veya .env dosyasında) tanımlı olması gerekir:

| Değişken Adı | Açıklama | Nerede Kullanılır? |
| :--- | :--- | :--- |
| `DB_URL` | PostgreSQL veritabanı bağlantı adresi (Neon URL) | Backend |
| `DB_USERNAME` | Veritabanı kullanıcı adı | Backend |
| `DB_PASSWORD` | Veritabanı şifresi | Backend |
| `ADMIN_USERNAME` | Admin paneli giriş kullanıcı adı | Backend (DataInitializer) |
| `ADMIN_PASSWORD` | Admin paneli giriş şifresi | Backend (DataInitializer) |
| `JWT_SECRET` | Token imzalamak için güçlü şifreleme anahtarı | Backend |
| `VITE_API_BASE_URL` | Spring Boot API'sinin kök URL adresi | Frontend |

---

## 👨‍‍💻 Geliştirici

**Kadir Gündüz**  
*Yazılım Mühendisliği Öğrencisi*

* **LinkedIn:** [Profilime Git](https://linkedin.com/in/kadir-gündüz)
* **GitHub:** [Profilime Git](https://github/KadirGunduz13)
* **E-Posta:** kdrgndz203@gmail.com

---
*Bu proje modern web geliştirme süreçlerini, güvenli API entegrasyonlarını ve baştan sona (End-to-End) canlıya alma mimarilerini deneyimlemek amacıyla geliştirilmiştir.*
