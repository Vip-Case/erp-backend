# CI/CD Pipeline Kurulumu

Bu belge, GitHub Actions kullanarak CI/CD pipeline'ının nasıl kurulacağını açıklar.

## Genel Bakış

CI/CD pipeline'ımız şu adımları içerir:

- Kod değişikliklerini kontrol etme (linting, formatting)
- Testleri çalıştırma
- Docker imajı oluşturma
- Azure Container Registry'ye (ACR) imajı gönderme
- Azure App Service'e deploy etme
- Veritabanı migrasyonlarını çalıştırma
- Redis önbelleğini temizleme
- Uygulama sağlık kontrolü

## Kurulum Adımları

### 1. Azure Kimlik Bilgilerini Oluşturma

GitHub Actions'ın Azure kaynaklarına erişebilmesi için bir Service Principal oluşturmanız gerekir. Bu işlemi otomatikleştirmek için aşağıdaki komutu çalıştırın:

```bash
./scripts/setup-github-actions.sh
```

Bu script, Azure CLI kullanarak bir Service Principal oluşturacak ve gerekli kimlik bilgilerini gösterecektir.

### 2. GitHub Secrets Ekleme

Script'in çıktısındaki JSON'u GitHub repository'nizin "Settings > Secrets and variables > Actions" bölümüne "AZURE_CREDENTIALS" adıyla ekleyin.

### 3. Diğer Gerekli Secrets

Aşağıdaki secrets'ları da GitHub'a eklemeniz gerekebilir:

- `ACR_USERNAME`: Azure Container Registry kullanıcı adı
- `ACR_PASSWORD`: Azure Container Registry şifresi

### 4. Workflow Dosyasını Kontrol Etme

`.github/workflows/ci-cd.yml` dosyasını kontrol edin ve gerekirse projenize özgü ayarları güncelleyin.

## Pipeline Çalıştırma

Pipeline, aşağıdaki durumlarda otomatik olarak çalışacaktır:

1. `main` veya `master` branch'ine push yapıldığında
2. `main` veya `master` branch'ine pull request açıldığında
3. GitHub Actions arayüzünden manuel olarak tetiklendiğinde (workflow_dispatch)

## Sorun Giderme

Pipeline çalışırken sorunlarla karşılaşırsanız:

1. GitHub Actions log'larını kontrol edin
2. Azure Portal'dan App Service ve Container Registry log'larını kontrol edin
3. Azure CLI kullanarak daha fazla bilgi alın:
   ```bash
   az webapp log tail --name novent-erp-api --resource-group novent-erp-rg
   ```

## Notlar

- Pull request'lerde sadece build ve test adımları çalışır, deploy adımları çalışmaz
- Her başarılı deploy sonrası, uygulama sağlık kontrolü yapılır
- Veritabanı migrasyonları otomatik olarak çalıştırılır
- Redis önbelleği her deploy sonrası temizlenir
