import { PrismaClient, ProductType, StockUnits } from '@prisma/client';
import * as xlsx from 'xlsx';
import { z } from 'zod';

const prisma = new PrismaClient();

interface StockCardData {
    productCode: string;
    productName: string;
    unit: StockUnits;
    shortDescription?: string | null;
    description?: string | null;
    companyCode?: string | null;
    branchCode?: string | null;
    brandId?: string | null;
    productType: ProductType;
    gtip?: string | null;
    pluCode?: string | null;
    desi?: number | null;
    adetBoleni?: number | null;
    siraNo?: string | null;
    raf?: string | null;
    karMarji?: number | null;
    riskQuantities?: number | null;
    maliyet?: number | null;
    maliyetKur?: string | null;
    warehouseName?: string | null;
    quantity?: number | null;
}

// Zod ile Stok Kartı Doğrulama Şeması
const StockCardSchema = z.object({
    productCode: z.string().min(1, 'Ürün kodu boş olamaz'),
    productName: z.string().min(1, 'Ürün adı boş olamaz'),
    unit: z.enum(['Adet', 'Kg', 'Lt', 'M', 'M2', 'M3', 'Paket', 'Kutu', 'Koli', 'Ton', 'Dolar', 'Euro', 'TL']),
    shortDescription: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    companyCode: z.string().nullable().optional(),
    branchCode: z.string().nullable().optional(),
    gtip: z.string().nullable().optional(),
    pluCode: z.string().nullable().optional(),
    desi: z.number().nullable().optional(),
    adetBoleni: z.number().nullable().optional(),
    siraNo: z.string().nullable().optional(),
    raf: z.string().nullable().optional(),
    karMarji: z.number().nullable().optional(),
    riskQuantities: z.number().nullable().optional(),
    maliyet: z.number().nullable().optional(),
    maliyetKur: z.string().nullable().optional(),
    warehouseName: z.string().nullable().optional(),
    quantity: z.number().nullable().optional(),
    brandName: z.string().nullable().optional(),
    productType: z.enum(['BasitUrun', 'VaryasyonluUrun', 'DijitalUrun', 'Hizmet']),
    categories: z.string().optional(),
    attributes: z.string().optional(),
    prices: z.string().optional(),
    barcodes: z.string().optional(),
    manufacturerName: z.string().nullable().optional(),
    marketNames: z.string().optional(),
});

// Stok Kartı İçe Aktarım Servisi
export const importStockCards = async (file: File) => {
    if (!file || !file.name.endsWith('.xlsx')) {
        throw new Error('Geçerli bir Excel dosyası yükleyin.');
    }

    try {
        const buffer = await file.arrayBuffer();
        const workbook = xlsx.read(Buffer.from(buffer), { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        const validStockCards = [];
        const errors = [];

        for (const [index, row] of data.entries()) {
            try {
                const stockCard = StockCardSchema.parse(row);

                const brandID = stockCard.brandName ? await prisma.brand.findUnique({ where: { brandName: stockCard.brandName } }) : null;

                const stockCardData = {
                    productCode: stockCard.productCode,
                    productName: stockCard.productName,
                    unit: stockCard.unit,
                    shortDescription: stockCard.shortDescription || null,
                    description: stockCard.description || null,
                    productType: stockCard.productType,
                    gtip: stockCard.gtip || null,
                    pluCode: stockCard.pluCode || null,
                    desi: stockCard.desi ? Number(stockCard.desi) : null,
                    adetBoleni: stockCard.adetBoleni ? Number(stockCard.adetBoleni) : null,
                    siraNo: stockCard.siraNo || null,
                    raf: stockCard.raf || null,
                    karMarji: stockCard.karMarji ? Number(stockCard.karMarji) : null,
                    riskQuantities: stockCard.riskQuantities ? Number(stockCard.riskQuantities) : null,
                    maliyet: stockCard.maliyet ? Number(stockCard.maliyet) : null,
                    maliyetDoviz: stockCard.maliyetKur || null,

                    // Handle relations using connect
                    company: stockCard.companyCode ? {
                        connect: { companyCode: stockCard.companyCode }
                    } : undefined,

                    branch: stockCard.branchCode ? {
                        connect: { branchCode: stockCard.branchCode }
                    } : undefined,

                    brand: brandID ? {
                        connect: { id: brandID.id }
                    } : undefined,
                };

                // Add this validation before the upsert operation
                if (stockCard.companyCode) {
                    const company = await prisma.company.findUnique({
                        where: { companyCode: stockCard.companyCode }
                    });
                    if (!company) {
                        throw new Error(`Company with code ${stockCard.companyCode} not found`);
                    }
                }

                // Create or update stock card first
                const stockCardRecord = await prisma.stockCard.upsert({
                    where: {
                        productCode: stockCard.productCode
                    },
                    update: stockCardData,
                    create: stockCardData,
                });

                // Now we have the stockCardId for all related records
                const stockCardId = stockCardRecord.id;

                // Kategori İşleme
                const categories = stockCard.categories?.split(',').map((name) => name.trim()) || [];
                const categoryRecords = await Promise.all(
                    categories.map(async (categoryName) => {
                        const category = await prisma.stockCardCategory.upsert({
                            where: { categoryName },
                            update: {},
                            create: { categoryName, categoryCode: categoryName.toLowerCase().replace(/\s+/g, '_') },
                        });
                        return prisma.stockCardCategoryItem.create({
                            data: {
                                categoryId: category.id,
                                stockCardId: stockCardId,
                            },
                        });
                    })
                );

                // Özellik İşleme
                const attributes = stockCard.attributes?.split(',').map((attr) => {
                    const [attributeName, value] = attr.split('=');
                    return { attributeName: attributeName.trim(), value: value.trim() };
                }) || [];

                const attributeRecords = await Promise.all(
                    attributes.map(async ({ attributeName, value }) => {
                        // Use transaction for atomic operations
                        return prisma.$transaction(async (tx) => {
                            // Try to find existing attribute
                            let attribute = await tx.stockCardAttribute.findFirst({
                                where: {
                                    attributeName,
                                    value
                                }
                            });

                            // If not found, create new attribute
                            if (!attribute) {
                                attribute = await tx.stockCardAttribute.create({
                                    data: {
                                        attributeName,
                                        value
                                    }
                                });
                            }

                            // Create attribute item with found or new attribute
                            return tx.stockCardAttributeItems.create({
                                data: {
                                    attributeId: attribute.id,
                                    stockCardId: stockCardId,
                                }
                            });
                        });
                    })
                );

                // Fiyat İşleme
                const pricePattern = /([^=,]+)=([^,]+)(?:,|$)/g;
                const priceString = stockCard.prices || '';
                console.log('Processing prices:', priceString); // Debug log

                const prices = [...priceString.matchAll(pricePattern)].map(match => {
                    const priceListName = match[1].trim();
                    const priceStr = match[2].trim().replace(',', '.');
                    const price = parseFloat(priceStr);

                    console.log('Parsed price:', { priceListName, priceStr, price }); // Debug log

                    if (isNaN(price)) {
                        throw new Error(`Invalid price value for ${priceListName}: ${match[2]}`);
                    }

                    return { priceListName, price };
                });

                const priceRecords = await Promise.all(
                    prices.map(async ({ priceListName, price }) => {
                        const priceList = await prisma.stockCardPriceList.findUnique({
                            where: {
                                priceListName: priceListName.trim()
                            }
                        });

                        if (!priceList) {
                            throw new Error(`Price list "${priceListName}" not found.`);
                        }

                        return prisma.stockCardPriceListItems.create({
                            data: {
                                priceListId: priceList.id,
                                stockCardId: stockCardId,
                                price,
                            },
                        });
                    })
                );

                // Barkod İşleme
                const barcodes = stockCard.barcodes?.split(',').map((barcode) => barcode.trim()) || [];
                const barcodeRecords = await Promise.all(
                    barcodes.map(async (barcode) =>
                        prisma.stockCardBarcode.upsert({
                            where: { barcode },
                            update: {},
                            create: {
                                barcode,
                                stockCardId: stockCardId,
                            },
                        })
                    )
                );

                // Depo İşleme
                const warehouseName = stockCard.warehouseName || 'Ana Depo';
                const warehouse = await prisma.warehouse.findFirst({ where: { warehouseName } });
                if (!warehouse) throw new Error('Depo bulunamadı');

                const stockUnit = await prisma.stockCardWarehouse.upsert({
                    where: {
                        stockCardId_warehouseId: {
                            warehouseId: warehouse.id,
                            stockCardId: stockCardId
                        }
                    },
                    update: { quantity: stockCard.quantity || 0 },
                    create: {
                        quantity: stockCard.quantity || 0,
                        warehouseId: warehouse.id,
                        stockCardId
                    },
                });

                // Üretici İşleme
                if (stockCard.manufacturerName && barcodes.length > 0) {
                    const current = await prisma.current.findFirst();
                    if (!current) throw new Error('No current record found');

                    await prisma.stockCardManufacturer.upsert({
                        where: { barcode: barcodes[0] },
                        update: { productName: stockCard.productName },
                        create: {
                            productCode: stockCard.productCode,
                            productName: stockCard.productName,
                            barcode: barcodes[0],
                            stockCardId: stockCardId,
                            currentId: current.id,
                        },
                    });
                }

                // Piyasa Adları İşleme
                const marketNames = stockCard.marketNames?.split(',').map((name) => name.trim()) || [];
                const marketNameRecords = await Promise.all(
                    marketNames.map(async (marketName) =>
                        prisma.stockCardMarketNames.create({
                            data: {
                                marketName,
                                stockCardId: stockCardId,
                            },
                        })
                    )
                );

                validStockCards.push(stockCard);
            } catch (error: any) {
                errors.push({ row: index + 1, error: error.message });
            }
        }

        return {
            success: validStockCards.length,
            errors,
        };
    } catch (err) {
        console.error('Stok kartları içe aktarılırken hata oluştu:', err);
        throw new Error('Stok kartları içe aktarılamadı.');
    }
};
