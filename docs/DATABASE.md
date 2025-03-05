# Veritabanı Dokümantasyonu

Bu belge, Novent ERP & IMS Backend uygulamasının veritabanı yapısını ve yönetimini açıklamaktadır.

## Genel Bakış

Uygulama, PostgreSQL veritabanı kullanmaktadır ve veritabanı şeması Prisma ORM ile yönetilmektedir. Veritabanı şeması, `prisma/schema.prisma` dosyasında tanımlanmıştır.

## Veritabanı Modelleri

### Ana Modeller

#### Stok Yönetimi

- **StockCard**: Stok kartları
- **StockCardCategory**: Stok kartı kategorileri
- **StockCardAttribute**: Stok kartı özellikleri
- **StockCardBarcode**: Stok kartı barkodları
- **StockMovement**: Stok hareketleri
- **Warehouse**: Depolar
- **StockCardWarehouse**: Stok kartı-depo ilişkisi
- **StockTake**: Stok sayımları

#### Cari Hesap Yönetimi

- **Current**: Cari hesaplar (müşteri/tedarikçi)
- **CurrentCategory**: Cari hesap kategorileri
- **CurrentAddress**: Cari hesap adresleri
- **CurrentMovement**: Cari hesap hareketleri
- **CurrentFinancial**: Cari hesap finansal bilgileri

#### Fatura ve Sipariş Yönetimi

- **Invoice**: Faturalar
- **InvoiceDetail**: Fatura detayları
- **Order**: Siparişler
- **OrderItem**: Sipariş kalemleri
- **OrderInvoiceAddress**: Sipariş fatura adresleri
- **OrderCargo**: Sipariş kargo bilgileri

#### Kasa ve Banka Yönetimi

- **Vault**: Kasalar
- **VaultMovement**: Kasa hareketleri
- **Bank**: Bankalar
- **BankMovement**: Banka hareketleri
- **Pos**: POS cihazları
- **PosMovement**: POS hareketleri

#### Kullanıcı ve Yetki Yönetimi

- **User**: Kullanıcılar
- **Role**: Roller
- **Permission**: İzinler
- **PermissionGroup**: İzin grupları
- **Session**: Oturumlar

#### Diğer

- **Company**: Şirket bilgileri
- **Branch**: Şubeler
- **Notification**: Bildirimler
- **PrintQueue**: Yazdırma kuyruğu
- **SecurityLog**: Güvenlik logları

## Veritabanı Şeması

Aşağıda, ana modellerin şema yapısı verilmiştir:

### StockCard

```prisma
model StockCard {
  id                Int                     @id @default(autoincrement())
  code              String                  @unique
  name              String
  description       String?
  price             Float                   @default(0)
  purchasePrice     Float                   @default(0)
  stockAmount       Float                   @default(0)
  unit              StockUnits              @default(ADET)
  taxRate           Float                   @default(0)
  isActive          Boolean                 @default(true)
  createdAt         DateTime                @default(now())
  updatedAt         DateTime                @updatedAt
  brandId           Int?
  brand             Brand?                  @relation(fields: [brandId], references: [id])
  barcodes          StockCardBarcode[]
  categories        StockCardCategoryItem[]
  attributes        StockCardAttributeItems[]
  stockMovements    StockMovement[]
  invoiceDetails    InvoiceDetail[]
  orderItems        OrderItem[]
  warehouses        StockCardWarehouse[]
}
```

### Current

```prisma
model Current {
  id                Int                 @id @default(autoincrement())
  code              String              @unique
  name              String
  type              CurrentType
  taxNumber         String?
  taxOffice         String?
  email             String?
  phone             String?
  isActive          Boolean             @default(true)
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  addresses         CurrentAddress[]
  financials        CurrentFinancial[]
  movements         CurrentMovement[]
  invoices          Invoice[]
  orders            Order[]
}
```

### Invoice

```prisma
model Invoice {
  id                Int                 @id @default(autoincrement())
  number            String              @unique
  type              InvoiceType
  date              DateTime
  dueDate           DateTime?
  subtotal          Float               @default(0)
  taxTotal          Float               @default(0)
  discountTotal     Float               @default(0)
  total             Float               @default(0)
  note              String?
  isActive          Boolean             @default(true)
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  currentId         Int
  current           Current             @relation(fields: [currentId], references: [id])
  warehouseId       Int
  warehouse         Warehouse           @relation(fields: [warehouseId], references: [id])
  createdById       Int
  createdBy         User                @relation(fields: [createdById], references: [id])
  details           InvoiceDetail[]
}
```

### User

```prisma
model User {
  id                Int                 @id @default(autoincrement())
  email             String              @unique
  password          String
  name              String
  isActive          Boolean             @default(true)
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  roleId            Int
  role              Role                @relation(fields: [roleId], references: [id])
  sessions          Session[]
  invoices          Invoice[]
  orders            Order[]
}
```

## Enum Tipleri

Veritabanında kullanılan enum tipleri:

```prisma
enum AddressType {
  Fatura
  Sevk
  Teslimat
}

enum InvoiceType {
  Purchase
  Sales
  Return
  Cancel
  Other
}

enum StokManagementType {
  Sayim
  Devir
  DepolarArasiTransfer
  Uretim
  Muhtelif
  Maliyet
  Konsinye
  Teshir
  AlisFaturasi
  SatisFaturasi
  HizliSatis
}

enum GCCode {
  Giris
  Cikis
}

enum CurrentType {
  Musteri
  Tedarikci
  MusteriTedarikci
  Personel
  Diger
}

enum StockUnits {
  ADET
  KUTU
  PAKET
  KOLI
  KG
  GRAM
  LITRE
  METRE
  CM
  MM
  M2
  M3
  CIFT
}
```

## İlişkiler

Veritabanındaki önemli ilişkiler:

1. **Bir-Çok İlişkiler**:

   - Bir StockCard, birden çok StockMovement'a sahip olabilir.
   - Bir Current, birden çok Invoice'a sahip olabilir.
   - Bir User, birden çok Invoice oluşturabilir.
   - Bir Role, birden çok User'a sahip olabilir.

2. **Çok-Çok İlişkiler**:
   - StockCard ve Category arasında çok-çok ilişki (StockCardCategoryItem üzerinden).
   - StockCard ve Warehouse arasında çok-çok ilişki (StockCardWarehouse üzerinden).
   - Role ve Permission arasında çok-çok ilişki.

## Veritabanı Migrasyonları

Veritabanı şemasında değişiklik yapmak için Prisma migrasyonlarını kullanın:

```bash
# Yeni bir migration oluşturma
bunx prisma migrate dev --name migration_name

# Migrasyonları üretim ortamında uygulama
bunx prisma migrate deploy

# Veritabanını sıfırlama (DEV ortamında)
bunx prisma migrate reset
```

## Seed Verileri

Uygulama, başlangıç verileri ile birlikte gelir. Bu veriler, `prisma/seed.ts` dosyasında tanımlanmıştır ve aşağıdaki temel verileri içerir:

- Roller ve izinler
- Varsayılan admin kullanıcısı
- Temel kategoriler
- Örnek stok kartları
- Örnek cari hesaplar
- Örnek depolar

Seed verilerini yüklemek için:

```bash
bunx prisma db seed
```

## Veritabanı Yedekleme ve Geri Yükleme

### PostgreSQL Yedekleme

```bash
pg_dump -U postgres -d erp_db -F c -f backup.dump
```

### PostgreSQL Geri Yükleme

```bash
pg_restore -U postgres -d erp_db -c backup.dump
```

## Veritabanı Performans Optimizasyonu

### İndeksler

Veritabanı performansını artırmak için aşağıdaki alanlarda indeksler oluşturulmuştur:

```prisma
model StockCard {
  code              String                  @unique
  @@index([name])
  @@index([isActive])
}

model Current {
  code              String                  @unique
  @@index([name])
  @@index([type])
  @@index([isActive])
}

model Invoice {
  number            String                  @unique
  @@index([date])
  @@index([currentId])
  @@index([type])
}
```

### Sorgu Optimizasyonu

Veritabanı sorgularını optimize etmek için aşağıdaki önerileri dikkate alın:

1. **Seçici Sorgular**: Sadece ihtiyaç duyulan alanları seçin.

   ```typescript
   const users = await prisma.user.findMany({
     select: {
       id: true,
       name: true,
       email: true,
     },
   });
   ```

2. **İlişki Yükleme**: İlişkili verileri tek sorguda yükleyin.

   ```typescript
   const invoice = await prisma.invoice.findUnique({
     where: { id: invoiceId },
     include: {
       details: true,
       current: true,
     },
   });
   ```

3. **Sayfalama**: Büyük veri setleri için sayfalama kullanın.

   ```typescript
   const stockCards = await prisma.stockCard.findMany({
     skip: (page - 1) * limit,
     take: limit,
     orderBy: { createdAt: "desc" },
   });
   ```

4. **Filtreleme**: Verileri sunucuda filtreleyin.
   ```typescript
   const activeCustomers = await prisma.current.findMany({
     where: {
       type: "Musteri",
       isActive: true,
     },
   });
   ```

## Veritabanı Bağlantı Yönetimi

Uygulama, Prisma Client kullanarak veritabanı bağlantılarını yönetir. Prisma Client, bağlantı havuzu oluşturur ve bağlantıları otomatik olarak yönetir.

```typescript
// src/config/prisma.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

## Veritabanı Güvenliği

1. **Parametre Bağlama**: SQL enjeksiyon saldırılarını önlemek için Prisma ORM kullanın.
2. **Şifreleme**: Hassas verileri (şifreler vb.) şifrelenmiş olarak saklayın.
3. **Erişim Kontrolü**: Veritabanına erişimi kısıtlayın ve güçlü şifreler kullanın.
4. **Yetkilendirme**: Veritabanı kullanıcılarına minimum gerekli yetkileri verin.
5. **Audit Logging**: Veritabanı değişikliklerini izlemek için audit logging kullanın.

## Sorun Giderme

### Yaygın Veritabanı Sorunları

1. **Bağlantı Hataları**:

   - `.env` dosyasındaki `DATABASE_URL` değerini kontrol edin.
   - PostgreSQL servisinin çalıştığından emin olun.
   - Güvenlik duvarı ayarlarını kontrol edin.

2. **Migration Hataları**:

   - Prisma şemasında sözdizimi hatalarını kontrol edin.
   - Önceki migrasyonların başarıyla uygulandığından emin olun.
   - Gerekirse `prisma migrate reset` komutunu kullanarak veritabanını sıfırlayın.

3. **Performans Sorunları**:
   - Yavaş sorguları belirlemek için PostgreSQL log'larını kontrol edin.
   - İndeksleri gözden geçirin ve gerekirse yeni indeksler ekleyin.
   - Sorguları optimize edin ve gereksiz ilişki yüklemelerinden kaçının.

## Veritabanı Şeması Değişiklikleri

Veritabanı şemasında değişiklik yaparken aşağıdaki adımları izleyin:

1. `prisma/schema.prisma` dosyasını düzenleyin.
2. Değişiklikleri test edin: `bunx prisma validate`
3. Migration oluşturun: `bunx prisma migrate dev --name change_description`
4. Prisma client'ı güncelleyin: `bunx prisma generate`
5. Uygulamayı yeniden başlatın: `bun dev`

## Veritabanı Versiyonlama

Veritabanı şeması, Prisma migrasyonları aracılığıyla versiyonlanır. Her migration, `prisma/migrations` dizininde bir klasör olarak saklanır ve şema değişikliklerinin geçmişini oluşturur.

Migration klasörleri, uygulandıkları sırayla numaralandırılır ve her biri aşağıdaki dosyaları içerir:

- `migration.sql`: SQL migration komutları
- `README.md`: Migration açıklaması

## Referanslar

- [Prisma Dokümantasyonu](https://www.prisma.io/docs/)
- [PostgreSQL Dokümantasyonu](https://www.postgresql.org/docs/)
- [SQL Sorgu Optimizasyonu](https://www.postgresql.org/docs/current/performance-tips.html)
