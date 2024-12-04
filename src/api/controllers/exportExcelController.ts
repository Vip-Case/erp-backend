import { exportStockCardsToExcel } from '../../services/concrete/exportExcelService';
import fs from 'fs';

export const exportExcelController = async (context: any) => {
    try {
        //await exportStockCardsToExcel(); // Dosyanın oluşturulmasını sağlar
        // Excel dosyasını oluştur
        await Promise.race([
            exportStockCardsToExcel(),
            //timeoutPromise(500) // 10 saniye zaman aşımı
        ]);

        // Önce dosyanın mevcut olduğundan emin olun
        console.log("Excel dosyası oluşturulmaya başlandı.");

        const { filePath } = await exportStockCardsToExcel();

        if (!fs.existsSync(filePath)) {
            console.error("Dosya mevcut değil:", filePath);
            return new Response(JSON.stringify({ error: "Excel dosyası bulunamadı." }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const fileBuffer = fs.readFileSync(filePath);

        console.log("Dosya başarıyla oluşturuldu ve tarayıcıya gönderiliyor.");

        return new Response(fileBuffer, {
            status: 200,
            headers: {
                'Content-Disposition': 'attachment; filename="stokCard.xlsx"',
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });
    } catch (error) {
        console.error("Hata oluştu:", error);
        return new Response(JSON.stringify({ error: "Excel dosyası oluşturulamadı." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
function timeoutPromise(ms: number): Promise<void> {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Operation timed out after ${ms} ms`));
        }, ms);
    });
}

