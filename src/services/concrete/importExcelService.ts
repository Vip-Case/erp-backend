import { Prisma, PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import { z } from 'zod';
import currentService from './currentService';

const prisma = new PrismaClient();

const ProductType = z.enum(['BasitUrun', 'VaryasyonluUrun', 'DijitalUrun', 'Hizmet']);
const StockUnits = z.enum(['Adet', 'Kg', 'Lt', 'M', 'M2', 'M3', 'Paket', 'Kutu', 'Koli', 'Ton', 'Dolar', 'Euro', 'TL']);

const StockCardSchema = z.object({
    productCode: z.string(),
    productName: z.string(),
    unit: StockUnits,
    shortDescription: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    companyCode: z.string().nullable().optional(),
    branchCode: z.string().nullable().optional(),
    brandId: z.string().nullable().optional(),
    productType: ProductType,
    gtip: z.string().nullable().optional(),
    pluCode: z.string().nullable().optional(),
    desi: z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    adetBoleni: z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    siraNo: z.string().nullable().optional(),
    raf: z.string().nullable().optional(),
    karMarji: z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    riskQuantities: z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    maliyet: z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    maliyetDoviz: z.string().nullable().optional(),
    stockStatus: z.boolean(),
    hasExpirationDate: z.boolean().optional(),
    allowNegativeStock: z.boolean().optional(),
    categoryId: z.string().nullable().optional(),
    taxName: z.string().nullable().optional(),
    taxRate: z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    marketName: z.string().nullable().optional(),
    barcode: z.string().nullable().optional(),
    priceListId: z.string().nullable().optional(),
    price: z.union([z.string(), z.number()]).nullable().optional(),
    attributeId: z.string().nullable().optional(),
    warehouseId: z.string().nullable().optional(),
    quantity: z.union([z.string(), z.number()]).nullable().optional()
}).strict();


const CurrentType = z.enum(['AliciSatici', 'Alici', 'Satici', 'Personel', 'SanalPazar', 'Kurum', 'AnaGrupSirketi',
    'Ithalat', 'Ihracat', 'IthalatIhracat', 'Musteri', 'Tedarikci', 'Diger']);

const InstitutionType = z.enum(['Sirket', 'Sahis']);
const AddressType = z.enum(['Fatura', 'Sevk', 'Teslimat']);

const CurrentSchema = z.object({
    currentCode: z.string(),
    currentName: z.string(),
    currentType: CurrentType,
    institution: InstitutionType,
    identityNo: z.string().nullable(),
    taxNumber: z.string().nullable(),
    taxOffice: z.string().nullable(),
    title: z.string().nullable(),
    name: z.string().nullable(),
    surname: z.string().nullable(),
    webSite: z.string().nullable(),
    birthOfDate: z.preprocess((arg) => {
        if (typeof arg === "number") {
            return new Date((arg - 25569) * 86400 * 1000);
        }
        return arg;
    }, z.date().nullable()),
    kepAddress: z.string().nullable(),
    mersisNo: z.string().nullable(),
    sicilNo: z.string().nullable(),
    priceListId: z.string().optional(),
    note: z.string(),
    branchCode: z.string(),
    addressName: z.string(),
    addressType: AddressType,
    address: z.string(),
    countryCode: z.string(),
    city: z.string(),
    district: z.string(), postalCode: z.union([z.string(), z.number()]).transform((val) => String(val)),
    phone: z.union([z.string(), z.number()]).transform((val) => String(val)),
    phone2: z.union([z.string(), z.number()]).transform((val) => String(val)),
    email: z.string().email(),
    email2: z.string().email(),
    bankName: z.string(),
    bankBranch: z.string(),
    bankBranchCode: z.string(),
    iban: z.string(),
    accountNo: z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    currency: z.string(),
    teminatYerelTutar: z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    acikHesapYerelLimit: z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    hesapKesimGunu: z.number().nullable().optional(),
    vadeGun: z.number().nullable().optional(),
    gecikmeLimitGunu: z.number().nullable().optional(),
    varsayilanAlisIskontosu: z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    varsayilanSatisIskontosu: z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    ekstreGonder: z.boolean().nullable().optional(),
    limitKontrol: z.boolean().nullable().optional(),
    acikHesap: z.boolean().nullable().optional(),
    posKullanim: z.boolean().nullable().optional(),
    categoryId: z.string().nullable().optional(),
    groupId: z.string().nullable().optional(),
});

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

        const stockCardsData: any[] = [];
        const currentsData: any[] = [];
        const stockMovementsData: any[] = [];
        const currentMovementsData: any[] = [];

        const firstRow = data[0];
        console.log(data)
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

                } else {
                    console.log("Eklenmeyen satır:", row);
                    console.log("Hata nedeni:", currentValidation.error.issues);
                    console.log("Doğrulama hataları:", currentValidation.error.format());
                    throw new Error("Veri doğrulaması başarısız oldu.");
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

        // Verileri işliyoruz
        for (const stockCardData of stockCardsData) {
            try {
                // StockCard kaydının olup olmadığını kontrol edin
                const existingStockCard = await prisma.stockCard.findUnique({
                    where: { productCode: stockCardData.productCode },
                });

                if (existingStockCard) {
                    console.log(`Uyarı: StockCard zaten mevcut - ProductCode: ${stockCardData.productCode}`);
                    continue; // Eğer kayıt mevcutsa, yeni bir kayıt oluşturma
                }

                // Yeni `StockCard` kaydı oluşturma
                const stockCard = await prisma.stockCard.create({
                    data: {
                        productCode: stockCardData.productCode,
                        productName: stockCardData.productName,
                        unit: stockCardData.unit,
                        shortDescription: stockCardData.shortDescription,
                        description: stockCardData.description,
                        productType: stockCardData.productType,
                        gtip: stockCardData.gtip,
                        pluCode: stockCardData.pluCode,
                        raf: stockCardData.raf,
                        maliyetDoviz: stockCardData.maliyetDoviz,
                        stockStatus: stockCardData.stockStatus,
                        hasExpirationDate: stockCardData.hasExpirationDate,
                        allowNegativeStock: stockCardData.allowNegativeStock,
                        Company: stockCardData.companyCode ? {
                            connect: { companyCode: stockCardData.companyCode }
                        } : undefined,
                        Branch: stockCardData.branchCode ? {
                            connect: { branchCode: stockCardData.branchCode }
                        } : undefined,
                        Brand: stockCardData.brandId ? {
                            connect: { id: stockCardData.brandId }
                        } : undefined,
                        // İlişkili Kategori
                        Categories: stockCardData.categoryId ? {
                            create: [{
                                category: {
                                    connect: { id: stockCardData.categoryId }
                                }
                            }]
                        } : undefined,
                        // İlişkili Vergi Bilgileri
                        TaxRates: stockCardData.taxName && stockCardData.taxRate ? {
                            create: [{
                                taxName: stockCardData.taxName,
                                taxRate: stockCardData.taxRate
                            }]
                        } : undefined,
                        // İlişkili Market İsimleri
                        StockCardMarketNames: stockCardData.marketName ? {
                            create: [{
                                marketName: stockCardData.marketName
                            }]
                        } : undefined,
                        // İlişkili Barkodlar
                        Barcodes: stockCardData.barcode ? {
                            create: [{
                                barcode: stockCardData.barcode
                            }]
                        } : undefined,
                        // İlişkili Fiyat Listesi
                        StockCardPriceLists: stockCardData.priceListId ? {
                            create: [{
                                priceList: {
                                    connect: { id: stockCardData.priceListId }
                                },
                                price: stockCardData.price // price alanını burada sağlıyoruz
                            }]
                        } : undefined,
                        // İlişkili Özellikler
                        StockCardAttributeItems: stockCardData.attributeId ? {
                            create: [{
                                attribute: {
                                    connect: { id: stockCardData.attributeId }
                                }
                            }]
                        } : undefined,
                        // İlişkili Depolar
                        StockCardWarehouse: stockCardData.warehouseId && stockCardData.quantity ? {
                            create: [{
                                warehouse: {
                                    connect: { id: stockCardData.warehouseId }
                                },
                                quantity: stockCardData.quantity // Burada quantity belirtiliyor
                            }]
                        } : undefined,
                    },
                });

                console.log(`StockCard başarıyla oluşturuldu - ProductCode: ${stockCardData.productCode}`);

            } catch (error: any) {
                console.error(`Hata: ${stockCardData.productCode} için veri işlenemedi.`, error.message || error);
            }
        }

        
        const currentsService = new currentService();

        // Verileri işliyoruz
        for (const currentData of currentsData) {
            // currentData'dan priceListId'yi ayırıyoruz
            const { priceListId, ...currentDataWithoutPriceListId } = currentData;

            // Current ana verisi
            const current: Prisma.CurrentCreateInput = {
                priceList: {
                    connect: { id: currentData.priceListId },
                },
                currentCode: currentData.currentCode,
                currentName: currentData.currentName,
                currentType: currentData.currentType,
                institution: currentData.institution,
                identityNo: currentData.identityNo,
                taxNumber: currentData.taxNumber,
                taxOffice: currentData.taxOffice,
                title: currentData.title,
                name: currentData.name,
                surname: currentData.surname,
                webSite: currentData.webSite,
                birthOfDate: currentData.birthOfDate,
                kepAddress: currentData.kepAddress,
                mersisNo: currentData.mersisNo,
                sicilNo: currentData.sicilNo,

            };

            // İlişkili veriler
            const currentAddress = currentData.addressName ? {
                create: [{
                    addressName: currentData.addressName,
                    addressType: currentData.addressType,
                    address: currentData.address,
                    countryCode: currentData.countryCode,
                    city: currentData.city,
                    district: currentData.district,
                    postalCode: currentData.postalCode,
                    phone: currentData.phone,
                    phone2: currentData.phone2,
                    email: currentData.email,
                    email2: currentData.email2,
                }]
            } : undefined;

            const currentBranch = currentData.branchCode ? {
                create: [{
                    branchCode: currentData.branchCode,
                }]
            } : undefined;

            const currentFinancial = currentData.bankName ? {
                create: [{
                    bankName: currentData.bankName,
                    bankBranch: currentData.bankBranch,
                    bankBranchCode: currentData.bankBranchCode,
                    iban: currentData.iban,
                    accountNo: currentData.accountNo,
                }]
            } : undefined;

            const currentRisk = currentData.currency ? {
                create: [{
                    currency: currentData.currency,
                    teminatYerelTutar: currentData.teminatYerelTutar,
                    acikHesapYerelLimit: currentData.acikHesapYerelLimit,
                    hesapKesimGunu: currentData.hesapKesimGunu,
                    vadeGun: currentData.vadeGun,
                    gecikmeLimitGunu: currentData.gecikmeLimitGunu,
                    varsayilanAlisIskontosu: currentData.varsayilanAlisIskontosu,
                    varsayilanSatisIskontosu: currentData.varsayilanSatisIskontosu,
                    ekstreGonder: currentData.ekstreGonder,
                    limitKontrol: currentData.limitKontrol,
                    acikHesap: currentData.acikHesap,
                    posKullanim: currentData.posKullanim,
                }]
            } : undefined;

            const currentOfficials = currentData.title ? {
                create: [{
                    title: currentData.title,
                    name: currentData.name,
                    surname: currentData.surname,
                    phone: currentData.phone,
                    email: currentData.email,
                    note: currentData.note,
                }]
            } : undefined;

            const currentCategoryItem = currentData.categoryId ? {
                create: [{
                    category: {
                        connect: { id: currentData.categoryId }
                    }
                }]
            } : undefined;

            // createCurrent fonksiyonunu kullanarak verileri ekliyoruz
            await currentsService.createCurrent({
                current: current,
                priceListId: priceListId,
                currentAddress: currentAddress,
                currentBranch: currentBranch,
                currentFinancial: currentFinancial,
                currentRisk: currentRisk,
                currentOfficials: currentOfficials,
                currentCategoryItem: currentCategoryItem
            });
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
