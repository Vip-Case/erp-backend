# CI/CD Pipeline Kurulumu

Bu belge, GitHub Actions kullanarak CI/CD pipeline'ının nasıl kurulacağını açıklar.

## Genel Bakış

CI/CD pipeline'ımız şu adımları içerir:

- Kod değişikliklerini kontrol etme (linting, formatting)
- Testleri çalıştırma
- Veritabanı yedekleme durumunu kontrol etme
- Docker imajı oluşturma
- Azure Container Registry'ye (ACR) imajı gönderme
- Azure App Service'e deploy etme
- Veritabanı migrasyonlarını çalıştırma
- Redis önbelleğini temizleme
- Uygulama sağlık kontrolü
- Slack bildirimleri gönderme

## Kurulum Adımları

### 1. Azure Kimlik Bilgilerini Oluşturma

GitHub Actions'ın Azure kaynaklarına erişebilmesi için bir Service Principal oluşturmanız gerekir. Bu işlemi otomatikleştirmek için aşağıdaki komutu çalıştırın:

```bash
./scripts/setup-github-actions.sh
```

Bu script, Azure CLI kullanarak bir Service Principal oluşturacak ve gerekli kimlik bilgilerini gösterecektir.

### 2. GitHub Secrets Ekleme

Script'in çıktısındaki JSON'u GitHub repository'nizin "Settings > Secrets and variables > Actions" bölümüne "AZURE_CREDENTIALS" adıyla ekleyin.

**Önemli Not**: JSON formatındaki kimlik bilgilerini GitHub Secrets'a eklerken, JSON içindeki tüm boşlukları ve yeni satır karakterlerini kaldırın. JSON'un tek bir satır halinde olması gerekir. Örneğin:

```json
{
  "clientId": "",
  "clientSecret": "",
  "subscriptionId": "",
  "tenantId": "",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

JSON içinde kontrol karakterleri (örneğin tab, yeni satır) veya hatalı karakterler olmamalıdır. Bu tür karakterler, GitHub Actions'ın Azure'a bağlanırken "Bad control character in string literal in JSON" hatası almasına neden olabilir.

### 3. Diğer Gerekli Secrets

Aşağıdaki secrets'ları da GitHub'a eklemeniz gerekebilir:

- `ACR_USERNAME`: Azure Container Registry kullanıcı adı
- `ACR_PASSWORD`: Azure Container Registry şifresi
- `POSTGRES_PASSWORD`: PostgreSQL veritabanı şifresi
- `SLACK_WEBHOOK`: Slack webhook URL'si (bildirimler için)

### 4. Workflow Dosyasını Kontrol Etme

`.github/workflows/ci-cd.yml` dosyasını kontrol edin ve gerekirse projenize özgü ayarları güncelleyin.

## Pipeline Çalıştırma

Pipeline, aşağıdaki durumlarda otomatik olarak çalışacaktır:

1. `main` veya `master` branch'ine push yapıldığında
2. `main` veya `master` branch'ine pull request açıldığında
3. GitHub Actions arayüzünden manuel olarak tetiklendiğinde (workflow_dispatch)

## Veritabanı Yedekleme

CI/CD pipeline'ı, deployment öncesinde veritabanı yedekleme durumunu kontrol eder. Azure PostgreSQL Flexible Server, otomatik olarak günlük yedeklemeler oluşturur ve bu yedekler yapılandırılmış yedekleme saklama süresine göre saklanır.

### Otomatik Yedekleme

Azure PostgreSQL Flexible Server, otomatik olarak günlük yedeklemeler oluşturur ve bu yedekler varsayılan olarak 7 gün boyunca saklanır (bu süre 35 güne kadar yapılandırılabilir). Bu yedekler, herhangi bir zamana geri yükleme (Point-in-Time Restore) için kullanılabilir.

### Manuel Yedekleme

**Önemli Not**: Manuel yedekleme (on-demand backup) özelliği, Burstable tier PostgreSQL sunucularda desteklenmemektedir. Bu nedenle, Burstable tier kullanıyorsanız, otomatik yedeklemelere güvenmeniz gerekir.

Eğer General Purpose veya Memory Optimized tier kullanıyorsanız, manuel yedekleme oluşturmak için aşağıdaki komutu kullanabilirsiniz:

```bash
./scripts/postgres-backup-restore.sh backup
```

Bu komut, önce sunucunun tier'ını kontrol eder ve eğer uygunsa Azure PostgreSQL Flexible Server'da bir manuel yedek oluşturur. Yedek adı "manual_backup_TIMESTAMP" formatında olacaktır.

### Yedekleri Listeleme

Mevcut yedekleri listelemek için aşağıdaki komutu kullanabilirsiniz:

```bash
./scripts/postgres-backup-restore.sh list-backups
```

### Yedeği Geri Yükleme

Bir yedeği geri yüklemek için aşağıdaki komutu kullanabilirsiniz:

```bash
./scripts/postgres-backup-restore.sh restore "2025-03-04T14:30:00"
```

Bu komut, belirtilen tarihteki yedeği yeni bir sunucuya geri yükler. Geri yükleme işlemi tamamlandıktan sonra, yeni sunucuya bağlanabilir ve verileri kontrol edebilirsiniz.

**Not**: Geri yükleme işlemi, yeni bir PostgreSQL sunucusu oluşturur. Orijinal sunucu değiştirilmez.

### CI/CD Pipeline Entegrasyonu

CI/CD pipeline'ımız, her deployment öncesinde veritabanı yedekleme durumunu kontrol eder. Burstable tier kullanıldığı için, manuel yedekleme yerine otomatik yedeklemelere güvenir. Bu, deployment sırasında bir sorun oluşması durumunda veritabanını geri yükleme olanağı sağlar.

## Slack Bildirimleri

CI/CD pipeline'ı, aşağıdaki durumlarda Slack bildirimleri gönderir:

1. Test tamamlandığında
2. Docker imajı oluşturulduğunda
3. Veritabanı yedekleme durumu kontrol edildiğinde
4. Deployment tamamlandığında

Slack bildirimlerini yapılandırmak için, Slack webhook URL'sini GitHub repository'nizin "Settings > Secrets and variables > Actions" bölümüne "SLACK_WEBHOOK" adıyla ekleyin.

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
- Her deployment öncesinde veritabanı yedekleme durumu kontrol edilir
- Tüm önemli adımlar için Slack bildirimleri gönderilir
