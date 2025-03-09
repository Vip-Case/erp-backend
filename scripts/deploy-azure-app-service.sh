#!/bin/bash

# Bu script, Azure App Service'e deployment yapar

# Değişkenler
RESOURCE_GROUP="novent-erp-rg"
APP_SERVICE_NAME="novent-erp-api"
ACR_NAME="noventacr"
IMAGE_NAME="erp-api"
TAG=$(date +%Y%m%d%H%M%S)  # Tarih ve saat bazlı tag

# Azure'a giriş yap
echo "Azure'a giriş yapılıyor..."
az login

# Azure Container Registry'ye giriş yap
echo "Azure Container Registry'ye giriş yapılıyor..."
az acr login --name $ACR_NAME

# Docker imajını oluştur
echo "Docker imajı oluşturuluyor..."
docker build -t $ACR_NAME.azurecr.io/$IMAGE_NAME:$TAG -t $ACR_NAME.azurecr.io/$IMAGE_NAME:latest .

# Docker imajını Azure Container Registry'ye gönder
echo "Docker imajı Azure Container Registry'ye gönderiliyor..."
docker push $ACR_NAME.azurecr.io/$IMAGE_NAME:$TAG
docker push $ACR_NAME.azurecr.io/$IMAGE_NAME:latest

# App Service'i güncelle
echo "App Service güncelleniyor..."
az webapp config container set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE_NAME \
  --docker-custom-image-name $ACR_NAME.azurecr.io/$IMAGE_NAME:$TAG \
  --docker-registry-server-url https://$ACR_NAME.azurecr.io \
  --docker-registry-server-user $(az acr credential show -n $ACR_NAME --query username -o tsv) \
  --docker-registry-server-password $(az acr credential show -n $ACR_NAME --query passwords[0].value -o tsv)

# App Service'i yeniden başlat
echo "App Service yeniden başlatılıyor..."
az webapp restart --resource-group $RESOURCE_GROUP --name $APP_SERVICE_NAME

# Veritabanı migrasyonlarını çalıştır
echo "Veritabanı migrasyonları çalıştırılıyor..."
# Burada Prisma migrate komutunu çalıştırabilirsiniz
# Örnek: bunx prisma migrate deploy

echo "Deployment tamamlandı. İmaj: $ACR_NAME.azurecr.io/$IMAGE_NAME:$TAG" 