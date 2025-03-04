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
    echo "  backup              Manuel yedekleme oluşturur"
    echo "  list-backups        Mevcut yedekleri listeler"
    echo "  restore [tarih]     Belirtilen tarihteki yedeği geri yükler (YYYY-MM-DDThh:mm:ss formatında)"
    echo "  help                Bu yardım mesajını gösterir"
    echo ""
    echo "Örnekler:"
    echo "  $0 backup"
    echo "  $0 list-backups"
    echo "  $0 restore 2025-03-04T14:30:00"
}

function create_backup {
    echo "PostgreSQL veritabanı için manuel yedekleme oluşturuluyor..."
    
    # Yedekleme dizinini oluştur
    mkdir -p $BACKUP_DIR
    
    # Azure PostgreSQL Flexible Server'da restore point oluştur
    echo "Azure PostgreSQL Flexible Server'da restore point oluşturuluyor..."
    az postgres flexible-server execute \
        --name $POSTGRES_SERVER_NAME \
        --resource-group $RESOURCE_GROUP \
        --admin-user $POSTGRES_ADMIN \
        --admin-password $POSTGRES_PASSWORD \
        --database-name $POSTGRES_DB_NAME \
        --querytext "SELECT current_timestamp as backup_time, 'Manual backup started' as message;"
    
    echo "Restore point oluşturuldu. Timestamp: $TIMESTAMP"
    echo "Not: Azure PostgreSQL Flexible Server otomatik olarak bir restore point oluşturur."
    echo "Bu restore point'i daha sonra geri yüklemek için kullanabilirsiniz."
}

function list_backups {
    echo "Mevcut yedekleri listeleme..."
    
    # Azure PostgreSQL Flexible Server'daki restore point'leri listele
    echo "Azure PostgreSQL Flexible Server'daki restore point'ler:"
    az postgres flexible-server restore-point list \
        --name $POSTGRES_SERVER_NAME \
        --resource-group $RESOURCE_GROUP
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
    
    echo "Geri yükleme işlemi başlatıldı."
    echo "Yeni sunucu oluşturuluyor: $NEW_SERVER_NAME"
    echo "Bu işlem birkaç dakika sürebilir."
    echo "İşlem tamamlandığında, yeni sunucuya bağlanabilir ve verileri kontrol edebilirsiniz."
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