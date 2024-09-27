// src/scripts/setupMongoDB.ts

import mongoose from 'mongoose';
import { mongoConfig } from '../config/database';
import { StockCardImage, StockCardVideo } from '../models/stockCardMedia';

async function setupMongoDB() {
try {
// MongoDB'ye bağlan
await mongoose.connect(mongoConfig.url);
console.log('MongoDB\'ye başarıyla bağlandı.');

// Koleksiyonları oluştur (eğer yoksa)
await StockCardImage.createCollection();
await StockCardVideo.createCollection();
console.log('Koleksiyonlar başarıyla oluşturuldu.');

// İndeksleri oluştur
await StockCardImage.createIndexes();
await StockCardVideo.createIndexes();
console.log('İndeksler başarıyla oluşturuldu.');

// Örnek veri ekle (isteğe bağlı)
await addSampleData();

console.log('MongoDB kurulumu tamamlandı.');
} catch (error) {
console.error('MongoDB kurulumu sırasında hata oluştu:', error);
} finally {
await mongoose.disconnect();
}
}

async function addSampleData() {
// Örnek veri ekleme işlemi
const sampleImage = new StockCardImage({
stockCardId: 'sample-stock-card-id',
imageUrl: 'https://example.com/sample-image.jpg',
isDefault: true
});

const sampleVideo = new StockCardVideo({
stockCardId: 'sample-stock-card-id',
videoUrl: 'https://example.com/sample-video.mp4'
});

await sampleImage.save();
await sampleVideo.save();
console.log('Örnek veriler eklendi.');
}

// Script'i çalıştır
setupMongoDB();