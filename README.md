# E-Commerce Microservices Application

Bu proje, modern bir e-ticaret platformu için mikroservis mimarisi kullanılarak geliştirilmiş bir uygulamadır.

## Teknolojiler

### Frontend
- React.js with TypeScript
- React Router v6 for routing
- Tailwind CSS for styling
- Context API for state management

### Backend
- Node.js microservices
- Docker & Docker Compose
- MongoDB (veritabanı)
- JWT authentication

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/AdnanKahveci/ecommerce-microservices.git
cd ecommerce-microservices
```

2. Docker'ı yükleyin (Windows/Mac/Linux için [Docker Desktop](https://www.docker.com/products/docker-desktop/))

3. Servisleri başlatın:
```bash
docker-compose up -d
```

4. Frontend uygulamasını başlatın:
```bash
cd frontend
npm install
npm run dev   
```

Uygulama şu adreslerde çalışacaktır:
- Frontend: http://localhost:3000
- User Service: http://localhost:3001
- Product Service: http://localhost:3002

## API Endpoints

### User Service (http://localhost:3001)
- POST /api/auth/register - Yeni kullanıcı kaydı
- POST /api/auth/login - Kullanıcı girişi
- GET /api/users/profile - Kullanıcı profili bilgileri
- PUT /api/users/profile - Profil güncelleme

### Product Service (http://localhost:3002)
- GET /api/products - Tüm ürünleri listele
- GET /api/products/:id - Ürün detayı
- POST /api/products - Yeni ürün ekle (Admin)
- PUT /api/products/:id - Ürün güncelle (Admin)
- DELETE /api/products/:id - Ürün sil (Admin)


## Varsayılan Admin Kullanıcısı

```
Email: admin@example.com
Password: admin123
```


