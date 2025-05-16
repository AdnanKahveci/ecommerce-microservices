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

### Product Service (http://localhost:3002)

#### Ürün (Product)
- GET    /api/products/                → Tüm ürünleri listele
- GET    /api/products/{product_id}    → Ürün detayı
- POST   /api/products/                → Yeni ürün ekle (Admin)
- PUT    /api/products/{product_id}    → Ürün güncelle (Admin)
- DELETE /api/products/{product_id}    → Ürün sil (Admin)

#### Sepet (Cart)
- GET    /api/cart/                    → Kullanıcının sepetini getir
- POST   /api/cart/items/              → Sepete ürün ekle
- DELETE /api/cart/items/{item_id}     → Sepetten ürün çıkar
- DELETE /api/cart/                    → Sepeti tamamen temizle

#### Sipariş (Order)
- POST   /api/orders/                  → Sipariş oluştur
- GET    /api/orders/                  → Kullanıcının siparişlerini getir
- GET    /api/orders/{order_id}        → Sipariş detayı
- PUT    /api/orders/{order_id}/status → Sipariş durumunu güncelle (Admin)

### User Service (http://localhost:3001)
- POST /api/auth/register              → Yeni kullanıcı kaydı
- POST /api/auth/login                 → Kullanıcı girişi
- GET  /api/users/profile              → Kullanıcı profili bilgileri
- PUT  /api/users/profile              → Profil güncelleme

## Varsayılan Admin Kullanıcısı

```
Email: admin@example.com
Password: admin123
```


