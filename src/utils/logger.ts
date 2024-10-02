import pino from "pino";
import pretty from 'pino-pretty';
import fs from 'fs';
import { multistream } from 'pino-multi-stream';

// Ortamı belirleyelim (development, production)
const isProduction = process.env.NODE_ENV === 'production';

// Log formatı ve dosya rotasyonu için güncellenmiş dosya adı
const logFilePath = `./logs/app-log-${new Date().toISOString().split('T')[0]}.log`;

// Gelişmiş log formatı
const logFormat = pretty({
    colorize: true, // Renkli konsol çıktısı
    levelFirst: true, // Log seviyesini başa koy
    translateTime: 'SYS:standard', // İnsan okunabilir zaman damgası
    ignore: 'pid,hostname', // Gereksiz alanları gösterme
});

// Konsol ve dosya için multi-stream yapılandıralım
const streams = [
    { stream: logFormat }, // Konsola logları yazdır
    { stream: fs.createWriteStream(logFilePath, { flags: 'a' }) } // Log dosyasına yazdır
];

// Pino logger'ı oluşturuyoruz
const logger = pino({
    level: isProduction ? 'info' : 'debug', // Üretimde 'info', geliştirme ortamında 'debug'
    formatters: {
        level(label) {
            return { level: label }; // JSON formatında seviyeleri özelleştirdik
        },
    },
    base: { pid: false }, // Proses ID'sini loglardan çıkartıyoruz
    timestamp: pino.stdTimeFunctions.isoTime, // ISO zaman damgası
}, multistream(streams));

// Logger'ı dışa aktarıyoruz
export default logger;
