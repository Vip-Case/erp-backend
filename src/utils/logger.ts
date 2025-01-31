import pino from 'pino';
import fs from 'fs';
import dotenv from 'dotenv';
import pinoCaller from 'pino-caller';

dotenv.config();

// Ortamı belirleyelim (development, production)
const isProduction = process.env.NODE_ENV === 'production';

// Log klasörünü oluştur (eğer yoksa)
if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}

const logFilePath = `./logs/app-log-${new Date().toISOString().split('T')[0]}.log`;

// Stream'leri oluştur
const streams = [
    { stream: fs.createWriteStream(logFilePath, { flags: 'a' }) }
];

// Sadece production ortamında Logstash'e bağlanmayı dene
if (isProduction) {
    try {
        streams.push({
            stream: pino.transport({
                target: 'pino-socket',
                options: {
                    address: 'logstash',
                    port: 5044,
                    reconnectInterval: 1000,
                    timeout: 2000,
                    onError: (error: Error) => {
                        console.warn('Logstash bağlantı hatası:', error.message);
                    }
                }
            })
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.warn('Logstash transport oluşturulamadı:', error.message);
        } else {
            console.warn('Logstash transport oluşturulamadı: Bilinmeyen hata');
        }
    }
}

// Pino logger'ı oluşturuyoruz
const logger = pino(
    {
        level: isProduction ? 'info' : 'debug',
        base: { pid: false },
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    pino.multistream(streams)
);

// Dosya ve satır numarası bilgisini eklemek için pinoCaller kullanın
const loggerWithCaller = pinoCaller(logger);

export default loggerWithCaller;