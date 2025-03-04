# CI/CD Pipeline Özeti

## Genel Bakış

Bu CI/CD pipeline'ı, GitHub Actions kullanarak otomatik olarak kod değişikliklerini test eder, Docker imajı oluşturur ve Azure App Service'e deploy eder.

## Bileşenler

1. **GitHub Actions Workflow**: `.github/workflows/ci-cd.yml`
2. **Azure Kimlik Bilgileri Oluşturma Script'i**: `scripts/setup-github-actions.sh`
3. **CI/CD Test Script'i**: `scripts/test-ci-cd.sh`
4. **Detaylı Dokümantasyon**: `CI-CD-README.md`

## Kurulum Adımları

1. GitHub repository'nize bu dosyaları ekleyin
2. `./scripts/setup-github-actions.sh` script'ini çalıştırarak Azure kimlik bilgilerini oluşturun
3. Oluşturulan kimlik bilgilerini GitHub repository secrets olarak ekleyin
4. İlk commit'i yaparak pipeline'ı tetikleyin

## GitHub Secrets

Aşağıdaki secrets'ları GitHub repository'nize eklemeniz gerekir:

- `AZURE_CREDENTIALS`: Azure Service Principal kimlik bilgileri (JSON formatında)
- `ACR_USERNAME`: Azure Container Registry kullanıcı adı
- `ACR_PASSWORD`: Azure Container Registry şifresi

## Pipeline Adımları

1. **Build ve Test**:

   - Kod kalitesi kontrolü
   - Unit testlerin çalıştırılması

2. **Docker İmajı Oluşturma ve Gönderme**:

   - Docker imajı oluşturma
   - Azure Container Registry'ye gönderme

3. **Deploy**:
   - Azure App Service'e deploy etme
   - Veritabanı migrasyonlarını çalıştırma
   - Redis önbelleğini temizleme
   - Sağlık kontrolü yapma

## Notlar

- Pipeline, `main` veya `master` branch'ine push yapıldığında otomatik olarak çalışır
- Pull request'lerde sadece build ve test adımları çalışır
- Manuel olarak da tetiklenebilir (workflow_dispatch)
- Her deploy sonrası sağlık kontrolü yapılır
