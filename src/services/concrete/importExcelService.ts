import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import { z } from 'zod';

const prisma = new PrismaClient();

const StockCardSchema = z.object({
    productCode: z.string(),
    productName: z.string(),
    invoiceName: z.string().nullable().optional(),
    shortDescription: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    manufacturerCode: z.string().nullable().optional(),
    companyCode: z.string(),
    branchCode: z.string().nullable().optional(),
    brand: z.string().nullable().optional(),
    unitOfMeasure: z.string().nullable().optional(),
    productType: z.string(),
    marketNames: z.string().nullable().optional(),
    riskQuantities: z.number().nullable().optional(),
    stockStatus: z.boolean(),
    hasExpirationDate: z.boolean().optional(),
    allowNegativeStock: z.boolean().optional()
}).strict();


const CurrentSchema = z.object({
    currentCode: z.string(),
    currentName: z.string(),
    currentType: z.string(),
    institution: z.string(),
    identityNo: z.string().nullable().optional(),
    taxNumber: z.string().nullable().optional(),
    taxOffice: z.string().nullable().optional(),
    birthOfDate: z.preprocess((arg) => {
        if (typeof arg === "number") {
            // Excel tarihlerinde, 1 Ocak 1900'den itibaren gün sayısı olarak gösterildiği için bu dönüşümü yapıyoruz
            return new Date((arg - 25569) * 86400 * 1000);
        }
        return arg;
    }, z.date()),
    KepAdress: z.string().nullable().optional(),
    MersisNo: z.preprocess((arg) => String(arg), z.string()),
    accounts: z.string().nullable().optional(),
    works: z.string().nullable().optional(),
    plasiyer: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    countryCode: z.preprocess((arg) => String(arg), z.string().nullable().optional()),
    city: z.string().nullable().optional(),
    district: z.string().nullable().optional(),
    phone: z.preprocess((arg) => String(arg), z.string().nullable().optional()),
    email: z.string().nullable().optional(),
    website: z.string().nullable().optional(),
    companyCode: z.string(),
    branchCode: z.string(),
    warehouseCode: z.string(),
    priceListId: z.string()
}).strict();

// Gerekli enumları tanımlayın
const DocumentType = z.enum(['Invoice', 'Order', 'Waybill', 'Other']); // enum değerleri örnektir, doğru değerleri ekleyin
const InvoiceType = z.enum(['Purchase', 'Sales', 'Return', 'Cancel', 'Other']); // enum değerleri örnektir
const StokManagementType = z.enum(['Devir', 'DepolarArasiTransfer', 'Uretim', 'Muhtelif', 'Maliyet', 'Konsinye', 'Teshir']); // örnektir, projede kullanılan türleri ekleyin

const StockMovementSchema = z.object({
    productCode: z.string(),
    warehouseCode: z.string(),
    branchCode: z.string(),
    currentCode: z.string().nullable().optional(),
    documentType: DocumentType.optional(),
    invoiceType: InvoiceType.optional(),
    movementType: StokManagementType,
    documentNo: z.string().nullable().optional(),
    gcCode: z.string().nullable().optional(),
    type: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    quantity: z.number().nullable().optional(), // Decimal tipte sayısal veri için numara kullanılır
    unitPrice: z.number().nullable().optional(),
    totalPrice: z.number().nullable().optional(),
    unitOfMeasure: z.string().max(50).nullable().optional(),
    outWarehouseCode: z.string().nullable().optional(),
    priceListId: z.string().nullable().optional()
}).strict();

const CurrentMovementType = z.enum(['Borc', 'Alacak']);
const CurrentMovementDocumentType = z.enum(['Devir', 'Fatura', 'IadeFatura', 'Kasa', 'MusteriSeneti',
     'BorcSeneti', 'MusteriCeki', 'BorcCeki', 'KarsiliksizCek', 'Muhtelif']);

     const CurrentMovementSchema = z.object({
        currentCode: z.string().nullable().optional(),
        dueDate: z.preprocess((arg) => {
            if (typeof arg === "number") {
                return new Date((arg - 25569) * 86400 * 1000);
            }
            return arg;
        }, z.date().nullable().optional()),
        description: z.string().max(250).nullable().optional(),
        debtAmount: z.preprocess((arg) => parseFloat(arg as string), z.number().nullable().optional()),
        creditAmount: z.preprocess((arg) => parseFloat(arg as string), z.number().nullable().optional()),
        balanceAmount: z.preprocess((arg) => parseFloat(arg as string), z.number().nullable().optional()),
        priceListId: z.string().nullable().optional(),
        movementType: CurrentMovementType.optional(),
        documentType: CurrentMovementDocumentType.nullable().optional(),
        documentNo: z.string().nullable().optional(),
        companyCode: z.string(),
        branchCode: z.string()
    }).strict();

// `undefined` olan alanları `null` yapacak helper fonksiyon
function replaceUndefinedWithNull(data: Record<string, any>) {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
            key,
            value === undefined || value === "undefined" ? null : value
        ])
    );
}

export const importExcelService = async (file: File) => {
    if (!file || !file.name.endsWith('.xlsx')) {
        throw new Error("Geçerli bir Excel dosyası yükleyin.");
    }

    try {
        const buffer = await file.arrayBuffer();
        const workbook = xlsx.read(Buffer.from(buffer), { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        const firstRow = data[0];
        let isStockCard = StockCardSchema.safeParse(firstRow).success;
        let isCurrent = CurrentSchema.safeParse(firstRow).success;
        let isStockMovement = StockMovementSchema.safeParse(firstRow).success;
        let isCurrentMovement = CurrentMovementSchema.safeParse(firstRow).success;

        console.log("StockCard uyumlu mu?:", isStockCard);
        console.log("Current uyumlu mu?:", isCurrent);
        console.log("Stok hareketleri uyumlu mu?:", isStockMovement);
        console.log("Cari hareketleri uyumlu mu?:", isCurrentMovement);

        if (!isStockCard && !isCurrent && !isStockMovement && !isCurrentMovement) {
            throw new Error("Dosya formatı geçerli değil. Lütfen StockCard, Current, StockMovement veya CurrentMovement formatında bir dosya yükleyin.");
        }

        const stockCardsData: any[] = [];
        const currentsData: any[] = [];
        const stockMovementsData: any[] = [];
        const currentMovementsData: any[] = [];

        for (const row of data as Record<string, any>[]) {
            if (isStockCard) {
                const stockCardValidation = StockCardSchema.safeParse(row);
                if (stockCardValidation.success) {
                    stockCardsData.push(replaceUndefinedWithNull(stockCardValidation.data));
                }
            } else if (isCurrent) {
                const currentValidation = CurrentSchema.safeParse(row);
                if (currentValidation.success) {
                    const rowData = replaceUndefinedWithNull(currentValidation.data);
                    currentsData.push(rowData);

                    Object.entries(rowData).forEach(([key, value]) => {
                        console.log(`Alan: ${key}, Değer: ${value}, Uzunluk: ${typeof value === "string" ? value.length : "N/A"}`);
                    });
                } else {
                    console.log("Eklenmeyen satır:", row);
                    console.log("Hata nedeni:", currentValidation.error.errors);
                }
            } else if (isStockMovement) {
                const stockMovementValidation = StockMovementSchema.safeParse(row);
                if (stockMovementValidation.success) {
                    stockMovementsData.push(replaceUndefinedWithNull(stockMovementValidation.data));
                }
            } else if (isCurrentMovement) {
                // CurrentMovement özel doğrulama ve veri ekleme işlemi
                const filledRow = {
                    dueDate: row.dueDate ?? null,
                    debtAmount: row.debtAmount ?? 0,
                    creditAmount: row.creditAmount ?? 0,
                    balanceAmount: row.balanceAmount ?? 0,
                    ...row,
                };
                const validation = CurrentMovementSchema.safeParse(filledRow);
                if (validation.success) {
                    currentMovementsData.push(replaceUndefinedWithNull(validation.data));
                }
            }
        }

        // Satır satır ekleme veya güncelleme
        if (currentsData.length > 0) {
            for (const row of currentsData) {
                try {
                    await prisma.current.upsert({
                        where: { currentCode: row.currentCode }, // `currentCode` eşleşmesine göre kontrol
                        update: {
                            ...row,
                            countryCode: row.countryCode ?? null,
                            phone: row.phone ?? null
                        },
                        create: {
                            ...row,
                            countryCode: row.countryCode ?? null,
                            phone: row.phone ?? null
                        }
                    });
                    console.log("Kayıt başarıyla eklendi veya güncellendi:", row);
                } catch (error) {
                    console.log("Hata veren kayıt:", row);
                    console.error("Hata nedeni:", error);
                }
            }
        }

        if (stockCardsData.length > 0) {
            await prisma.stockCard.createMany({ data: stockCardsData, skipDuplicates: true });
            console.log("StockCard verileri başarıyla kaydedildi.");
        }

        if (stockMovementsData.length > 0) {
            await prisma.stockMovement.createMany({ data: stockMovementsData, skipDuplicates: true });
            console.log("StockMovement verileri başarıyla kaydedildi.");
        }

        if (currentMovementsData.length > 0) {
            await prisma.currentMovement.createMany({ data: currentMovementsData, skipDuplicates: true });
            console.log("CurrentMovement verileri başarıyla kaydedildi.");
        }

        return { message: 'Veriler başarıyla işlendi. Tekrarlı kayıtlar atlandı.' };
    } catch (error) {
        console.error("Veritabanı işlemlerinde bir hata oluştu:", error);
        throw new Error("Bir hata oluştu: " + (error as Error).message);
    }
};
