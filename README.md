# ERP, IMS ve Entegrasyon Yazılımı Projesi

## İçindekiler
1. [Proje Hakkında](#proje-hakkında)
2. [Özellikler](#özellikler)
3. [Teknoloji Yığını](#teknoloji-yığını)
4. [Başlangıç](#başlangıç)
   - [Ön Koşullar](#ön-koşullar)
   - [Kurulum](#kurulum)
5. [Kullanım](#kullanım)
6. [API Dokümantasyonu](#api-dokümantasyonu)
7. [Veritabanı Şeması](#veritabanı-şeması)
8. [Katkıda Bulunma](#katkıda-bulunma)
9. [Test](#test)
10. [Dağıtım](#dağıtım)
11. [Sürüm Geçmişi](#sürüm-geçmişi)
12. [Lisans](#lisans)
13. [İletişim](#iletişim)

## Proje Hakkında

Bu proje, işletmelerin iş süreçlerini optimize etmelerine, envanterlerini etkili bir şekilde yönetmelerine ve çeşitli pazaryerleriyle entegrasyon sağlamalarına olanak tanıyan kapsamlı bir Kurumsal Kaynak Planlama (ERP), Envanter Yönetim Sistemi (IMS) ve Entegrasyon yazılımıdır.

## Özellikler

- Gelişmiş ERP ve IMS özellikleri
- Çoklu pazaryeri entegrasyonları
- Stok yönetimi ve takibi
- Satış ve satın alma yönetimi
- Müşteri ve tedarikçi ilişkileri yönetimi
- Raporlama ve analiz araçları
- Çok dilli destek
- Kullanıcı yetkilendirme ve rol bazlı erişim kontrolü

## Teknoloji Yığını

- **Backend**: Bun.js, Elysia.js
- **ORM**: Drizzle ORM
- **Veritabanı**: PostgreSQL
- **Önbellek**: Redis
- **Frontend**: (Planlanan) Next.js, Shadcn, v0.dev
- **Konteynerizasyon**: Docker, Docker Swarm
- **API Dokümantasyonu**: Swagger
- **Test**: (Planlanan) Jest
- **CI/CD**: (Planlanan) GitHub Actions

## Başlangıç

### Ön Koşullar

- Bun.js (v1.0.0 veya üzeri)
- Docker ve Docker Compose
- PostgreSQL (v14 veya üzeri)
- Redis (v6 veya üzeri)

### Kurulum

#### 1. Yöntem: Yerel Kurulum

1. Repoyu klonlayın:
   ```
   git clone https://github.com/vip-case/backend.git
   cd backend
   ```

2. Gerekli bağımlılıkları yükleyin:
   ```
   bun install
   ```

3. `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli çevresel değişkenleri ayarlayın:
   ```
   cp .env.example .env
   ```

4. Veritabanını ve tabloları oluşturun:
   ```
   bun run migrate
   ```

5. Uygulamayı başlatın:
   ```
   bun run dev
   ```

#### 2. Yöntem: Docker Compose ile Kurulum

1. Repoyu klonlayın:
   ```
   git clone https://github.com/vip-case/backend.git
   cd backend
   ```

2. `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli çevresel değişkenleri ayarlayın:
   ```
   cp .env.example .env
   ```

3. Docker Compose ile servisleri başlatın:
   ```
   docker-compose up -d
   ```

   Bu komut, uygulamanızı, PostgreSQL veritabanını ve Redis'i ayrı konteynerler içinde başlatacaktır.

4. Migrasyon işlemini çalıştırın:
   ```
   docker-compose exec app bun run migrate
   ```

   Bu komut, uygulama konteynerinde migrasyon scriptini çalıştırarak veritabanı şemanızı oluşturacak veya güncelleyecektir.

5. Uygulamaya erişim:
   Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

6. Servisleri durdurmak için:
   ```
   docker-compose down
   ```

   Eğer veritabanı ve Redis verilerini de silmek isterseniz:
   ```
   docker-compose down -v
   ```

## Kullanım

Uygulama başlatıldıktan sonra, `http://localhost:3000` adresinden API'ye erişebilirsiniz. API endpoint'leri ve kullanımları hakkında detaylı bilgi için [API Dokümantasyonu](#api-dokümantasyonu) bölümüne bakın.

## API Dokümantasyonu

API dokümantasyonuna `http://localhost:3000/api-docs` adresinden erişebilirsiniz. Bu dokümantasyon, tüm mevcut endpoint'leri, istek/yanıt formatlarını ve örnek kullanımları içerir.

## Veritabanı Şeması

Veritabanı şeması `src/data/schema` klasöründe bulunmaktadır. Her bir varlık (entity) için ayrı bir şema dosyası oluşturulmuştur.


## Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch'inizi oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Bir Pull Request oluşturun

## Test

Testleri çalıştırmak için:

```
bun test
```

## Dağıtım

Dağıtım adımları için `DEPLOYMENT.md` dosyasına bakın.

## Sürüm Geçmişi

- 0.1.0
    - İlk sürüm
    - Temel ERP ve IMS özellikleri eklendi

Tüm değişiklikler için [CHANGELOG.md](CHANGELOG.md) dosyasına bakın.

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## İletişim

 info@alirizaselcuk.com

Proje Linki: [https://github.com/vipcase/backend](https://github.com/vip-case/backend)
