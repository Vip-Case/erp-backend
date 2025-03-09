# Geliştirici Kılavuzu

Bu belge, Novent ERP & IMS Backend projesine katkıda bulunmak isteyen geliştiriciler için rehber niteliğindedir.

## Geliştirme Ortamı Kurulumu

### Gereksinimler

- [Bun](https://bun.sh/) >= 1.0.0
- [Node.js](https://nodejs.org/) >= 18.0.0
- [PostgreSQL](https://www.postgresql.org/) >= 14
- [Redis](https://redis.io/) >= 6.0
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) ve [Docker Compose](https://docs.docker.com/compose/) (opsiyonel)

### Kurulum Adımları

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

4. `.env` dosyasını düzenleyerek gerekli ortam değişkenlerini ayarlayın:

   ```
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   PORT=1303
   NODE_ENV=development
   API_VERSION=v1
   CORS_URL=http://localhost:3000
   CRITICAL_STOCK_LEVEL=20
   WARNING_STOCK_LEVEL=50
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/erp_db?schema=public
   ```

5. PostgreSQL veritabanını oluşturun:

   ```bash
   createdb erp_db
   ```

6. Veritabanı şemasını oluşturun:

   ```bash
   bunx prisma migrate dev
   ```

7. Seed verilerini yükleyin:

   ```bash
   bunx prisma db seed
   ```

8. Uygulamayı başlatın:

   ```bash
   bun dev
   ```

9. Tarayıcınızda `http://localhost:1303/docs` adresine giderek Swagger UI üzerinden API'yi test edebilirsiniz.

### Docker ile Geliştirme

Docker kullanarak geliştirme yapmak isterseniz:

1. Docker Compose ile servisleri başlatın:

   ```bash
   docker-compose up -d
   ```

2. Veritabanı migration ve seed işlemlerini çalıştırın:

   ```bash
   docker-compose exec api bunx prisma migrate dev
   docker-compose exec api bunx prisma db seed
   ```

3. Logları izleyin:
   ```bash
   docker-compose logs -f api
   ```

## Kod Yapısı

### Dizin Yapısı

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
│   │   ├── abstracts/      # Soyut servis sınıfları
│   │   └── concrete/       # Somut servis uygulamaları
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

### Mimari

Proje, katmanlı mimari prensiplerine göre tasarlanmıştır:

1. **Controller Katmanı**: API rotaları ve endpoint'leri (`src/api/routes`)
2. **Servis Katmanı**: İş mantığı (`src/services`)
3. **Repository Katmanı**: Veritabanı işlemleri (`src/repositories`)
4. **Model Katmanı**: Veri modelleri (`src/models` ve `prisma/schema.prisma`)

## Geliştirme Kuralları

### Kod Stili

- TypeScript tip güvenliği için her zaman tip tanımlamaları kullanın.
- Sınıf ve fonksiyon adları için PascalCase kullanın.
- Değişken ve metot adları için camelCase kullanın.
- Sabitler için UPPER_SNAKE_CASE kullanın.
- Dosya adları için kebab-case kullanın.

### Commit Mesajları

Commit mesajları için [Conventional Commits](https://www.conventionalcommits.org/) standardını kullanın:

- `feat`: Yeni bir özellik
- `fix`: Hata düzeltmesi
- `docs`: Dokümantasyon değişiklikleri
- `style`: Kod stilini etkileyen değişiklikler (boşluk, format, noktalama vb.)
- `refactor`: Hata düzeltmesi veya özellik eklemeyen kod değişiklikleri
- `perf`: Performans iyileştirmeleri
- `test`: Test ekleme veya düzenleme
- `chore`: Yapılandırma, derleme süreci vb. değişiklikler

Örnek:

```
feat: Stok kartı arama özelliği eklendi
fix: Fatura oluşturma sırasında vergi hesaplama hatası düzeltildi
```

### Branching Stratejisi

- `main`: Üretim ortamı için kararlı sürüm
- `develop`: Geliştirme ortamı için entegrasyon branch'i
- `feature/*`: Yeni özellikler için
- `bugfix/*`: Hata düzeltmeleri için
- `hotfix/*`: Acil üretim hataları için

### Pull Request Süreci

1. Yeni bir branch oluşturun (`feature/new-feature` veya `bugfix/issue-fix`).
2. Değişikliklerinizi yapın ve commit edin.
3. Branch'inizi push edin.
4. GitHub üzerinden Pull Request oluşturun.
5. Code review sürecini bekleyin.
6. Onay aldıktan sonra, PR'ınız merge edilecektir.

## Veritabanı Şeması

Veritabanı şeması Prisma ORM kullanılarak `prisma/schema.prisma` dosyasında tanımlanmıştır. Şema değişiklikleri yapmak için:

1. `prisma/schema.prisma` dosyasını düzenleyin.
2. Migration oluşturun:
   ```bash
   bunx prisma migrate dev --name migration_name
   ```
3. Prisma client'ı güncelleyin:
   ```bash
   bunx prisma generate
   ```

## API Geliştirme

Yeni bir API endpoint'i eklemek için:

1. `src/api/routes/v1` dizininde yeni bir route dosyası oluşturun veya mevcut bir dosyayı düzenleyin.
2. Gerekirse `src/services` dizininde yeni bir servis oluşturun.
3. Gerekirse `src/interfaces` dizininde yeni arayüzler tanımlayın.
4. `src/index.ts` dosyasında yeni route'u kaydedin.

Örnek route dosyası:

```typescript
// src/api/routes/v1/exampleRoutes.ts
import { Elysia } from "elysia";
import { ExampleService } from "../../../services/concrete/exampleService";

const exampleService = new ExampleService();

export default function ExampleRoutes(app: Elysia) {
  return app.group("/example", (app) =>
    app
      .get("/", async () => {
        return await exampleService.getAll();
      })
      .get("/:id", async ({ params: { id } }) => {
        return await exampleService.getById(parseInt(id));
      })
      .post("/", async ({ body }) => {
        return await exampleService.create(body);
      })
      .put("/:id", async ({ params: { id }, body }) => {
        return await exampleService.update(parseInt(id), body);
      })
      .delete("/:id", async ({ params: { id } }) => {
        return await exampleService.delete(parseInt(id));
      })
  );
}
```

## Test

### Birim Testleri

Birim testleri için [Bun Test](https://bun.sh/docs/cli/test) kullanılmaktadır:

```typescript
// src/tests/example.test.ts
import { test, expect } from "bun:test";
import { ExampleService } from "../services/concrete/exampleService";

test("ExampleService.getAll should return an array", async () => {
  const service = new ExampleService();
  const result = await service.getAll();
  expect(Array.isArray(result)).toBe(true);
});
```

Testleri çalıştırmak için:

```bash
bun test
```

### Entegrasyon Testleri

Entegrasyon testleri için [Supertest](https://github.com/ladjs/supertest) kullanılmaktadır:

```typescript
// src/tests/integration/example.test.ts
import { test, expect } from "bun:test";
import { app } from "../../index";
import supertest from "supertest";

test("GET /example should return 200", async () => {
  const response = await supertest(app.fetch).get("/example");
  expect(response.status).toBe(200);
});
```

## Logging

Uygulama, [Pino](https://getpino.io/) kullanarak loglama yapmaktadır. Logları kullanmak için:

```typescript
import logger from "../utils/logger";

logger.info("Bilgi mesajı");
logger.error("Hata mesajı", { error });
logger.debug("Debug mesajı", { data });
```

## Hata Yönetimi

Uygulama, özel hata sınıfları kullanarak hata yönetimi yapmaktadır:

```typescript
import {
  CustomError,
  NotFoundError,
  ValidationError,
} from "../utils/CustomError";

// Özel hata fırlatma
throw new NotFoundError("Kayıt bulunamadı");
throw new ValidationError("Geçersiz veri", {
  field: "name",
  message: "İsim alanı zorunludur",
});
```

## Performans İpuçları

1. **N+1 Sorunu**: İlişkisel verileri çekerken, Prisma'nın `include` özelliğini kullanarak tek sorguda ilişkili verileri çekin.
2. **Sayfalama**: Büyük veri setleri için her zaman sayfalama kullanın.
3. **İndeksleme**: Sık sorgulanan alanlar için veritabanı indeksleri oluşturun.
4. **Önbellek**: Redis kullanarak sık erişilen verileri önbelleğe alın.
5. **Asenkron İşlemler**: Uzun süren işlemleri asenkron olarak gerçekleştirin.

## Sorun Giderme

### Yaygın Hatalar

1. **Prisma Bağlantı Hataları**: `.env` dosyasındaki `DATABASE_URL` değerini kontrol edin.
2. **Redis Bağlantı Hataları**: Redis sunucusunun çalıştığından ve `.env` dosyasındaki Redis ayarlarının doğru olduğundan emin olun.
3. **JWT Hataları**: `.env` dosyasındaki `JWT_SECRET` ve `REFRESH_TOKEN_SECRET` değerlerini kontrol edin.

### Debug Modu

Debug modunda çalıştırmak için:

```bash
bun debug
```

Bu, Node.js inspector protokolünü etkinleştirir ve Chrome DevTools ile debug yapmanıza olanak tanır.

## Yardımcı Kaynaklar

- [Elysia.js Dokümantasyonu](https://elysiajs.com/)
- [Prisma Dokümantasyonu](https://www.prisma.io/docs/)
- [Bun Dokümantasyonu](https://bun.sh/docs)
- [TypeScript Dokümantasyonu](https://www.typescriptlang.org/docs/)
