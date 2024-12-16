import { exec } from "child_process";
import path from "path";
import fs from "fs";

// PostgreSQL Ayarları
const DB_USER = "postgres";
const DB_HOST = "localhost";
const DB_PORT = "5432";
const DB_NAME = "erp_db";
const PG_DUMP_PATH = `"C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe"`;
const BACKUP_DIR = path.join("A:\\ERP_Backups");

// Veritabanını yedekle
export const backupDatabase = async (): Promise<void> => {
    try {
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }

        const backupFile = path.join(
            BACKUP_DIR,
            `backup_${new Date().toISOString().replace(/[:.]/g, "-")}.sql`
        );

        const command = `${PG_DUMP_PATH} -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} ${DB_NAME} > ${backupFile}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Yedekleme sırasında hata oluştu: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Yedekleme stderr: ${stderr}`);
            }
            console.log(`Yedekleme başarılı: ${backupFile}`);
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Yedekleme başarısız: ${err.message}`);
        } else {
            console.error(`Yedekleme başarısız: ${err}`);
        }
    }
};

// Eski dosyaları temizle
export const cleanOldBackups = (): void => {
    const files = fs.readdirSync(BACKUP_DIR);
    const now = Date.now();

    files.forEach((file) => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        const ageInDays = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

        if (ageInDays > 7) {
            fs.unlinkSync(filePath);
            console.log(`Silindi: ${filePath}`);
        }
    });
};
