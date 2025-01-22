import pino from 'pino';
import fs from 'fs';
import dotenv from 'dotenv';
import pinoCaller from 'pino-caller';
import net from 'net';

dotenv.config();

// Ortamı belirleyelim (development, production)
const isProduction = process.env.NODE_ENV === 'production';

// Log klasörünü oluştur (eğer yoksa)
if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}

const logFilePath = `./logs/app-log-${new Date().toISOString().split('T')[0]}.log`;

// Logstash bağlantısı için stream oluştur
const logstashStream = (() => {
    const stream = new net.Socket();
    const logstashHost = process.env.LOGSTASH_URL?.split(':')[0] || 'localhost';
    const logstashPort = parseInt(process.env.LOGSTASH_URL?.split(':')[1] || '5044');

    stream.connect(logstashPort, logstashHost, () => {
        console.log('Logstash bağlantısı başarılı');
    });

    stream.on('error', (err) => {
        console.error('Logstash bağlantı hatası:', err);
    });

    return stream;
})();

// Stream'leri oluştur
const streams = [
    { stream: fs.createWriteStream(logFilePath, { flags: 'a' }) },
    {
        stream: {
            write: (msg: string) => {
                try {
                    const logObject = JSON.parse(msg);
                    logstashStream.write(JSON.stringify(logObject) + '\n');
                } catch (err) {
                    console.error('Log gönderme hatası:', err);
                }
            }
        }
    }
];

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
