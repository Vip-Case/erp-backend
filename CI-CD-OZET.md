# CI/CD Pipeline Özeti

## Genel Bakış

Bu CI/CD pipeline'ı, GitHub Actions kullanarak otomatik olarak kod değişikliklerini test eder, veritabanı yedeği oluşturur, Docker imajı oluşturur ve Azure App Service'e deploy eder.

## Bileşenler

1. **GitHub Actions Workflow**: `.github/workflows/ci-cd.yml`
2. **Azure Kimlik Bilgileri Oluşturma Script'i**: `scripts/setup-github-actions.sh`
3. **CI/CD Test Script'i**: `scripts/test-ci-cd.sh`
4. **PostgreSQL Yedekleme ve Geri Yükleme Script'i**: `scripts/postgres-backup-restore.sh`
5. **Detaylı Dokümantasyon**: `CI-CD-README.md`

## Kurulum Adımları

1. GitHub repository'nize bu dosyaları ekleyin
2. `./scripts/setup-github-actions.sh` script'ini çalıştırarak Azure kimlik bilgilerini oluşturun
3. Oluşturulan kimlik bilgilerini GitHub repository secrets olarak ekleyin
   - **Önemli**: JSON formatındaki kimlik bilgilerini eklerken, tüm boşlukları ve yeni satır karakterlerini kaldırın
   - JSON'un tek bir satır halinde olması gerekir ve kontrol karakterleri içermemelidir
   - Aksi takdirde "Bad control character in string literal in JSON" hatası alabilirsiniz
4. İlk commit'i yaparak pipeline'ı tetikleyin

## GitHub Secrets

Aşağıdaki secrets'ları GitHub repository'nize eklemeniz gerekir:

- `AZURE_CREDENTIALS`: Azure Service Principal kimlik bilgileri (JSON formatında)
- `ACR_USERNAME`: Azure Container Registry kullanıcı adı
- `ACR_PASSWORD`: Azure Container Registry şifresi
- `POSTGRES_PASSWORD`: PostgreSQL veritabanı şifresi
- `SLACK_WEBHOOK`: Slack webhook URL'si (bildirimler için)

## Pipeline Adımları

1. **Build ve Test**:

   - Kod kalitesi kontrolü
   - Unit testlerin çalıştırılması
   - Slack bildirimi gönderme

2. **Veritabanı Yedekleme Kontrolü**:

   - Deployment öncesi veritabanı yedekleme durumunu kontrol etme
   - Burstable tier sunucularda otomatik yedeklemeleri kullanma
   - Slack bildirimi gönderme

3. **Docker İmajı Oluşturma ve Gönderme**:

   - Docker imajı oluşturma
   - Azure Container Registry'ye gönderme
   - Slack bildirimi gönderme

4. **Deploy**:
   - Azure App Service'e deploy etme
   - Veritabanı migrasyonlarını çalıştırma
   - Redis önbelleğini temizleme
   - Sağlık kontrolü yapma
   - Slack bildirimi gönderme

## Veritabanı Yedekleme

CI/CD pipeline'ı, her deployment öncesinde veritabanı yedekleme durumunu kontrol eder. Azure PostgreSQL Flexible Server, otomatik olarak günlük yedeklemeler oluşturur ve bu yedekler yapılandırılmış yedekleme saklama süresine göre saklanır.

### Yedekleme Özellikleri

- **Otomatik Yedekleme**: Azure PostgreSQL Flexible Server, günlük otomatik yedeklemeler oluşturur (varsayılan saklama süresi: 7 gün)
- **Manuel Yedekleme Kısıtlaması**: Burstable tier sunucularda manuel yedekleme (on-demand backup) desteklenmemektedir
- **Yedekleri Listeleme**: `scripts/postgres-backup-restore.sh list-backups` komutu ile mevcut yedekler listelenebilir
- **Geri Yükleme**: `scripts/postgres-backup-restore.sh restore "2025-03-04T14:30:00"` komutu ile belirli bir tarihteki yedek geri yüklenebilir

## Slack Bildirimleri

CI/CD pipeline'ı, pipeline'ın her önemli adımında Slack bildirimleri gönderir. Bu bildirimler, pipeline'ın durumu hakkında bilgi verir ve sorunları hızlı bir şekilde tespit etmenize yardımcı olur.

## Notlar

- Pipeline, `main` veya `master` branch'ine push yapıldığında otomatik olarak çalışır
- Pull request'lerde sadece build ve test adımları çalışır
- Manuel olarak da tetiklenebilir (workflow_dispatch)
- Her deploy sonrası sağlık kontrolü yapılır
- Her deployment öncesinde veritabanı yedekleme durumu kontrol edilir
- Burstable tier PostgreSQL sunucularda manuel yedekleme desteklenmediği için otomatik yedeklemelere güvenilir
