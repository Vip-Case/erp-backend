
import { CurrentPaymentType, Invoice, InvoiceDetail, Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import logger from "../../utils/logger";
import { BaseRepository } from "../../repositories/baseRepository";
import { time } from "console";
import { extractUsernameFromToken } from "./extractUsernameService";

export const InvoiceRelations = {
    invoiceDetail: true
};

export interface InvoiceDetailResponse {
    // Temel Fatura Bilgileri
    id: string;
    invoiceNo: string;
    gibInvoiceNo: string;
    invoiceDate: string;
    paymentDate: string;
    paymentTerm: number;
    branchCode: string;
    warehouseId: string;
    description: string;
    invoiceType: 'Purchase' | 'Sales';
    documentType: 'Invoice' | 'Order' | 'Waybill';

    // Cari Bilgileri
    current: {
        id: string;
        currentCode: string;
        currentName: string;
        priceList?: {
            id: string;
            priceListName: string;
            currency: string;
            isVatIncluded: boolean;
        };
    };

    // Ürün Detayları
    items: Array<{
        id: string;
        stockId: string;
        stockCode: string;
        stockName: string;
        quantity: number;
        unit: string;
        unitPrice: number;
        vatRate: number;
        vatAmount: number;
        totalAmount: number;
        priceListId: string;
        currency: string;
        isVatIncluded: boolean;
    }>;

    // Ödeme Bilgileri
    payments: Array<{
        id: string;
        method: 'cash' | 'card' | 'bank' | 'openAccount';
        amount: number;
        accountId: string;
        currency: string;
        description?: string;
    }>;

    // Toplam Değerler
    subtotal: number;
    totalVat: number;
    totalDiscount: number;
    total: number;
    totalPaid: number;
    totalDebt: number;

    // Diğer Bilgiler
    status: 'draft' | 'approved' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
}



export interface InvoiceInfo {
    invoiceNo: string;
    gibInvoiceNo: string | null;
    invoiceDate: Date | null;
    paymentDate: Date | null;
    paymentDay: number | null;
    branchCode: string | undefined;
    warehouseId: string | undefined;
    description: string | null;
    currentCode: string | undefined;
    priceListId: string | undefined;
    totalAmount: number | null;
    totalVat: number | null;
    totalPaid: number | null;
    totalDebt: number | null;
    items: InvoiceItems[] | null;
    payments: InvoicePayments[] | null;
}

export interface InvoiceItems {
    stockCardId: string | null;
    quantity: number | null;
    unitPrice: number | null;
    vatRate: number | null;
    vatAmount: number | null;
    totalAmount: number | null;
    priceListId: string | null;
    currency: string | null;
}

export interface InvoicePayments {
    method: string | null;
    accountId: string | null;
    amount: number | null;
    currency: string | null;
    description: string | null;
}

const paymentMethodMap: Record<string, keyof typeof CurrentPaymentType> = {
    "Kredi Banka Kartı": "POS",
    "Kredi Banka Kartı (PayTr)": "POS",
    "Banka Havalesi/EFT": "Banka",
    "Diğer": "Diger",
};

export class InvoicesService {
    private invoiceRepository = new BaseRepository<Invoice>(prisma.invoice);
    private invoiceDetailRepository = new BaseRepository<InvoiceDetail>(prisma.invoiceDetail);

    async getAllInvoices(): Promise<Invoice[]> {
        return this.invoiceRepository.findAll();
    }

    async getInvoiceById(id: string): Promise<Invoice | null> {
        return this.invoiceRepository.findById(id);
    }
    
    async createInvoiceWithRelations(data: InvoiceInfo): Promise<any> {
        if (!data.invoiceNo || data.invoiceNo.trim() === "") {
            throw new Error("InvoiceNo is required and cannot be empty.");
        }
        const _companyCode = await prisma.company.findFirst({
            select: { companyCode: true },
        });

        const _warehouseCode = await prisma.warehouse.findUnique({
            where: { id: data.warehouseId },
            select: { warehouseCode: true },
        });

        try {
            const result = await prisma.$transaction(async (prisma) => {
                // 1. Ana fatura oluşturuluyor
                const newInvoice = await prisma.invoice.create({
                    data: {
                        invoiceNo: data.invoiceNo,
                        gibInvoiceNo: data.gibInvoiceNo,
                        invoiceDate: data.invoiceDate,
                        invoiceType: "Sales",
                        documentType: "Invoice",
                        current: { connect: { currentCode: data.currentCode } },
                        company: _companyCode?.companyCode ? { connect: { companyCode: _companyCode.companyCode } } : undefined,
                        branch: data.branchCode ? { connect: { branchCode: data.branchCode } } : undefined,
                        warehouse: _warehouseCode ? { connect: { warehouseCode: _warehouseCode.warehouseCode } } : undefined,
                        description: data.description,
                        paymentDate: data.paymentDate,
                        paymentDay: data.paymentDay,
                        priceList: { connect: { id: data.priceListId } },
                        totalAmount: data.totalAmount,
                        totalVat: data.totalVat,
                        totalPaid: data.totalPaid,
                        totalDebt: data.totalDebt,
                        totalBalance: data.totalAmount - data.totalPaid,
                        totalDiscount: 0,
                        totalNet: data.totalAmount - data.totalVat,
                    },
                });

                // 2. İlgili fatura detaylarını ve stok işlemlerini ekleme
                // Fatura detaylarını ekleme
                for (const detail of data.items) {
                    const _productCode = await prisma.stockCard.findUnique({
                        where: { id: detail.stockCardId },
                        select: { productCode: true },
                    });
                    await prisma.invoiceDetail.create({
                        data: {
                            invoiceId: newInvoice.id,
                            productCode: _productCode?.productCode || "",
                            quantity: detail.quantity,
                            unitPrice: detail.unitPrice,
                            vatRate: detail.vatRate,
                            netPrice: detail.totalAmount - detail.vatAmount,
                            totalPrice: detail.totalAmount,
                            discount: 0,
                        },
                    });
                }

                // Satış işlemleri
                for (const detail of data.items) {
                    const stockCard = await prisma.stockCard.findUnique({
                        where: { id: detail.stockCardId },
                    });

                    if (!stockCard) {
                        throw new Error(`StockCard with ID '${detail.stockCardId}' does not exist.`);
                    }

                    const warehouse = await prisma.warehouse.findUnique({
                        where: { id: data.warehouseId },
                    });

                    if (!warehouse) {
                        throw new Error(`Warehouse with ID '${data.warehouseId}' does not exist.`);
                    }

                    const stockCardWarehouse = await prisma.stockCardWarehouse.findUnique({
                        where: {
                            stockCardId_warehouseId: {
                                stockCardId: detail.stockCardId,
                                warehouseId: data.warehouseId,
                            },
                        },
                    });

                    const productCode = stockCard.productCode;
                    const quantity = detail.quantity;

                    // Stok miktarını güncelleme
                    /*
                    if (stockCardWarehouse) {
                        await prisma.stockCardWarehouse.update({
                            where: { id: stockCardWarehouse.id },
                            data: {
                                quantity: stockCardWarehouse.quantity.minus(quantity),
                            },
                        });
                    } else {
                        await prisma.stockCardWarehouse.create({
                            data: {
                                stockCardId: stockCard.id,
                                warehouseId: warehouse.id,
                                quantity,
                            },
                        });
                    }
*/
                    // Ensure warehouseCode exists before creating stockMovement
                    const warehouseExists = await prisma.warehouse.findUnique({
                        where: { warehouseCode: _warehouseCode.warehouseCode },
                    });

                    if (!warehouseExists) {
                        throw new Error(`Warehouse with code ${_warehouseCode.warehouseCode} does not exist.`);
                    }

                    // StockMovement oluşturma
                    await prisma.stockMovement.create({
                        data: {
                            productCode: productCode,
                            warehouseCode: warehouse.warehouseCode,
                            branchCode: data.branchCode,
                            currentCode: data.currentCode,
                            documentType: "Invoice",
                            invoiceType: "Sales",
                            movementType: "SatisFaturasi",
                            documentNo: newInvoice.invoiceNo,
                            gcCode: "Cikis",
                            description: `${newInvoice.invoiceNo} no'lu satış faturası için stok hareketi`,
                            quantity: quantity,
                            unitPrice: detail.unitPrice,
                            totalPrice: detail.totalAmount,
                            unitOfMeasure: stockCard.unit, // Birim
                            priceListId: detail.priceListId
                        },
                    });
                }
                for (const payment of data.payments) {
                    if (payment.method == "cash") {
                        await prisma.vaultMovement.create({
                            data: {
                                invoiceId: newInvoice.id,
                                vaultId: payment.accountId,
                                description: `${newInvoice.invoiceNo} no'lu satış faturası için kasa hareketi`,
                                entering: 0,
                                emerging: payment.amount,
                                vaultDirection: "Exit",
                                vaultType: "SalesInvoicePayment",
                                vaultDocumentType: "General",
                            },
                        });
                        await prisma.vault.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    decrement: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "bank") {
                        await prisma.bankMovement.create({
                            data: {
                                invoiceId: newInvoice.id,
                                bankId: payment.accountId,
                                description: `${newInvoice.invoiceNo} no'lu satış faturası için banka hareketi`,
                                entering: 0,
                                emerging: payment.amount,
                                bankDirection: "Exit",
                                bankType: "SalesInvoicePayment",
                                bankDocumentType: "General",
                            },
                        });
                        await prisma.bank.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    decrement: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "card") {
                        await prisma.posMovement.create({
                            data: {
                                invoiceId: newInvoice.id,
                                posId: payment.accountId,
                                description: `${newInvoice.invoiceNo} no'lu satış faturası için pos hareketi`,
                                entering: 0,
                                emerging: payment.amount,
                                posDirection: "Exit",
                                posType: "SalesInvoicePayment",
                                posDocumentType: "General",
                            },
                        });
                        await prisma.pos.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    decrement: payment.amount,
                                },
                            },
                        });
                    }
                }

                if (!data.payments || data.payments.length === 0) {
                    throw new Error("Payments are required to create an invoice.");
                }
                
                const paymentType = paymentMethodMap[data.payments[0]?.method || "Diğer"] || "Diger";
                // data.paymensts içindeki tüm amount'ları topla
                const totalAmount = data.payments.reduce((sum, p) => sum + p.amount, 0);
                // data.paymensts içinden methodu openAccount olmayanları al ve amount'larını topla
                const totalPaid = data.payments.filter((p) => p.method !== "openAccount").reduce((sum, p) => sum + p.amount, 0);
                
                await prisma.currentMovement.create({
                    data: {
                        currentCode: data.currentCode,
                        dueDate: data.paymentDate,
                        description: `${newInvoice.invoiceNo} no'lu satış faturası için cari hareket`,
                        debtAmount: 0,
                        creditAmount: totalAmount,
                        movementType: "Alacak",
                        priceListId: data.priceListId,
                        documentType: "Fatura",
                        paymentType: paymentMethodMap[data.payments[0]?.method || "Diğer"] || "Diger",
                        documentNo: newInvoice.invoiceNo,
                        companyCode: _companyCode?.companyCode || "",
                        branchCode: data.branchCode,
                    },
                });

                await prisma.currentMovement.create({
                    data: {
                        currentCode: data.currentCode,
                        dueDate: data.paymentDate,
                        description: `${newInvoice.invoiceNo} no'lu satış faturası için cari hareket`,
                        debtAmount: totalPaid,
                        creditAmount: 0,
                        movementType: "Borc",
                        priceListId: data.priceListId,
                        documentType: "Fatura",
                        paymentType: paymentMethodMap[data.payments[0]?.method || "Diğer"] || "Diger",
                        documentNo: newInvoice.invoiceNo,
                        companyCode: _companyCode?.companyCode || "",
                        branchCode: data.branchCode,
                    },
                });
            });
            return result;
        } catch (error) {
            logger.error("Error creating purchase invoice with relations:", error);
            throw error;
        }
    }
}