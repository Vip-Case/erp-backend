import { Prisma, PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import { z } from 'zod';
import currentService from './currentService';
import StockCardService from './StockCardService';

const prisma = new PrismaClient();

const ProductType = z.enum(['BasitUrun', 'VaryasyonluUrun', 'DijitalUrun', 'Hizmet']);
const StockUnits = z.enum(['Adet', 'Kg', 'Lt', 'M', 'M2', 'M3', 'Paket', 'Kutu', 'Koli', 'Ton', 'Dolar', 'Euro', 'TL']);

const StockCardSchema = z.object({
    productCode: z.string(),
    productName: z.string(),
    unit: StockUnits,
    shortDescription: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    companyCode: z.string(),
    branchCode: z.string().nullable().optional(),
    brandId: z.string().nullable().optional(),
    productType: ProductType,
    gtip: z.string().nullable().optional(),
    pluCode: z.string().nullable().optional(),
    desi:  z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    adetBoleni:  z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    siraNo: z.string().nullable().optional(),
    raf: z.string().nullable().optional(),
    karMarji:  z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    riskQuantities:  z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    maliyet:  z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    maliyetDoviz: z.string().nullable().optional(),
    stockStatus: z.boolean(),
    hasExpirationDate: z.boolean().optional(),
    allowNegativeStock: z.boolean().optional(),
    attributeId: z.string().nullable().optional(),
    categoryId: z.string(),
    taxName: z.string(),
    taxRate:  z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    marketName: z.string(),
    priceListId: z.string(),
    price:  z.union([z.string(), z.number()]).transform((val) => val !== null && val !== undefined ? parseFloat(val as string) : undefined).nullable().optional(),
    barcode: z.string().nullable().optional(),
    currentId: z.string().nullable().optional(),
    warehouseId: z.string().nullable().optional(),
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

                    /*
                        Object.entries(rowData).forEach(([key, value]) => {
                            console.log(`Alan: ${key}, Değer: ${value}, Uzunluk: ${typeof value === "string" ? value.length : "N/A"}`);
                        });*/
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

        const stockCardsService = new StockCardService();

        for (const stockCardData of stockCardsData) {
            await stockCardsService.createStockCardsWithRelations({
                stockCard: {
                    ...stockCardData.data
                },
                barcodes: stockCardData.barcodes?.map((barcode: { barcode: string }) => ({ barcode })),
                attributes: stockCardData.attributes?.map((attribute: { attributeId: string }) => ({ attributeId: attribute.attributeId })),
                categoryItem: stockCardData.categoryItems?.map((categoryItem: { categoryId: string }) => ({ categoryId: categoryItem.categoryId })),
                priceListItems: stockCardData.priceListItems?.map((priceListItem: { priceListId: string, price: number }) => ({
                    priceListId: priceListItem.priceListId,
                    price: priceListItem.price ?? 0,
                })),
                taxRates: stockCardData.taxRates?.map((taxRate: { taxName: string, taxRate: number }) => ({
                    taxName: taxRate.taxName ?? "defaultTaxName",
                    taxRate: taxRate.taxRate,
                })),
                eFatura: stockCardData.eFatura?.map((eFatura: { productCode: string, productName: string }) => ({
                    productCode: eFatura.productCode,
                    productName: eFatura.productName,
                })),
                manufacturers: stockCardData.manufacturers?.map((manufacturer: { productCode: string, productName: string, barcode: string, brandId: string, currentId: string }) => ({
                    productCode: manufacturer.productCode,
                    productName: manufacturer.productName,
                    barcode: manufacturer.barcode,
                    brandId: manufacturer.brandId,
                    currentId: manufacturer.currentId,
                })),
                marketNames: stockCardData.marketNames?.map((marketName: { marketName: string }) => ({ marketName: marketName.marketName })),
                stockCardWarehouse: stockCardData.stockCardWarehouse?.map((warehouse: { id: string, quantity: number }) => ({
                    id: warehouse.id,
                    quantity: warehouse.quantity,
                })),
            });
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
                create: {
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
                }
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

            const currentReportGroupItem = currentData.groupId ? {
                create: [{
                    group: {
                        connect: { id: currentData.groupId }
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
                currentCategoryItem: currentCategoryItem,
                currentReportGroupItem: currentReportGroupItem,
            });
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
