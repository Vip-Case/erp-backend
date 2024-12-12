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

// Pino logger'ı oluşturuyoruz
const logger = pino(
    {
        level: isProduction ? 'info' : 'debug',
        base: { pid: false },
        timestamp: pino.stdTimeFunctions.isoTime,
        transport: isProduction
            ? {
                targets: [
                    {
                        target: 'pino/file',
                        options: {
                            destination: logFilePath,
                        },
                    },
                    {
                        target: 'pino-socket',
                        options: {
                            address: 'logstash', // Docker içindeki Logstash servisi
                            port: 5044, // Logstash'ın dinlediği port
                        },
                    },
                ],
            }
            : {
                targets: [
                    {
                        target: 'pino-pretty',
                        options: {
                            colorize: true,
                            levelFirst: true,
                            translateTime: 'SYS:standard',
                            ignore: 'pid,hostname',
                        },
                    },
                    {
                        target: 'pino/file',
                        options: {
                            destination: logFilePath,
                        },
                    },
                    {
                        target: 'pino-socket',
                        options: {
                            address: 'logstash', // Docker içindeki Logstash servisi
                            port: 5044, // Logstash'ın dinlediği port
                        },
                    },
                ],
            },
    }
);

// Dosya ve satır numarası bilgisini eklemek için pinoCaller kullanın
const loggerWithCaller = pinoCaller(logger);

export default loggerWithCaller;