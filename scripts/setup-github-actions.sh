#!/bin/bash

# GitHub Actions için Azure kimlik bilgilerini oluşturan script
# Bu script, GitHub Actions'ın Azure kaynaklarına erişmesi için gerekli kimlik bilgilerini oluşturur

# Değişkenler
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
RESOURCE_GROUP="novent-erp-rg"
SERVICE_PRINCIPAL_NAME="github-actions-sp"

# Service Principal oluşturma
echo "Service Principal oluşturuluyor: $SERVICE_PRINCIPAL_NAME"
SP_JSON=$(az ad sp create-for-rbac --name $SERVICE_PRINCIPAL_NAME \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP \
  --sdk-auth)

# JSON çıktısını gösterme
echo "Aşağıdaki JSON'u GitHub repository secrets olarak 'AZURE_CREDENTIALS' adıyla kaydedin:"
echo $SP_JSON

echo "Ayrıca, aşağıdaki değerleri de ayrı ayrı GitHub secrets olarak kaydedebilirsiniz:"
echo "AZURE_CLIENT_ID: $(echo $SP_JSON | jq -r .clientId)"
echo "AZURE_CLIENT_SECRET: $(echo $SP_JSON | jq -r .clientSecret)"
echo "AZURE_SUBSCRIPTION_ID: $(echo $SP_JSON | jq -r .subscriptionId)"
echo "AZURE_TENANT_ID: $(echo $SP_JSON | jq -r .tenantId)"

echo "Not: Bu bilgileri güvenli bir şekilde saklayın ve paylaşmayın!" 