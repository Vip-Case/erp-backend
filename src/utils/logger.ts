import pino from 'pino';
import fs, { WriteStream } from 'fs';
import dotenv from 'dotenv';
import pinoCaller from 'pino-caller';
import net from 'net';
import { Writable } from 'stream';

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

// Sadece production ortamında Logstash'e bağlan
if (isProduction) {
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

    const logstashWritable = new Writable({
        write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
            try {
                const logObject = JSON.parse(chunk.toString());
                logstashStream.write(JSON.stringify(logObject) + '\n');
                callback();
            } catch (err) {
                console.error('Log gönderme hatası:', err);
                callback(err as Error);
            }
        }
    }) as WriteStream;

    streams.push({ stream: logstashWritable });
}

// Pino logger'ı oluşturuyoruz
const logger = pino(
    {
        level: isProduction ? 'info' : 'debug',
        base: { pid: false },
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    pino.multistream(streams)
    pino.multistream(streams)
);

// Dosya ve satır numarası bilgisini eklemek için pinoCaller kullanın
const loggerWithCaller = pinoCaller(logger);

export default loggerWithCaller;