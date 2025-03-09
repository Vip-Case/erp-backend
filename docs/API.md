# API Dokümantasyonu

Bu belge, Novent ERP & IMS Backend API'sinin kullanımını açıklamaktadır. API, RESTful prensiplere göre tasarlanmıştır ve JSON formatında veri alışverişi yapar.

## Genel Bilgiler

- **Base URL**: `https://api.novent.com.tr`
- **API Versiyonu**: v1
- **Kimlik Doğrulama**: JWT (JSON Web Token)

## Kimlik Doğrulama

API'nin çoğu endpoint'i kimlik doğrulama gerektirir. Kimlik doğrulama, JWT token kullanılarak yapılır.

### Giriş

```
POST /auth/login
```

**İstek Gövdesi**:

```json
{
  "email": "kullanici@ornek.com",
  "password": "sifre123"
}
```

**Başarılı Yanıt** (200 OK):

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "kullanici@ornek.com",
      "name": "Kullanıcı Adı",
      "role": {
        "id": 1,
        "name": "Admin"
      }
    }
  }
}
```

### Token Yenileme

```
POST /auth/refresh-token
```

**İstek Gövdesi**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Başarılı Yanıt** (200 OK):

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Kimlik Doğrulama Kullanımı

Kimlik doğrulama gerektiren endpoint'lere istek yaparken, `Authorization` başlığında token'ı belirtmelisiniz:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Stok Kartları

### Tüm Stok Kartlarını Listeleme

```
GET /stock-card
```

**Sorgu Parametreleri**:

- `page`: Sayfa numarası (varsayılan: 1)
- `limit`: Sayfa başına öğe sayısı (varsayılan: 10)
- `search`: Arama terimi
- `category`: Kategori ID'si
- `brand`: Marka ID'si

**Başarılı Yanıt** (200 OK):

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "code": "STK001",
        "name": "Ürün Adı",
        "barcode": "1234567890123",
        "price": 100.5,
        "stockAmount": 50,
        "unit": "ADET",
        "brand": {
          "id": 1,
          "name": "Marka Adı"
        },
        "category": {
          "id": 1,
          "name": "Kategori Adı"
        }
      }
    ],
    "meta": {
      "totalItems": 100,
      "itemCount": 10,
      "itemsPerPage": 10,
      "totalPages": 10,
      "currentPage": 1
    }
  }
}
```

### Stok Kartı Detayı

```
GET /stock-card/:id
```

**Başarılı Yanıt** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "STK001",
    "name": "Ürün Adı",
    "barcode": "1234567890123",
    "description": "Ürün açıklaması",
    "price": 100.5,
    "purchasePrice": 80.0,
    "stockAmount": 50,
    "unit": "ADET",
    "taxRate": 18,
    "brand": {
      "id": 1,
      "name": "Marka Adı"
    },
    "category": {
      "id": 1,
      "name": "Kategori Adı"
    },
    "attributes": [
      {
        "id": 1,
        "name": "Renk",
        "value": "Kırmızı"
      }
    ],
    "warehouses": [
      {
        "id": 1,
        "name": "Ana Depo",
        "stockAmount": 30
      },
      {
        "id": 2,
        "name": "Şube Deposu",
        "stockAmount": 20
      }
    ],
    "barcodes": [
      {
        "id": 1,
        "barcode": "1234567890123",
        "isDefault": true
      }
    ]
  }
}
```

### Stok Kartı Oluşturma

```
POST /stock-card
```

**İstek Gövdesi**:

```json
{
  "code": "STK001",
  "name": "Yeni Ürün",
  "barcode": "1234567890123",
  "description": "Ürün açıklaması",
  "price": 100.5,
  "purchasePrice": 80.0,
  "unit": "ADET",
  "taxRate": 18,
  "brandId": 1,
  "categoryId": 1,
  "attributes": [
    {
      "attributeId": 1,
      "value": "Kırmızı"
    }
  ],
  "warehouses": [
    {
      "warehouseId": 1,
      "stockAmount": 30
    }
  ]
}
```

**Başarılı Yanıt** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": 2,
    "code": "STK001",
    "name": "Yeni Ürün",
    "barcode": "1234567890123",
    "description": "Ürün açıklaması",
    "price": 100.5,
    "purchasePrice": 80.0,
    "stockAmount": 30,
    "unit": "ADET",
    "taxRate": 18,
    "brand": {
      "id": 1,
      "name": "Marka Adı"
    },
    "category": {
      "id": 1,
      "name": "Kategori Adı"
    }
  }
}
```

### Stok Kartı Güncelleme

```
PUT /stock-card/:id
```

**İstek Gövdesi**:

```json
{
  "name": "Güncellenmiş Ürün Adı",
  "price": 120.75,
  "description": "Güncellenmiş açıklama"
}
```

**Başarılı Yanıt** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "STK001",
    "name": "Güncellenmiş Ürün Adı",
    "barcode": "1234567890123",
    "description": "Güncellenmiş açıklama",
    "price": 120.75,
    "purchasePrice": 80.0,
    "stockAmount": 50,
    "unit": "ADET",
    "taxRate": 18
  }
}
```

### Stok Kartı Silme

```
DELETE /stock-card/:id
```

**Başarılı Yanıt** (200 OK):

```json
{
  "success": true,
  "message": "Stok kartı başarıyla silindi"
}
```

## Stok Hareketleri

### Stok Hareketi Oluşturma

```
POST /stock-movement
```

**İstek Gövdesi**:

```json
{
  "type": "Giris",
  "warehouseId": 1,
  "description": "Stok girişi",
  "items": [
    {
      "stockCardId": 1,
      "quantity": 10,
      "price": 80.0
    },
    {
      "stockCardId": 2,
      "quantity": 5,
      "price": 120.0
    }
  ]
}
```

**Başarılı Yanıt** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "type": "Giris",
    "date": "2023-05-15T10:30:00Z",
    "warehouse": {
      "id": 1,
      "name": "Ana Depo"
    },
    "description": "Stok girişi",
    "items": [
      {
        "id": 1,
        "stockCard": {
          "id": 1,
          "code": "STK001",
          "name": "Ürün Adı"
        },
        "quantity": 10,
        "price": 80.0
      },
      {
        "id": 2,
        "stockCard": {
          "id": 2,
          "code": "STK002",
          "name": "Diğer Ürün"
        },
        "quantity": 5,
        "price": 120.0
      }
    ],
    "createdBy": {
      "id": 1,
      "name": "Kullanıcı Adı"
    },
    "createdAt": "2023-05-15T10:30:00Z"
  }
}
```

## Cari Hesaplar

### Cari Hesap Oluşturma

```
POST /current
```

**İstek Gövdesi**:

```json
{
  "code": "CUR001",
  "name": "ABC Şirketi",
  "type": "Tedarikci",
  "taxNumber": "1234567890",
  "taxOffice": "Vergi Dairesi",
  "email": "info@abc.com",
  "phone": "0212 123 45 67",
  "address": {
    "addressLine": "Örnek Mahallesi, Örnek Sokak No:1",
    "city": "İstanbul",
    "district": "Kadıköy",
    "postalCode": "34000",
    "type": "Fatura"
  }
}
```

**Başarılı Yanıt** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "CUR001",
    "name": "ABC Şirketi",
    "type": "Tedarikci",
    "taxNumber": "1234567890",
    "taxOffice": "Vergi Dairesi",
    "email": "info@abc.com",
    "phone": "0212 123 45 67",
    "addresses": [
      {
        "id": 1,
        "addressLine": "Örnek Mahallesi, Örnek Sokak No:1",
        "city": "İstanbul",
        "district": "Kadıköy",
        "postalCode": "34000",
        "type": "Fatura"
      }
    ]
  }
}
```

## Faturalar

### Fatura Oluşturma

```
POST /invoice
```

**İstek Gövdesi**:

```json
{
  "type": "Sales",
  "currentId": 1,
  "date": "2023-05-15T10:30:00Z",
  "dueDate": "2023-06-15T10:30:00Z",
  "warehouseId": 1,
  "items": [
    {
      "stockCardId": 1,
      "quantity": 2,
      "price": 100.5,
      "taxRate": 18,
      "discountRate": 5
    },
    {
      "stockCardId": 2,
      "quantity": 1,
      "price": 200.0,
      "taxRate": 18,
      "discountRate": 0
    }
  ]
}
```

**Başarılı Yanıt** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "number": "FTR-2023-0001",
    "type": "Sales",
    "date": "2023-05-15T10:30:00Z",
    "dueDate": "2023-06-15T10:30:00Z",
    "current": {
      "id": 1,
      "code": "CUR001",
      "name": "ABC Şirketi"
    },
    "warehouse": {
      "id": 1,
      "name": "Ana Depo"
    },
    "items": [
      {
        "id": 1,
        "stockCard": {
          "id": 1,
          "code": "STK001",
          "name": "Ürün Adı"
        },
        "quantity": 2,
        "price": 100.5,
        "taxRate": 18,
        "discountRate": 5,
        "lineTotal": 191.0
      },
      {
        "id": 2,
        "stockCard": {
          "id": 2,
          "code": "STK002",
          "name": "Diğer Ürün"
        },
        "quantity": 1,
        "price": 200.0,
        "taxRate": 18,
        "discountRate": 0,
        "lineTotal": 236.0
      }
    ],
    "subtotal": 391.0,
    "taxTotal": 70.38,
    "discountTotal": 10.05,
    "total": 427.0,
    "createdBy": {
      "id": 1,
      "name": "Kullanıcı Adı"
    },
    "createdAt": "2023-05-15T10:30:00Z"
  }
}
```

## Hata Yanıtları

API, aşağıdaki hata yanıtlarını döndürebilir:

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Geçersiz istek verileri",
    "details": [
      {
        "field": "name",
        "message": "İsim alanı zorunludur"
      }
    ]
  }
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Yetkilendirme başlığı eksik"
  }
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": {
    "code": "AUTHORIZATION_ERROR",
    "message": "Bu işlemi gerçekleştirmek için yetkiniz yok"
  }
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Kayıt bulunamadı"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Sunucu hatası oluştu"
  }
}
```

## Swagger Dokümantasyonu

Daha detaylı API dokümantasyonu için, uygulamanın çalıştığı ortamda `/docs` endpoint'ine gidebilirsiniz. Bu endpoint, Swagger UI aracılığıyla interaktif API dokümantasyonu sağlar.
