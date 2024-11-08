import { exportStockCardsToExcel } from '../../services/concrete/exportExcelService';
import fs from 'fs';
import { Context } from 'elysia';
import prisma from '../../config/prisma';

// Zaman aşımı fonksiyonu
const timeoutPromise = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));


export const exportExcelController = async (context: any) => {
    try {
         //await exportStockCardsToExcel(); // Dosyanın oluşturulmasını sağlar
         // Excel dosyasını oluştur
        await Promise.race([
            exportStockCardsToExcel(),
            timeoutPromise(500) // 10 saniye zaman aşımı
        ]);

        // Önce dosyanın mevcut olduğundan emin olun
        const filePath = 'StockCards.xlsx';
        if (!fs.existsSync(filePath)) {
            return new Response('Excel dosyası bulunamadı.', { status: 404 });
        }

        // Dosyayı okuyun ve yanıt olarak döndürün
        const fileBuffer = fs.readFileSync(filePath);
        return new Response(fileBuffer, {
            headers: {
                'Content-Disposition': 'attachment; filename="StockCards.xlsx"',
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });
    } catch (error) {
        console.error("Hata oluştu:", error);
        return new Response('Excel dosyası oluşturulamadı.', { status: 500 });
    }
}


