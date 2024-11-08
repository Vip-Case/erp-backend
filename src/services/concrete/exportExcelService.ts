import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import * as path from 'path';
import prisma from '../../config/prisma';

async function getStockCardsWithRelations() {
    const stockCards = await prisma.stockCard.findMany({
        include: {
            Company: true,
            Branch: true,
            Brand: true,
            Categories: {
                include: {
                    category: true,
                },
            },
            TaxRates: true,
            StockCardMarketNames: true,
            Barcodes: true,
            StockCardPriceLists: {
                include: {
                    priceList: true
                }
            },
            StockCardAttributeItems: {
                include: {
                    attribute: true
                }
            },
            StockCardWarehouse: {
                include: {
                    warehouse: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc' // En son eklenenler üstte olacak şekilde sıralıyoruz
        }
    });
    return stockCards;
}

export async function exportStockCardsToExcel() {
    await prisma.$disconnect();
    await prisma.$connect();
    const stockCards = await getStockCardsWithRelations();
    console.log('Çekilen veri sayısı:', stockCards.length); 
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('StockCards');

    // Sütun başlıklarını tanımlıyoruz
    worksheet.columns = [
        { header: 'Product Code', key: 'productCode', width: 20 },
        { header: 'Product Name', key: 'productName', width: 30 },
        { header: 'Unit', key: 'unit', width: 10 },
        { header: 'Short Description', key: 'shortDescription', width: 20 },
        { header: 'Description', key: 'description', width: 50 },
        { header: 'Company Code', key: 'companyCode', width: 20 },
        { header: 'Branch Code', key: 'branchCode', width: 15 },
        { header: 'Brand Id', key: 'brandId', width: 20 },
        { header: 'Product Type', key: 'productType', width: 15 },
        { header: 'GTIP', key: 'gtip', width: 15 },
        { header: 'PLU Code', key: 'pluCode', width: 15 },
        { header: 'Desi', key: 'desi', width: 15 },
        { header: 'Adet Böleni', key: 'adetBoleni', width: 15 },
        { header: 'Sıra No', key: 'siraNo', width: 15 },
        { header: 'Raf', key: 'raf', width: 15 },
        { header: 'Kar Marjı', key: 'karMarji', width: 15 },
        { header: 'Risk Quantities', key: 'riskQuantities', width: 15 },
        { header: 'Maliyet', key: 'maliyet', width: 10 },
        { header: 'Maliyet Döviz', key: 'maliyetDoviz', width: 10 },
        { header: 'Stock Status', key: 'stockStatus', width: 10 },
        { header: 'Has Expiration Date', key: 'hasExpirationDate', width: 15 },
        { header: 'Allow Negative Stock', key: 'allowNegativeStock', width: 15 },
        { header: 'Category Ids', key: 'categoryIds', width: 30 },
        { header: 'Tax Name', key: 'taxName', width: 20 },
        { header: 'Tax Rate', key: 'taxRate', width: 15 },
        { header: 'Market Names', key: 'marketNames', width: 30 },
        { header: 'Barcodes', key: 'barcodes', width: 30 },
        { header: 'Price List Id', key: 'priceListId', width: 30 },
        { header: 'Price', key: 'price', width: 15 },
        { header: 'Attribute Id', key: 'attributeId', width: 30 },
        { header: 'Warehouse Id', key: 'warehouseId', width: 30 },
        { header: 'Quantity', key: 'quantity', width: 15 }
    ];

    // Verileri satırlara ekleyelim
    stockCards.forEach(stockCard => {
        console.log(`Excel'e ekleniyor: ${stockCard.productCode}`);
        worksheet.addRow({
            productCode: stockCard.productCode || '',
            productName: stockCard.productName || '',
            unit: stockCard.unit || '',
            shortDescription: stockCard.shortDescription || '',
            description: stockCard.description || '',
            companyCode: stockCard.Company?.companyCode || '',
            branchCode: stockCard.Branch?.branchCode || '',
            brandId: stockCard.Brand?.id || '',
            productType: stockCard.productType || '',
            gtip: stockCard.gtip || '',
            pluCode: stockCard.pluCode || '',
            desi: stockCard.desi !== undefined && stockCard.desi !== null ? parseFloat(stockCard.desi.toString()) : '',
            adetBoleni: stockCard.adetBoleni !== undefined && stockCard.adetBoleni !== null ? parseFloat(stockCard.adetBoleni.toString()) : '',
            siraNo: stockCard.siraNo || '',
            raf: stockCard.raf || '',
            karMarji: stockCard.karMarji !== undefined && stockCard.karMarji !== null ? parseFloat(stockCard.karMarji.toString()) : '',
            riskQuantities: stockCard.riskQuantities !== undefined && stockCard.riskQuantities !== null ? parseFloat(stockCard.riskQuantities.toString()) : '',
            maliyet: stockCard.maliyet !== undefined && stockCard.maliyet !== null ? parseFloat(stockCard.maliyet.toString()) : '',
            maliyetDoviz: stockCard.maliyetDoviz || '',
            stockStatus: stockCard.stockStatus ? 'Active' : 'Inactive',
            hasExpirationDate: stockCard.hasExpirationDate ? 'Yes' : 'No',
            allowNegativeStock: stockCard.allowNegativeStock ? 'Yes' : 'No',
            
            // Tüm category id'leri virgülle ayırarak ekleyelim
            categoryIds: stockCard.Categories?.map(catItem => catItem.category.id).join(', ') || '',

            // Vergi bilgilerini ekleme (ilk vergi adı ve oranını virgülle ayırarak ekler)
            taxName: stockCard.TaxRates.map(taxRate => taxRate.taxName).join(', ') || '',
            taxRate: stockCard.TaxRates.map(taxRate => taxRate.taxRate).join(', ') || '',

            // Tüm market adlarını virgülle ayırarak ekleyelim
            marketNames: stockCard.StockCardMarketNames.map(market => market.marketName).join(', ') || '',

            // Tüm barkodları virgülle ayırarak ekleyelim
            barcodes: stockCard.Barcodes.map(bc => bc.barcode.toString()).join(', ') || '',

            // Fiyat listesi ve fiyat bilgilerini ekleme
            priceListId: stockCard.StockCardPriceLists?.[0]?.priceList?.id || '',
            price: stockCard.StockCardPriceLists?.[0]?.price ? parseFloat(stockCard.StockCardPriceLists[0].price.toString()) : '',

            // Özellik id'sini ekleme
            attributeId: stockCard.StockCardAttributeItems?.[0]?.attribute?.id || '',

            // Depo ve miktar bilgilerini ekleme
            warehouseId: stockCard.StockCardWarehouse?.[0]?.warehouse?.id || '',
            quantity: stockCard.StockCardWarehouse?.[0]?.quantity ? parseFloat(stockCard.StockCardWarehouse[0].quantity.toString()) : ''
        }).commit();
        
    });

    // Dosyayı kaydediyoruz
    const filePath = path.join('C:', 'Users', 'amine', 'Desktop', 'StockCards.xlsx');
    await workbook.xlsx.writeFile(filePath)
    .then(() => console.log(`Excel dosyası başarıyla oluşturuldu: ${filePath}`))
    .catch(error => console.error('Dosya yazma hatası:', error));
    console.log(`Excel dosyası başarıyla oluşturuldu: ${filePath}`);
}

exportStockCardsToExcel()
    .catch(error => {
        console.error('Excel dosyası oluşturulurken bir hata oluştu:', error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
