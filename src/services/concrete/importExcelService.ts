import { Prisma, PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import { z } from 'zod';
import currentService from './currentService';

// CurrentData tipini burada tanımlayalım
interface CurrentData {
    priceListId: string;
    currentCode: string;
    currentName: string;
    currentType: any;
    institution: any;
    identityNo?: string | null;
    taxNumber?: string | null;
    taxOffice?: string | null;
    title?: string | null;
    name?: string | null;
    surname?: string | null;
    webSite?: string | null;
    birthOfDate?: Date | null;
    kepAddress?: string | null;
    mersisNo?: string | null;
    sicilNo?: string | null;
}

const prisma = new PrismaClient();

const ProductType = z.enum(['BasitUrun', 'VaryasyonluUrun', 'DijitalUrun', 'Hizmet']);
const StockUnits = z.enum(['Adet', 'Kg', 'Lt', 'M', 'M2', 'M3', 'Paket', 'Kutu', 'Koli', 'Ton', 'Dolar', 'Euro', 'TL']);

async function fetchValidPriceLists(): Promise<Set<string>> {
    const priceLists = await prisma.stockCardPriceList.findMany();
    return new Set(priceLists.map((pl) => pl.priceListName));
}

const StockCardSchema = z.object({
    productCode: z.string(),
    productName: z.string(),
    unit: StockUnits,
    shortDescription: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    companyCode: z.string().nullable().optional(),
    branchCode: z.string().nullable().optional(),
    brandName: z.string().nullable().optional(),
    productType: ProductType,
    gtip: z.string().nullable().optional(),
    pluCode: z.string().nullable().optional(),
    desi: z.union([z.string(), z.number()]).nullable().optional(),
    adetBoleni: z.union([z.string(), z.number()]).nullable().optional(),
    siraNo: z.string().nullable().optional(),
    raf: z.string().nullable().optional(),
    karMarji: z.union([z.string(), z.number()]).nullable().optional(),
    riskQuantities: z.union([z.string(), z.number()]).nullable().optional(),
    maliyet: z.union([z.string(), z.number()]).nullable().optional(),
    maliyetDoviz: z.string().nullable().optional(),
    stockStatus: z.boolean(),
    hasExpirationDate: z.boolean().optional(),
    allowNegativeStock: z.boolean().optional(),
    categoryName: z.string().nullable().optional(),
    taxName: z.string().nullable().optional(),
    taxRate: z.union([z.string(), z.number()]).nullable().optional(),
    marketName: z.string().nullable().optional(),
    barcode: z.union([z.string(), z.number()]).nullable().optional(),
    prices: z.array(
        z.object({
            priceListName: z.string(),
            price: z.number()
        })
    ).optional(),
    price: z.union([z.string(), z.number()]).nullable().optional(),
    warehouseName: z.string().nullable().optional(),
    quantity: z.union([z.string(), z.number()]).nullable().optional(),
    attributes: z.record(z.string(), z.array(z.string())).optional(),
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
    priceListName: z.string().optional(),
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
    categoryName: z.string().nullable().optional()
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
    priceListName: z.string().nullable().optional()
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
    priceListName: z.string().nullable().optional(),
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

function convertStockCardData(row: Record<string, any>, validPriceLists: Set<string>) {
    const attributes: Record<string, string[]> = {};
    const prices: { priceListName: string; price: number }[] = [];

    // `attributes` işlemi
    Object.keys(row).forEach((key) => {
        if (key.startsWith("attributeName")) {
            const index = key.split(" ")[1];
            const valueKey = `attributeValue ${index}`;
            if (row[key] && row[valueKey]) {
                const attributeName = row[key] as string;
                const attributeValues = (row[valueKey] as string).split(',').map((val) => val.trim());
                attributes[attributeName] = attributeValues;
            }
        }
    });

    // `prices` işlemi
    Object.keys(row).forEach((key) => {
        if (key.startsWith("priceListName")) {
            const index = key.split(" ")[1];
            const priceKey = `price ${index}`;
            if (row[key] && validPriceLists.has(row[key]) && row[priceKey] != null) {
                prices.push({
                    priceListName: row[key],
                    price: parseFloat(row[priceKey]),
                });
            }
        }
    });

    // Son olarak orijinal `sanitizedRow` nesnesinden gereksiz olanları silin
    const sanitizedRow = { ...row };
    Object.keys(sanitizedRow).forEach((key) => {
        if (
            key.startsWith("attributeName") ||
            key.startsWith("attributeValue") ||
            key.startsWith("priceListName") ||
            key.startsWith("price")
        ) {
            delete sanitizedRow[key];
        }
    });

    // Tüm işlenmiş verileri geri döndürün
    return {
        ...sanitizedRow,
        attributes,
        prices,
        taxRate: sanitizedRow.taxRate ? parseFloat(sanitizedRow.taxRate) : null,
        price: sanitizedRow.price ? parseFloat(sanitizedRow.price) : null,
        quantity: sanitizedRow.quantity ? parseFloat(sanitizedRow.quantity) : null,
        barcode: sanitizedRow.barcode ? String(sanitizedRow.barcode) : null,
        stockStatus: sanitizedRow.stockStatus === 'DOĞRU',
        hasExpirationDate: sanitizedRow.hasExpirationDate === 'DOĞRU',
        allowNegativeStock: sanitizedRow.allowNegativeStock === 'DOĞRU',
    };
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

        const validPriceLists = await fetchValidPriceLists();

        // İlk satırı işlerken validPriceLists'i geçiriyoruz
        const firstRow = await convertStockCardData(data[0] as Record<string, any>, validPriceLists);
        console.log("İlk Satır:", firstRow);


        // `StockCardSchema` doğrulamasını ayrıntılı olarak gözlemleyin
        const stockCardValidation = StockCardSchema.safeParse(firstRow);
        let isStockCard = stockCardValidation.success;
        //let isStockCard = StockCardSchema.safeParse(firstRow).success;
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
                const stockCardData = await convertStockCardData(row, validPriceLists);
                const stockCardValidation = StockCardSchema.safeParse(stockCardData);

                if (stockCardValidation.success) {
                    stockCardsData.push(replaceUndefinedWithNull(stockCardValidation.data));
                } else {
                    console.error(`Doğrulama hatası: ${stockCardValidation.error}`);
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
                    const stockMovementData = replaceUndefinedWithNull(stockMovementValidation.data);

                    try {
                        // `priceListName` kullanarak `priceListId`'yi buluyoruz
                        let priceListId: string | undefined;
                        if (stockMovementData.priceListName) {
                            const priceList = await prisma.stockCardPriceList.findUnique({
                                where: { priceListName: stockMovementData.priceListName }
                            });

                            if (!priceList) {
                                console.error(`Hata: '${stockMovementData.priceListName}' için PriceList kaydı bulunamadı.`);
                                continue; // PriceList kaydı yoksa bu satırı atla
                            }

                            // Bulunan `priceListId`'yi ekleyin
                            priceListId = priceList.id;
                        }

                        // Gerekli doğrulamalar: `warehouseCode`, `branchCode`, `productCode`
                        const warehouse = await prisma.warehouse.findUnique({
                            where: { warehouseCode: stockMovementData.warehouseCode }
                        });

                        if (!warehouse) {
                            console.error(`Hata: ${stockMovementData.productCode} için 'Warehouse' kaydı bulunamadı - WarehouseCode: ${stockMovementData.warehouseCode}`);
                            continue;
                        }

                        const branch = await prisma.branch.findUnique({
                            where: { branchCode: stockMovementData.branchCode }
                        });

                        if (!branch) {
                            console.error(`Hata: ${stockMovementData.productCode} için 'Branch' kaydı bulunamadı - BranchCode: ${stockMovementData.branchCode}`);
                            continue;
                        }

                        const stockCard = await prisma.stockCard.findUnique({
                            where: { productCode: stockMovementData.productCode }
                        });

                        if (!stockCard) {
                            console.error(`Hata: ${stockMovementData.productCode} için 'StockCard' kaydı bulunamadı.`);
                            continue;
                        }

                        // Opsiyonel doğrulamalar: `outWarehouseCode`, `currentCode`, `documentNo`
                        const outWarehouse = stockMovementData.outWarehouseCode
                            ? await prisma.warehouse.findUnique({
                                where: { warehouseCode: stockMovementData.outWarehouseCode }
                            })
                            : null;

                        const current = stockMovementData.currentCode
                            ? await prisma.current.findUnique({
                                where: { currentCode: stockMovementData.currentCode }
                            })
                            : null;

                        const invoice = stockMovementData.documentNo
                            ? await prisma.invoice.findUnique({
                                where: { invoiceNo: stockMovementData.documentNo }
                            })
                            : null;

                        // Yeni `StockMovement` kaydı oluşturuyoruz
                        await prisma.stockMovement.create({
                            data: {
                                productCode: stockMovementData.productCode,
                                warehouseCode: stockMovementData.warehouseCode,
                                branchCode: stockMovementData.branchCode,
                                currentCode: stockMovementData.currentCode,
                                documentType: stockMovementData.documentType,
                                invoiceType: stockMovementData.invoiceType,
                                movementType: stockMovementData.movementType,
                                documentNo: stockMovementData.documentNo,
                                gcCode: stockMovementData.gcCode,
                                type: stockMovementData.type,
                                description: stockMovementData.description,
                                quantity: stockMovementData.quantity,
                                unitPrice: stockMovementData.unitPrice,
                                totalPrice: stockMovementData.totalPrice,
                                unitOfMeasure: stockMovementData.unitOfMeasure,
                                outWarehouseCode: stockMovementData.outWarehouseCode,
                                priceListId: priceListId // `priceListName` yerine `priceListId` kullanıyoruz
                            }
                        });
                        console.log(`StockMovement başarıyla oluşturuldu - ProductCode: ${stockMovementData.productCode}`);
                    } catch (error) {
                        console.error(`Hata: ${stockMovementData.productCode} için veri işlenemedi.`, error);
                    }
                } else {
                    console.error(`Geçersiz StockMovement verisi - ${JSON.stringify(row)}`);
                }

            } else if (isCurrentMovement) {
                const filledRow = {
                    dueDate: row.dueDate ?? null,
                    debtAmount: row.debtAmount ?? 0,
                    creditAmount: row.creditAmount ?? 0,
                    balanceAmount: row.balanceAmount ?? 0,
                    ...row,
                };

                const currentMovementValidation = CurrentMovementSchema.safeParse(filledRow);
                if (currentMovementValidation.success) {
                    const currentMovementData = replaceUndefinedWithNull(currentMovementValidation.data);

                    try {
                        // `priceListName` kullanarak `priceListId`'yi buluyoruz
                        let priceListId: string | undefined;
                        if (currentMovementData.priceListName) {
                            const priceList = await prisma.stockCardPriceList.findUnique({
                                where: { priceListName: currentMovementData.priceListName }
                            });

                            if (!priceList) {
                                console.error(`Hata: '${currentMovementData.priceListName}' için PriceList kaydı bulunamadı.`);
                                continue; // PriceList kaydı yoksa bu satırı atla
                            }

                            // Bulunan `priceListId`'yi `currentMovementData`'ya ekleyin
                            priceListId = priceList.id;
                        }

                        // Yeni `CurrentMovement` kaydı oluşturuyoruz
                        await prisma.currentMovement.create({
                            data: {
                                currentCode: currentMovementData.currentCode,
                                dueDate: currentMovementData.dueDate,
                                description: currentMovementData.description,
                                debtAmount: currentMovementData.debtAmount,
                                creditAmount: currentMovementData.creditAmount,
                                priceListId: priceListId, // `priceListName` yerine `priceListId` kullanıyoruz
                                movementType: currentMovementData.movementType,
                                documentType: currentMovementData.documentType,
                                documentNo: currentMovementData.documentNo || "Belirtilmedi", // Tanımlı değilse "Belirtilmedi" olarak ayarlanıyor
                                companyCode: currentMovementData.companyCode,
                                branchCode: currentMovementData.branchCode,
                            }
                        });
                        console.log(`CurrentMovement başarıyla oluşturuldu - DocumentNo: ${currentMovementData.documentNo || "Belirtilmedi"}`);
                    } catch (error) {
                        console.error(`Hata: ${currentMovementData.documentNo || "Belirtilmedi"} için veri işlenemedi.`, error);
                    }
                } else {
                    console.error(`Geçersiz CurrentMovement verisi - ${JSON.stringify(row)}`);
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

                if (stockCardData.companyCode) {
                    const company = await prisma.company.findUnique({
                        where: { companyCode: stockCardData.companyCode }
                    });
                    if (!company) {
                        console.error(`Hata: ${stockCardData.productCode} için 'Company' kaydı bulunamadı - CompanyCode: ${stockCardData.companyCode}`);
                        continue; // Şirket kaydı yoksa devam et
                    }
                }
                // İlişkili `Branch` kaydını doğrulayın
                if (stockCardData.branchCode) {
                    const branch = await prisma.branch.findUnique({
                        where: { branchCode: stockCardData.branchCode }
                    });
                    if (!branch) {
                        console.error(`Hata: ${stockCardData.productCode} için 'Branch' kaydı bulunamadı - BranchCode: ${stockCardData.branchCode}`);
                        continue; // Şube kaydı yoksa devam et
                    }
                }

                // İlişkili `StockCardCategory` kaydını doğrulayın
                if (stockCardData.categoryId) {
                    const category = await prisma.stockCardCategory.findUnique({
                        where: { id: stockCardData.categoryId }
                    });
                    if (!category) {
                        console.error(`Hata: ${stockCardData.productCode} için 'StockCardCategory' kaydı bulunamadı - CategoryId: ${stockCardData.categoryId}`);
                        continue; // Kategori kaydı yoksa devam et
                    }
                }

                // Yeni `StockCard` kaydı oluşturma
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
                        maliyet: stockCardData.maliyet,
                        maliyetDoviz: stockCardData.maliyetDoviz,
                        stockStatus: stockCardData.stockStatus,
                        hasExpirationDate: stockCardData.hasExpirationDate,
                        allowNegativeStock: stockCardData.allowNegativeStock,

                        // Şirket bağlantısı
                        company: stockCardData.companyCode
                            ? {
                                connect: { companyCode: stockCardData.companyCode },
                            }
                            : undefined,

                        // Şube bağlantısı
                        branch: stockCardData.branchCode
                            ? {
                                connect: { branchCode: stockCardData.branchCode },
                            }
                            : undefined,

                        // İlişkili Vergi Bilgileri
                        taxRates: stockCardData.taxName && stockCardData.taxRate
                            ? {
                                create: [
                                    {
                                        taxName: stockCardData.taxName,
                                        taxRate: stockCardData.taxRate,
                                    },
                                ],
                            }
                            : undefined,

                        // İlişkili Market İsimleri
                        stockCardMarketNames: stockCardData.marketName
                            ? {
                                create: [
                                    {
                                        marketName: stockCardData.marketName,
                                    },
                                ],
                            }
                            : undefined,

                        // İlişkili Barkodlar
                        barcodes: stockCardData.barcode
                            ? {
                                create: [
                                    {
                                        barcode: stockCardData.barcode,
                                    },
                                ],
                            }
                            : undefined,
                    },
                });

                console.log(`StockCard başarıyla oluşturuldu - ProductCode: ${stockCardData.productCode}`);


                // Brand ilişkilendirme
                if (stockCardData.brandName) {
                    const brand = await prisma.brand.findUnique({
                        where: { brandName: stockCardData.brandName },
                    });

                    if (!brand) {
                        console.error(`Hata: ${stockCardData.productCode} için 'Brand' kaydı bulunamadı - BrandName: ${stockCardData.brandName}`);
                    } else {
                        // StockCard kaydını güncelleyerek brand ilişkisini ekliyoruz
                        await prisma.stockCard.update({
                            where: { id: stockCard.id },
                            data: {
                                brand: {
                                    connect: { id: brand.id },
                                },
                            },
                        });
                    }
                }

                if (stockCardData.prices) {
                    for (const priceListItem of stockCardData.prices) {
                        const priceList = await prisma.stockCardPriceList.findUnique({
                            where: { priceListName: priceListItem.priceListName },
                        });

                        if (!priceList) {
                            console.error(`Hata: '${priceListItem.priceListName}' için PriceList kaydı bulunamadı.`);
                            continue;
                        }

                        await prisma.stockCardPriceListItems.create({
                            data: {
                                priceList: {
                                    connect: { id: priceList.id },
                                },
                                stockCard: { connect: { id: stockCard.id } },
                                price: priceListItem.price,
                            },
                        });
                    }
                }

                if (stockCardData.attributes) {
                    for (const [attributeName, values] of Object.entries(stockCardData.attributes)) {
                        const attributeValues = values as string[];

                        for (const attributeValue of attributeValues) {
                            let attribute = await prisma.stockCardAttribute.findFirst({
                                where: {
                                    attributeName,
                                    value: attributeValue,
                                },
                            });

                            if (!attribute) {
                                attribute = await prisma.stockCardAttribute.create({
                                    data: {
                                        attributeName,
                                        value: attributeValue,
                                    },
                                });
                            }

                            await prisma.stockCardAttributeItems.create({
                                data: {
                                    attributeId: attribute.id,
                                    stockCardId: stockCard.id,
                                },
                            });
                        }
                    }
                }

                // `StockCardCategoryItem` ilişkilendirme işlemi
                if (stockCardData.categoryName) {
                    // `categoryName` ile `StockCardCategory` kaydını buluyoruz
                    const category = await prisma.stockCardCategory.findUnique({
                        where: { categoryName: stockCardData.categoryName },
                    });

                    // `categoryName` ile eşleşen bir kayıt yoksa hata mesajı verip sonraki döngüye geçiyoruz
                    if (!category) {
                        console.error(`Hata: ${stockCardData.productCode} için 'Category' kaydı bulunamadı - CategoryName: ${stockCardData.categoryName}`);
                        continue;
                    }

                    // Elde ettiğimiz `category.id` ile `StockCardCategoryItem` kaydını oluşturuyoruz
                    await prisma.stockCardCategoryItem.create({
                        data: {
                            categoryId: category.id,  // Bulunan `category.id` değeri
                            stockCardId: stockCard.id,  // Yeni oluşturulan `stockCard.id` değeri
                        },
                    });
                }

                // `StockCardWarehouse` ilişkilendirme işlemi
                if (stockCardData.warehouseName && stockCardData.quantity) {
                    // `warehouseName` ile `Warehouse` kaydını buluyoruz
                    const warehouse = await prisma.warehouse.findUnique({
                        where: { warehouseName: stockCardData.warehouseName },
                    });

                    // `warehouseName` ile eşleşen bir kayıt yoksa hata mesajı verip sonraki döngüye geçiyoruz
                    if (!warehouse) {
                        console.error(`Hata: ${stockCardData.productCode} için 'Warehouse' kaydı bulunamadı - WarehouseName: ${stockCardData.warehouseName}`);
                    } else {
                        // `warehouse.id` ile `StockCardWarehouse` kaydını oluşturuyoruz
                        await prisma.stockCardWarehouse.create({
                            data: {
                                warehouseId: warehouse.id,  // Bulunan `warehouse.id` değeri
                                stockCardId: stockCard.id,  // Yeni oluşturulan `stockCard.id` değeri
                                quantity: stockCardData.quantity, // Quantity alanını burada sağlıyoruz
                            },
                        });
                    }
                }

            } catch (error: any) {
                console.error(`Hata: ${stockCardData.productCode} için veri işlenemedi.`, error.message || error);
            }
        }


        const currentsService = new currentService();

        // Verileri işliyoruz
        for (const currentData of currentsData) {
            // priceListName kullanarak priceListId'yi buluyoruz
            const priceList = await prisma.stockCardPriceList.findUnique({
                where: { priceListName: currentData.priceListName }
            });

            if (!priceList) {
                throw new Error(`PriceList '${currentData.priceListName}' bulunamadı.`);
            }

            // categoryName kullanarak categoryId'yi buluyoruz
            const category = await prisma.currentCategory.findFirst({
                where: { categoryName: currentData.categoryName }
            });

            if (!category) {
                throw new Error(`Category '${currentData.categoryName}' bulunamadı.`);
            }

            // Current ana verisi
            const current = {
                priceListId: priceList.id, // Burada priceListId'yi doğrudan ekliyoruz
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
            } as CurrentData; // CurrentData tipine dönüştürüyoruz

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

            const currentCategoryItem = {
                create: [{
                    category: {
                        connect: { id: category.id } // Bulunan categoryId ile bağlantı sağlanıyor
                    }
                }]
            };

            // createCurrent fonksiyonunu kullanarak verileri ekliyoruz
            await currentsService.createCurrent({
                current: current,
                currentAddress: currentAddress,
                currentBranch: currentBranch,
                currentFinancial: currentFinancial,
                currentRisk: currentRisk,
                currentOfficials: currentOfficials,
                currentCategoryItem: currentCategoryItem
            }, "system-import"); // Sistem tarafından yapılan bir import olduğunu belirtmek için token ekliyoruz
        }

        if (stockMovementsData.length > 0) {
            await prisma.stockMovement.createMany({ data: stockMovementsData, skipDuplicates: true });
            console.log("StockMovement verileri başarıyla kaydedildi.");
        }

        if (currentMovementsData.length > 0) {
            await prisma.currentMovement.createMany({ data: currentMovementsData, skipDuplicates: true });
            console.log("CurrentMovement verileri başarıyla kaydedildi.");
        }

        return { message: 'Veriler başarıyla işlendi.' };
    } catch (error) {
        console.error("Veritabanı işlemlerinde bir hata oluştu:", error);
        throw new Error("Bir hata oluştu: " + (error as Error).message);
    }
};
