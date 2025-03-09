# Novent ERP & IMS Backend

Bu proje, Novent ERP (Kurumsal Kaynak Planlama) ve IMS (Envanter Yönetim Sistemi) uygulamasının backend kısmıdır. Bun.js ve Elysia.js framework'ü kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- **Stok Yönetimi**: Stok kartları, stok hareketleri, depo yönetimi
- **Cari Hesap Yönetimi**: Müşteri ve tedarikçi yönetimi, cari hareketler
- **Fatura Yönetimi**: Satış, alış ve iade faturaları
- **Sipariş Yönetimi**: Sipariş oluşturma, takip ve faturalaştırma
- **Kasa ve Banka Yönetimi**: Nakit akışı, banka hareketleri
- **Kullanıcı ve Yetki Yönetimi**: Rol tabanlı erişim kontrolü
- **E-Ticaret Entegrasyonu**: WooCommerce entegrasyonu
- **Bildirim Sistemi**: Düşük stok bildirimleri ve diğer uyarılar
- **Raporlama**: Satış, stok ve finansal raporlar

## 🛠️ Teknolojiler

- **Bun.js**: Hızlı JavaScript/TypeScript runtime
- **Elysia.js**: Yüksek performanslı web framework
- **Prisma ORM**: Veritabanı erişimi ve modelleme
- **PostgreSQL**: Ana veritabanı
- **Redis**: Önbellek ve oturum yönetimi
- **Docker**: Konteynerizasyon ve dağıtım
- **Azure**: Cloud hosting ve servisler

## 📋 Gereksinimler

- Bun >= 1.0.0
- Node.js >= 18.0.0
- PostgreSQL >= 14
- Redis >= 6.0
- Docker ve Docker Compose (opsiyonel)

## 🔧 Kurulum

### Yerel Geliştirme Ortamı

1. Repoyu klonlayın:

   ```bash
   git clone https://github.com/your-username/erp-backend.git
   cd erp-backend
   ```

2. Bağımlılıkları yükleyin:

   ```bash
   bun install
   ```

3. `.env` dosyasını oluşturun:

   ```bash
   cp .env.example .env
   ```

4. `.env` dosyasını düzenleyerek gerekli ortam değişkenlerini ayarlayın.

5. Veritabanını oluşturun ve migrate edin:

   ```bash
   bunx prisma migrate dev
   ```

6. Uygulamayı başlatın:
   ```bash
   bun dev
   ```

### Docker ile Kurulum

1. Docker Compose ile tüm servisleri başlatın:

   ```bash
   docker-compose up -d
   ```

2. Veritabanı migration çalıştırın:
   ```bash
   docker-compose exec api bunx prisma migrate dev
   ```

## 🚢 Deployment

### Azure App Service Deployment

1. Azure CLI ile giriş yapın:

   ```bash
   az login
   ```

2. Azure Container Registry'ye push yapın:

   ```bash
   az acr login --name noventacr
   docker build -t noventacr.azurecr.io/erp-api:latest .
   docker push noventacr.azurecr.io/erp-api:latest
   ```

3. App Service'i güncelleyin:
   ```bash
   az webapp config container set --name novent-erp-api --resource-group novent-erp-rg --docker-custom-image-name noventacr.azurecr.io/erp-api:latest
   ```

## 📁 Proje Yapısı

```
erp-backend/
├── src/                    # Kaynak kodlar
│   ├── api/                # API endpoint'leri
│   │   └── routes/         # Route tanımlamaları
│   ├── config/             # Konfigürasyon dosyaları
│   ├── interfaces/         # TypeScript arayüzleri
│   ├── middleware/         # Middleware fonksiyonları
│   ├── models/             # Veri modelleri
│   ├── repositories/       # Veritabanı işlemleri
│   ├── services/           # İş mantığı servisleri
│   ├── types/              # Tip tanımlamaları
│   ├── utils/              # Yardımcı fonksiyonlar
│   └── index.ts            # Uygulama giriş noktası
├── prisma/                 # Prisma şemaları ve migration'lar
├── azure/                  # Azure deployment konfigürasyonları
├── scripts/                # Yardımcı scriptler
├── logs/                   # Log dosyaları
├── docker-compose.yml      # Docker Compose konfigürasyonu
├── Dockerfile              # Docker imaj tanımı
└── package.json            # Proje bağımlılıkları
```

## 🔒 Güvenlik

- JWT tabanlı kimlik doğrulama
- Rol tabanlı yetkilendirme
- Azure Key Vault ile hassas bilgilerin korunması
- HTTPS zorunluluğu
- Rate limiting

## 📝 API Dokümantasyonu

API dokümantasyonu Swagger UI ile sağlanmaktadır. Uygulama çalışırken `/docs` endpoint'ine giderek API dokümantasyonuna erişebilirsiniz.

## 🧪 Test

```bash
bun test
```

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın
