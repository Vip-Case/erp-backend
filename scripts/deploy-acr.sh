#!/bin/bash

# Bu script, Docker imajını oluşturur ve Azure Container Registry'ye gönderir

# Değişkenler
ACR_NAME="noventacr"  # Azure Container Registry adı
IMAGE_NAME="erp-api"  # Docker imajı adı
TAG=$(date +%Y%m%d%H%M%S)  # Tarih ve saat bazlı tag

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

echo "İşlem tamamlandı. İmaj: $ACR_NAME.azurecr.io/$IMAGE_NAME:$TAG" 