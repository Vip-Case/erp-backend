# ELK Stack Entegrasyonu Planı

Bu belge, Novent ERP & IMS Backend uygulaması için ELK (Elasticsearch, Logstash, Kibana) Stack entegrasyonunun planlamasını içermektedir.

## 1. Genel Bakış

ELK Stack, uygulama loglarını toplamak, işlemek, depolamak ve görselleştirmek için kullanılacak bir log yönetim çözümüdür. Bu entegrasyon, aşağıdaki bileşenlerden oluşacaktır:

- **Elasticsearch**: Log verilerini depolamak ve indekslemek için
- **Logstash**: Log verilerini toplamak, dönüştürmek ve zenginleştirmek için
- **Kibana**: Log verilerini görselleştirmek ve analiz etmek için
- **Filebeat**: Uygulama sunucusundan log dosyalarını toplamak için

## 2. Mimari

```
                                  +------------------+
                                  |  Azure DNS Zone  |
                                  | monitor.novent.  |
                                  |    com.tr        |
                                  +--------+---------+
                                           |
                                  +--------v---------+
                                  |Azure Application |
                                  |    Gateway      |
                                  +--------+---------+
                                           |
                +----------------------+    |    +----------------------+
                |                      |    |    |                      |
+---------------v--------------+  +----v----v----+  +------------------v-----------+
|                              |  |               |  |                              |
|  Azure Container Instance    |  |    Azure      |  |  Azure Container Instance    |
|  veya AKS - Elasticsearch    |  | Container     |  |  veya AKS - Kibana           |
|                              |  | Instance      |  |                              |
+------------------------------+  | veya AKS -    |  +------------------------------+
                                  | Logstash      |
                                  |               |
                                  +---------------+
                                          ^
                                          |
                                  +-------+-------+
                                  |               |
                                  | Azure App     |
                                  | Service       |
                                  | (Filebeat)    |
                                  |               |
                                  +---------------+
```

## 3. Bileşenler

### 3.1 Elasticsearch

- **Sürüm**: 8.10.4
- **Deployment**: Azure Container Instances veya AKS
- **Kaynak Gereksinimleri**: 2 CPU, 4GB RAM
- **Depolama**: Azure Managed Disk (100GB)
- **Güvenlik**: X-Pack Security etkin, TLS/SSL ile şifrelenmiş iletişim

### 3.2 Logstash

- **Sürüm**: 8.10.4
- **Deployment**: Azure Container Instances veya AKS
- **Kaynak Gereksinimleri**: 1 CPU, 2GB RAM
- **Konfigürasyon**:
  - Filebeat'ten gelen logları dinleme
  - JSON formatındaki logları ayrıştırma
  - Hata loglarını zenginleştirme
  - Elasticsearch'e indeksleme

### 3.3 Kibana

- **Sürüm**: 8.10.4
- **Deployment**: Azure Container Instances veya AKS
- **Kaynak Gereksinimleri**: 1 CPU, 1GB RAM
- **Güvenlik**: Azure AD entegrasyonu ile kimlik doğrulama
- **Özelleştirme**: Özel dashboard'lar ve görselleştirmeler

### 3.4 Filebeat

- **Sürüm**: 8.10.4
- **Deployment**: App Service ile entegre (sidecar container)
- **Konfigürasyon**:
  - Log dosyalarını izleme
  - JSON formatındaki logları ayrıştırma
  - Logları Logstash'e gönderme

## 4. Uygulama Entegrasyonu

### 4.1 Logger Yapılandırması

Mevcut `src/utils/logger.ts` dosyası, ELK Stack entegrasyonu için aşağıdaki şekilde güncellenecektir:

```typescript
import pino from "pino";
import fs from "fs";
import dotenv from "dotenv";
import pinoCaller from "pino-caller";

dotenv.config();

// Ortamı belirleyelim (development, production)
const isProduction = process.env.NODE_ENV === "production";

// Log klasörünü oluştur (eğer yoksa)
if (!fs.existsSync("./logs")) {
  fs.mkdirSync("./logs");
}

const logFilePath = `./logs/app-log-${
  new Date().toISOString().split("T")[0]
}.log`;

// Pino logger'ı oluşturuyoruz
const logger = pino(
  {
    level: isProduction ? "info" : "debug",
    base: {
      pid: false,
      app: "erp-api",
      environment: process.env.NODE_ENV || "development",
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.destination(logFilePath)
);

// Dosya ve satır numarası bilgisini eklemek için pinoCaller kullanın
const loggerWithCaller = pinoCaller(logger);

export default loggerWithCaller;
```

### 4.2 Filebeat Konfigürasyonu

```yaml
# filebeat.yml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /home/site/wwwroot/logs/*.log
    json.keys_under_root: true
    json.add_error_key: true
    json.message_key: msg
    fields:
      type: erp-api
    fields_under_root: true

output.logstash:
  hosts: ["logstash.novent-elk-rg.svc.cluster.local:5044"]
  ssl.enabled: true
  ssl.verification_mode: none

logging.level: info
```

### 4.3 Logstash Pipeline Konfigürasyonu

```conf
# logstash.conf
input {
  beats {
    port => 5044
    ssl => true
    ssl_certificate => "/etc/logstash/certs/logstash.crt"
    ssl_key => "/etc/logstash/certs/logstash.key"
  }
}

filter {
  if [type] == "erp-api" {
    # Zaten JSON olarak geldiği için parse etmeye gerek yok

    # Kritik hataları işaretleme
    if [level] >= 50 {
      mutate {
        add_field => { "is_critical" => true }
      }
    }

    # Kullanıcı bilgilerini maskeleme
    if [body] and [body][password] {
      mutate {
        replace => { "[body][password]" => "[MASKED]" }
      }
    }

    # Geoip bilgisi ekleme (IP adresi varsa)
    if [ip] {
      geoip {
        source => "ip"
      }
    }
  }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    user => "elastic"
    password => "${ELASTIC_PASSWORD}"
    index => "erp-api-%{+YYYY.MM.dd}"
  }

  # Kritik hataları Slack'e gönderme
  if [is_critical] == true {
    http {
      url => "https://hooks.slack.com/services/YOUR_SLACK_WEBHOOK_URL"
      http_method => "post"
      content_type => "application/json"
      format => "json"
      mapping => {
        "text" => "Kritik Hata: %{msg}"
        "username" => "ERP API Monitoring"
        "icon_emoji" => ":warning:"
        "attachments" => [
          {
            "color" => "danger",
            "title" => "Hata Detayları",
            "text" => "Seviye: %{level}\nZaman: %{@timestamp}\nKaynak: %{caller}\nHata: %{msg}"
          }
        ]
      }
    }
  }
}
```

## 5. Azure Kaynakları

### 5.1 Resource Group

```bash
az group create --name novent-elk-rg --location westeurope
```

### 5.2 Virtual Network

```bash
az network vnet create --resource-group novent-elk-rg --name elk-vnet --address-prefix 10.0.0.0/16 --subnet-name elk-subnet --subnet-prefix 10.0.0.0/24
```

### 5.3 Storage Account

```bash
az storage account create --name noventelkstorage --resource-group novent-elk-rg --location westeurope --sku Standard_LRS
```

### 5.4 Container Registry

```bash
az acr create --resource-group novent-elk-rg --name noventelkacr --sku Basic
```

### 5.5 AKS Cluster

```bash
az aks create --resource-group novent-elk-rg --name novent-elk-aks --node-count 2 --enable-addons monitoring --generate-ssh-keys
```

### 5.6 Application Gateway

```bash
az network public-ip create --resource-group novent-elk-rg --name elk-public-ip --allocation-method Static --sku Standard

az network application-gateway create --name elk-appgw --resource-group novent-elk-rg --vnet-name elk-vnet --subnet appgw-subnet --public-ip-address elk-public-ip --http-settings-cookie-based-affinity Disabled --frontend-port 443 --http-settings-port 5601 --http-settings-protocol Http --sku Standard_v2
```

### 5.7 DNS Zone

```bash
az network dns zone create --name novent.com.tr --resource-group novent-elk-rg

az network dns record-set a add-record --resource-group novent-elk-rg --zone-name novent.com.tr --record-set-name monitor --ipv4-address <APP_GATEWAY_IP>
```

## 6. Deployment Adımları

### 6.1 Elasticsearch Deployment

```bash
helm repo add elastic https://helm.elastic.co
helm install elasticsearch elastic/elasticsearch --set replicas=1,resources.requests.cpu=1000m,resources.requests.memory=2Gi
```

### 6.2 Kibana Deployment

```bash
helm install kibana elastic/kibana
```

### 6.3 Logstash Deployment

```bash
helm install logstash elastic/logstash -f logstash-values.yaml
```

### 6.4 Filebeat Entegrasyonu

```bash
# Filebeat için özel Docker imajı oluşturma ve ACR'ye push etme
docker build -t noventelkacr.azurecr.io/filebeat:latest -f Dockerfile.filebeat .
az acr login --name noventelkacr
docker push noventelkacr.azurecr.io/filebeat:latest

# App Service'i güncelleyerek Filebeat entegrasyonu yapma
az webapp config container set --name novent-erp-api --resource-group novent-erp-rg --docker-custom-image-name noventelkacr.azurecr.io/filebeat:latest --docker-registry-server-url https://noventelkacr.azurecr.io
```

## 7. Kibana Dashboard'ları

Aşağıdaki dashboard'lar oluşturulacaktır:

1. **Genel Bakış Dashboard'u**:

   - Toplam istek sayısı
   - Başarılı/başarısız istek oranı
   - Ortalama yanıt süresi
   - Aktif kullanıcı sayısı

2. **Hata İzleme Dashboard'u**:

   - Hata sayısı ve türleri
   - Hata trendleri
   - En çok hata üreten endpoint'ler
   - Kritik hatalar

3. **Performans Dashboard'u**:

   - Endpoint bazında yanıt süreleri
   - Veritabanı sorgu süreleri
   - Redis önbellek kullanımı
   - Kaynak kullanımı (CPU, bellek)

4. **Güvenlik Dashboard'u**:
   - Başarısız giriş denemeleri
   - Şüpheli aktiviteler
   - IP bazında erişim istatistikleri
   - Yetkilendirme hataları

## 8. Güvenlik Yapılandırması

### 8.1 Kimlik Doğrulama

- Elasticsearch ve Kibana için X-Pack Security etkinleştirilecek
- Kibana için Azure AD entegrasyonu yapılacak
- Role-based access control (RBAC) yapılandırılacak

### 8.2 Ağ Güvenliği

- Virtual Network ile izole edilmiş ortam
- NSG (Network Security Group) kuralları ile erişim kısıtlaması
- Private Endpoint kullanımı

### 8.3 Veri Güvenliği

- Elasticsearch verilerinin şifrelenmesi
- Hassas bilgilerin maskelenmesi için Logstash filtreleri
- TLS/SSL ile güvenli iletişim

## 9. Maliyet Tahmini

| Kaynak              | Özellikler                      | Aylık Maliyet (Yaklaşık) |
| ------------------- | ------------------------------- | ------------------------ |
| AKS Cluster         | 2 node, B2s VM (2 CPU, 4GB RAM) | ~$70-100                 |
| Storage Account     | 100GB                           | ~$5-10                   |
| Application Gateway | Standard_v2                     | ~$40-60                  |
| DNS Zone            | -                               | ~$1                      |
| **Toplam**          |                                 | **~$116-171**            |

## 10. İzleme ve Bakım Planı

### 10.1 Günlük İzleme

- Elasticsearch disk kullanımı
- Logstash işlem hızı
- Kibana erişilebilirliği

### 10.2 Haftalık Bakım

- Eski indekslerin arşivlenmesi veya silinmesi
- Performans optimizasyonu
- Güvenlik güncellemeleri

### 10.3 Aylık Gözden Geçirme

- Dashboard'ların güncellenmesi
- Kapasite planlaması
- Maliyet optimizasyonu

## 11. Zaman Planlaması

1. **Hazırlık ve Planlama**: 1 gün
2. **Azure Kaynakları Oluşturma**: 1 gün
3. **ELK Stack Deployment**: 2 gün
4. **Uygulama Entegrasyonu**: 2 gün
5. **Test ve Optimizasyon**: 2 gün
6. **Dokümantasyon ve Eğitim**: 1 gün

**Toplam Süre**: Yaklaşık 9 iş günü
