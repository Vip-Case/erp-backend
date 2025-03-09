# Azure Deployment Kılavuzu

Bu belge, Novent ERP & IMS Backend uygulamasının Azure'a nasıl deploy edileceğini detaylı olarak açıklamaktadır.

## Ön Gereksinimler

- Azure hesabı
- Azure CLI yüklü ve yapılandırılmış
- Docker yüklü ve yapılandırılmış
- Git

## 1. Azure Kaynaklarını Oluşturma

### Resource Group Oluşturma

```bash
az group create --name novent-erp-rg --location westeurope
```

### Azure Container Registry (ACR) Oluşturma

```bash
az acr create --resource-group novent-erp-rg --name noventacr --sku Basic
```

### Azure Key Vault Oluşturma

```bash
az keyvault create --name novent-kv --resource-group novent-erp-rg --location westeurope
```

### Azure PostgreSQL Oluşturma

```bash
az postgres server create \
  --resource-group novent-erp-rg \
  --name novent-postgres \
  --location westeurope \
  --admin-user noventadmin \
  --admin-password <güvenli-şifre> \
  --sku-name GP_Gen5_2 \
  --version 14

# Veritabanı oluşturma
az postgres db create \
  --resource-group novent-erp-rg \
  --server-name novent-postgres \
  --name erp_db
```

### Azure Redis Cache Oluşturma

```bash
az redis create \
  --resource-group novent-erp-rg \
  --name novent-redis \
  --location westeurope \
  --sku Basic \
  --vm-size C1
```

### App Service Plan Oluşturma

```bash
az appservice plan create \
  --name novent-erp-plan \
  --resource-group novent-erp-rg \
  --sku P1v2 \
  --is-linux
```

### Web App Oluşturma

```bash
az webapp create \
  --resource-group novent-erp-rg \
  --plan novent-erp-plan \
  --name novent-erp-api \
  --deployment-container-image-name noventacr.azurecr.io/erp-api:latest
```

## 2. Key Vault'a Sırları Ekleme

```bash
# PostgreSQL bağlantı bilgileri
az keyvault secret set --vault-name novent-kv --name "DB-HOST" --value "novent-postgres.postgres.database.azure.com"
az keyvault secret set --vault-name novent-kv --name "DB-PORT" --value "5432"
az keyvault secret set --vault-name novent-kv --name "DB-USER" --value "noventadmin@novent-postgres"
az keyvault secret set --vault-name novent-kv --name "DB-PASSWORD" --value "<güvenli-şifre>"
az keyvault secret set --vault-name novent-kv --name "DB-NAME" --value "erp_db"
az keyvault secret set --vault-name novent-kv --name "DATABASE-URL" --value "postgresql://noventadmin@novent-postgres:güvenli-şifre@novent-postgres.postgres.database.azure.com:5432/erp_db?sslmode=require"

# Redis bağlantı bilgileri
az keyvault secret set --vault-name novent-kv --name "REDIS-HOST" --value "novent-redis.redis.cache.windows.net"
az keyvault secret set --vault-name novent-kv --name "REDIS-PORT" --value "6380"
az keyvault secret set --vault-name novent-kv --name "REDIS-PASSWORD" --value "<redis-erişim-anahtarı>"

# JWT sırları
az keyvault secret set --vault-name novent-kv --name "JWT-SECRET" --value "<jwt-gizli-anahtarı>"
az keyvault secret set --vault-name novent-kv --name "REFRESH-TOKEN-SECRET" --value "<refresh-token-gizli-anahtarı>"

# E-posta servisi için API anahtarı
az keyvault secret set --vault-name novent-kv --name "RESEND-API-KEY" --value "<resend-api-anahtarı>"
```

## 3. Web App'e Key Vault Erişimi Verme

```bash
# Web App'in sistem tarafından atanan kimliğini etkinleştirme
az webapp identity assign --name novent-erp-api --resource-group novent-erp-rg

# Sistem tarafından atanan kimlik ID'sini alma
principalId=$(az webapp identity show --name novent-erp-api --resource-group novent-erp-rg --query principalId --output tsv)

# Key Vault'a erişim politikası ekleme
az keyvault set-policy --name novent-kv --object-id $principalId --secret-permissions get list
```

## 4. Docker İmajını Oluşturma ve ACR'ye Push Etme

```bash
# ACR'ye giriş yapma
az acr login --name noventacr

# Docker imajını oluşturma
docker build -t noventacr.azurecr.io/erp-api:latest .

# İmajı ACR'ye push etme
docker push noventacr.azurecr.io/erp-api:latest
```

## 5. Web App'i Yapılandırma

```bash
# Web App'i Docker imajını kullanacak şekilde yapılandırma
az webapp config container set \
  --name novent-erp-api \
  --resource-group novent-erp-rg \
  --docker-custom-image-name noventacr.azurecr.io/erp-api:latest \
  --docker-registry-server-url https://noventacr.azurecr.io

# Web App'e ACR erişimi verme
az webapp config container set \
  --name novent-erp-api \
  --resource-group novent-erp-rg \
  --docker-registry-server-url https://noventacr.azurecr.io \
  --docker-registry-server-user noventacr \
  --docker-registry-server-password $(az acr credential show --name noventacr --query "passwords[0].value" --output tsv)

# App settings ayarlama
az webapp config appsettings set \
  --resource-group novent-erp-rg \
  --name novent-erp-api \
  --settings \
    WEBSITES_ENABLE_APP_SERVICE_STORAGE=false \
    WEBSITES_PORT=1303 \
    NODE_ENV=production \
    PORT=1303 \
    CORS_URL=https://erp.novent.com.tr \
    CRITICAL_STOCK_LEVEL=20 \
    WARNING_STOCK_LEVEL=50
```

## 6. Güvenlik Duvarı Kurallarını Yapılandırma

### PostgreSQL Güvenlik Duvarı Kuralları

```bash
# App Service'in IP adresini alma
appServiceIp=$(az webapp show --name novent-erp-api --resource-group novent-erp-rg --query outboundIpAddresses --output tsv | tr ',' '\n' | head -n 1)

# PostgreSQL güvenlik duvarı kuralı ekleme
az postgres server firewall-rule create \
  --resource-group novent-erp-rg \
  --server-name novent-postgres \
  --name AllowAppService \
  --start-ip-address $appServiceIp \
  --end-ip-address $appServiceIp
```

### Redis Güvenlik Duvarı Kuralları

```bash
# Redis güvenlik duvarı kuralı ekleme
az redis firewall-rules create \
  --resource-group novent-erp-rg \
  --name novent-redis \
  --rule-name AllowAppService \
  --start-ip $appServiceIp \
  --end-ip $appServiceIp
```

## 7. Veritabanı Migrasyonlarını Çalıştırma

```bash
# Prisma CLI'ı kullanarak migrasyonları çalıştırma
# Bu işlem için bir CI/CD pipeline kullanılabilir veya geçici bir VM üzerinden yapılabilir

# Örnek komutlar:
export DATABASE_URL="postgresql://noventadmin@novent-postgres:güvenli-şifre@novent-postgres.postgres.database.azure.com:5432/erp_db?sslmode=require"
npx prisma migrate deploy
npx prisma db seed
```

## 8. Custom Domain ve SSL Yapılandırma

```bash
# Custom domain ekleme
az webapp config hostname add \
  --webapp-name novent-erp-api \
  --resource-group novent-erp-rg \
  --hostname api.novent.com.tr

# SSL sertifikası oluşturma ve bağlama (App Service Managed Certificate)
az webapp config ssl create \
  --resource-group novent-erp-rg \
  --name novent-erp-api \
  --hostname api.novent.com.tr
```

## 9. Monitoring ve Logging Yapılandırma

```bash
# Application Insights oluşturma
az monitor app-insights component create \
  --app novent-erp-insights \
  --location westeurope \
  --resource-group novent-erp-rg \
  --application-type web

# Web App'e Application Insights entegrasyonu
instrumentationKey=$(az monitor app-insights component show --app novent-erp-insights --resource-group novent-erp-rg --query instrumentationKey --output tsv)

az webapp config appsettings set \
  --resource-group novent-erp-rg \
  --name novent-erp-api \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$instrumentationKey
```

## 10. CI/CD Pipeline Kurulumu

GitHub Actions veya Azure DevOps kullanarak bir CI/CD pipeline kurabilirsiniz. Örnek bir GitHub Actions workflow dosyası:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1

      - name: Login to ACR
        uses: docker/login-action@v1
        with:
          registry: noventacr.azurecr.io
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v2
        with:
          context: .
          push: true
          tags: noventacr.azurecr.io/erp-api:latest

      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v2
        with:
          app-name: "novent-erp-api"
          images: "noventacr.azurecr.io/erp-api:latest"
```

## 11. Sorun Giderme

### Logları İnceleme

```bash
# Web App loglarını görüntüleme
az webapp log tail --name novent-erp-api --resource-group novent-erp-rg
```

### Yaygın Sorunlar ve Çözümleri

1. **Bağlantı Hataları**: Güvenlik duvarı kurallarının doğru yapılandırıldığından emin olun.
2. **Key Vault Erişim Sorunları**: Web App'in sistem tarafından atanan kimliğinin Key Vault'a erişim izinlerini kontrol edin.
3. **Container Başlatma Sorunları**: Docker imajının doğru şekilde oluşturulduğundan ve ACR'ye push edildiğinden emin olun.
4. **Redis Bağlantı Sorunları**: Redis'in SSL/TLS ayarlarını kontrol edin ve uygulamanın SSL ile bağlanacak şekilde yapılandırıldığından emin olun.

## 12. Bakım ve İzleme

- **Düzenli Yedekleme**: PostgreSQL veritabanı için otomatik yedekleme yapılandırın.
- **Performans İzleme**: Application Insights ile uygulama performansını izleyin.
- **Güvenlik Güncellemeleri**: Düzenli olarak güvenlik güncellemelerini uygulayın.
- **Ölçeklendirme**: Trafik artışına göre App Service planını ölçeklendirin.
