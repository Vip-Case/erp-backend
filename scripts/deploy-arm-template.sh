#!/bin/bash

# Bu script, ARM şablonunu Azure'a dağıtır

# Değişkenler
RESOURCE_GROUP="novent-erp-rg"
LOCATION="westeurope"
DEPLOYMENT_NAME="novent-erp-deployment-$(date +%Y%m%d%H%M%S)"
TEMPLATE_FILE="../azure/arm-template.json"
PARAMETERS_FILE="../azure/arm-parameters.json"

# Azure'a giriş yap
echo "Azure'a giriş yapılıyor..."
az login

# Kaynak grubunu oluştur (yoksa)
echo "Kaynak grubu oluşturuluyor (yoksa)..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# ARM şablonunu dağıt
echo "ARM şablonu dağıtılıyor..."
az deployment group create \
  --name $DEPLOYMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --template-file $TEMPLATE_FILE \
  --parameters $PARAMETERS_FILE

echo "Deployment tamamlandı." 