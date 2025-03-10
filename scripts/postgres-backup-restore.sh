#!/bin/bash

# PostgreSQL Yedekleme ve Geri Yükleme Script'i
# Bu script, Azure PostgreSQL Flexible Server için yedekleme ve geri yükleme işlemlerini gerçekleştirir

# Değişkenler
RESOURCE_GROUP="novent-erp-rg"
POSTGRES_SERVER_NAME="novent-postgres"
POSTGRES_DB_NAME="erp_db"
POSTGRES_ADMIN="noventadmin"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# Fonksiyonlar
function show_help {
    echo "PostgreSQL Yedekleme ve Geri Yükleme Script'i"
    echo ""
    echo "Kullanım:"
    echo "  $0 [komut]"
    echo ""
    echo "Komutlar:"
    echo "  backup              Manuel yedekleme oluşturur (Burstable tier sunucularda desteklenmez)"
    echo "  list-backups        Mevcut yedekleri listeler"
    echo "  restore [tarih]     Belirtilen tarihteki yedeği geri yükler (YYYY-MM-DDThh:mm:ss formatında)"
    echo "  help                Bu yardım mesajını gösterir"
    echo ""
    echo "Örnekler:"
    echo "  $0 backup"
    echo "  $0 list-backups"
    echo "  $0 restore 2025-03-04T14:30:00"
}

function check_server_tier {
    echo "PostgreSQL sunucusunun tier bilgisi kontrol ediliyor..."
    
    # PostgreSQL sunucusunun tier bilgisini al
    SERVER_TIER=$(az postgres flexible-server show \
        --resource-group $RESOURCE_GROUP \
        --name $POSTGRES_SERVER_NAME \
        --query "sku.tier" -o tsv)
    
    echo "Sunucu tier: $SERVER_TIER"
    
    # Burstable tier kontrolü
    if [ "$SERVER_TIER" == "Burstable" ]; then
        echo "UYARI: Burstable tier sunucularda manuel yedekleme (on-demand backup) desteklenmemektedir."
        echo "Azure PostgreSQL Flexible Server, otomatik olarak günlük yedeklemeler oluşturur ve bu yedekler yapılandırılmış yedekleme saklama süresine göre saklanır (varsayılan: 7 gün)."
        echo "Daha fazla bilgi için: https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-backup-restore"
        return 1
    fi
    
    return 0
}

function create_backup {
    echo "PostgreSQL veritabanı için manuel yedekleme oluşturuluyor..."
    
    # Sunucu tier kontrolü
    check_server_tier
    if [ $? -ne 0 ]; then
        echo "Manuel yedekleme işlemi iptal edildi."
        return 1
    fi
    
    # Yedekleme dizinini oluştur
    mkdir -p $BACKUP_DIR
    
    # Yedekleme adını oluştur
    BACKUP_NAME="manual_backup_${TIMESTAMP}"
    
    # Azure PostgreSQL Flexible Server'da manuel yedek oluştur
    echo "Azure PostgreSQL Flexible Server'da manuel yedek oluşturuluyor..."
    az postgres flexible-server backup create \
        --resource-group $RESOURCE_GROUP \
        --name $POSTGRES_SERVER_NAME \
        --backup-name $BACKUP_NAME
    
    if [ $? -eq 0 ]; then
        echo "Manuel yedek oluşturuldu. Yedek adı: $BACKUP_NAME"
        echo "Bu yedeği daha sonra geri yüklemek için kullanabilirsiniz."
    else
        echo "Manuel yedek oluşturma işlemi başarısız oldu."
        return 1
    fi
    
    return 0
}

function list_backups {
    echo "Mevcut yedekleri listeleme..."
    
    # Azure PostgreSQL Flexible Server'daki yedekleri listele
    echo "Azure PostgreSQL Flexible Server'daki yedekler:"
    az postgres flexible-server backup list \
        --resource-group $RESOURCE_GROUP \
        --name $POSTGRES_SERVER_NAME
}

function restore_backup {
    if [ -z "$1" ]; then
        echo "Hata: Geri yüklenecek tarih belirtilmedi."
        echo "Kullanım: $0 restore YYYY-MM-DDThh:mm:ss"
        exit 1
    fi
    
    RESTORE_TIMESTAMP=$1
    NEW_SERVER_NAME="${POSTGRES_SERVER_NAME}-restored-${TIMESTAMP}"
    
    echo "PostgreSQL veritabanını $RESTORE_TIMESTAMP tarihindeki yedeğe geri yükleniyor..."
    echo "Yeni sunucu adı: $NEW_SERVER_NAME"
    
    # Azure PostgreSQL Flexible Server'ı belirli bir zamana geri yükle
    az postgres flexible-server restore \
        --name $POSTGRES_SERVER_NAME \
        --resource-group $RESOURCE_GROUP \
        --restore-time $RESTORE_TIMESTAMP \
        --target-server-name $NEW_SERVER_NAME
    
    if [ $? -eq 0 ]; then
        echo "Geri yükleme işlemi başlatıldı."
        echo "Yeni sunucu oluşturuluyor: $NEW_SERVER_NAME"
        echo "Bu işlem birkaç dakika sürebilir."
        echo "İşlem tamamlandığında, yeni sunucuya bağlanabilir ve verileri kontrol edebilirsiniz."
    else
        echo "Geri yükleme işlemi başarısız oldu."
        return 1
    fi
    
    return 0
}

# Ana script
case "$1" in
    backup)
        create_backup
        ;;
    list-backups)
        list_backups
        ;;
    restore)
        restore_backup "$2"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Hata: Geçersiz komut."
        show_help
        exit 1
        ;;
esac

exit 0 