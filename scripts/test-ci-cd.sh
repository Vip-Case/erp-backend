#!/bin/bash

# CI/CD pipeline'ını test etmek için script
# Bu script, CI/CD pipeline'ının doğru çalışıp çalışmadığını test eder

# Değişkenler
RESOURCE_GROUP="novent-erp-rg"
ACR_NAME="noventacr"
WEBAPP_NAME="novent-erp-api"
CONTAINER_IMAGE_NAME="erp-api"
TAG="test-$(date +%Y%m%d%H%M%S)"

echo "CI/CD Pipeline Test Başlatılıyor..."

# Docker imajı oluşturma
echo "Docker imajı oluşturuluyor: $ACR_NAME.azurecr.io/$CONTAINER_IMAGE_NAME:$TAG"
docker build -t $ACR_NAME.azurecr.io/$CONTAINER_IMAGE_NAME:$TAG .

# ACR'ye login olma
echo "ACR'ye login olunuyor: $ACR_NAME"
az acr login --name $ACR_NAME

# Docker imajını ACR'ye gönderme
echo "Docker imajı ACR'ye gönderiliyor"
docker push $ACR_NAME.azurecr.io/$CONTAINER_IMAGE_NAME:$TAG

# App Service'i güncelleme
echo "App Service güncelleniyor: $WEBAPP_NAME"
az webapp config container set --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP --docker-custom-image-name $ACR_NAME.azurecr.io/$CONTAINER_IMAGE_NAME:$TAG

# App Service'i yeniden başlatma
echo "App Service yeniden başlatılıyor"
az webapp restart --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP

# Sağlık kontrolü
echo "Sağlık kontrolü yapılıyor..."
sleep 10
response=$(curl -s -o /dev/null -w "%{http_code}" https://$WEBAPP_NAME.azurewebsites.net/api/health)
if [ "$response" != "200" ]; then
  echo "Sağlık kontrolü başarısız! Durum kodu: $response"
  exit 1
else
  echo "Sağlık kontrolü başarılı! Durum kodu: $response"
fi

echo "CI/CD Pipeline Test Tamamlandı!" 