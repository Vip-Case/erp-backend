#!/bin/bash

# Bu script, Docker imajını yerel olarak test eder

# Docker Compose ile servisleri başlat
echo "Docker Compose ile servisleri başlatılıyor..."
docker-compose up -d

# Servislerin durumunu kontrol et
echo "Servislerin durumu kontrol ediliyor..."
docker-compose ps

# API'nin çalışıp çalışmadığını kontrol et
echo "API'nin çalışıp çalışmadığı kontrol ediliyor..."
sleep 10  # API'nin başlaması için bekle
curl -s http://localhost:1303/health || echo "API henüz çalışmıyor, lütfen bekleyin..."

echo "Test tamamlandı. Servisleri durdurmak için 'docker-compose down' komutunu kullanabilirsiniz." 