import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import prisma from '../../config/prisma';

async function getAttributesOnly() {
    // Benzersiz attributeName'leri almak için Set kullanıyoruz
    const attributes = await prisma.stockCardAttribute.findMany({
        select: {
            attributeName: true,
            value: true,
        },
    });

    // Unique attributeName'leri filtreliyoruz
    const uniqueAttributes = Array.from(
        new Map(attributes.map((attr) => [attr.attributeName, attr])).values()
    );

    return uniqueAttributes;
}

async function getPriceLists() {
    return await prisma.stockCardPriceList.findMany({
        select: {
            priceListName: true,
        },
    });
}

export async function exportStockCardsToExcel() {
    const attributes = await getAttributesOnly();
    const priceLists = await getPriceLists();

    // Başlık satırı oluşturma
    const headerRow = [
        'Product Code', 'Product Name', 'Unit', 'Short Description', 'Description',
        'Company Code', 'Branch Code', 'Brand Name', 'Product Type', 'GTIP', 'PLU Code',
        'Desi', 'Adet Böleni', 'Sıra No', 'Raf', 'Kar Marjı', 'Risk Quantities',
        'Maliyet', 'Maliyet Döviz', 'Stock Status', 'Has Expiration Date',
        'Allow Negative Stock', 'Category Names', 'Tax Name', 'Tax Rate',
        'Market Names', 'Barcodes', 'Warehouse Name', 'Quantity'
    ];

    // Attribute sütunlarını ekliyoruz
    attributes.forEach((attribute, index) => {
        headerRow.push(`Attribute Name ${index + 1}`, `Attribute Value ${index + 1}`);
    });

    // Price List sütunlarını ekliyoruz
    priceLists.forEach((priceList, index) => {
        headerRow.push(`Price List Name ${index + 1}`, `Price ${index + 1}`);
    });

    // Boş veri satırı oluşturma
    const emptyRow: Record<string, string> = {};
    headerRow.forEach((header) => {
        emptyRow[header] = ''; // Başlıklar için boş veri
    });

    // Worksheet ve Workbook oluşturma
    const worksheet = XLSX.utils.json_to_sheet([emptyRow], { header: headerRow });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'StockCard');
    // Sütun genişliklerini ayarlıyoruz
    worksheet['!cols'] = [
        { wch: 15 }, // Product Code
        { wch: 30 }, // Product Name
        { wch: 10 }, // Unit
        { wch: 25 }, // Short Description
        { wch: 50 }, // Description
        { wch: 20 }, // Company Code
        { wch: 15 }, // Branch Code
        { wch: 20 }, // Brand Name
        { wch: 15 }, // Product Type
        { wch: 15 }, // GTIP
        { wch: 15 }, // PLU Code
        { wch: 15 }, // Desi
        { wch: 15 }, // Adet Böleni
        { wch: 15 }, // Sıra No
        { wch: 15 }, // Raf
        { wch: 15 }, // Kar Marjı
        { wch: 15 }, // Risk Quantities
        { wch: 10 }, // Maliyet
        { wch: 15 }, // Maliyet Döviz
        { wch: 15 }, // Stock Status
        { wch: 20 }, // Has Expiration Date
        { wch: 20 }, // Allow Negative Stock
        { wch: 30 }, // Category Names
        { wch: 20 }, // Tax Name
        { wch: 15 }, // Tax Rate
        { wch: 30 }, // Market Names
        { wch: 30 }, // Barcodes
        { wch: 30 }, // Warehouse Name
        { wch: 15 }, // Quantity
        // Attribute sütunları için genişlik ayarı
        ...attributes.map(() => ({ wch: 30 })),
        ...attributes.map(() => ({ wch: 30 })),
        // Price List sütunları için genişlik ayarı
        ...priceLists.map(() => ({ wch: 20 })),
        ...priceLists.map(() => ({ wch: 15 })),
    ];

    // Excel dosyasını buffer olarak yazma
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    console.log('Excel buffer başarıyla oluşturuldu.');

    // Geçici dosya kaydetme
    const filePath = path.join(__dirname, 'temp', 'stokCard.xlsx');
    const dirPath = path.dirname(filePath);

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, excelBuffer);
    console.log(`Excel dosyası başarıyla oluşturuldu: ${filePath}`);

    return { buffer: excelBuffer, filePath };
}
