import { importExcelService } from '../../services/concrete/importExcelService';
import { Context } from 'elysia';

export const importExcelController = async (context: Context) => {
    const body = await context.request.formData();
    const excelFile = body.get('excelFile') as File;

    if (!excelFile || excelFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return { error: "Geçerli bir Excel dosyası yüklenmedi" };
    }

    try {
        const result = await importExcelService(excelFile);
        return { result };
    } catch (error) {
        console.error("Hata oluştu:", error);
        return { error: "Bir hata oluştu: " + (error as Error).message };
    }
};
