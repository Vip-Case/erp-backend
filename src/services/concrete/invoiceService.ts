import { Invoice, InvoiceDetail, Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import logger from "../../utils/logger";
import { BaseRepository } from "../../repositories/baseRepository";
import { time } from "console";

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

export interface QuickSaleResponse {
    id: string;
    date: string;
    subtotal: number;
    totalDiscount: number;
    totalVat: number;
    total: number;
    status: string;
    branchCode: string;
    warehouseId: string;
    customer: {
        id: string;
        name: string;
        code: string;
        taxNumber: string;
        taxOffice: string;
    }
    items: Array<{
        productId: string;
        name: string;
        code: string;
        barcode: string;
        quantity: number;
        unitPrice: number;
        discountRate: number;
        discountAmount: number;
        vatRate: number;
        vatAmount: number;
        totalAmount: number;
        unit: string;
        currency: string;
    }>;
    payments: Array<{
        method: string;
        amount: number;
        currency: string;
        accountId: string;
    }>;
}

export interface InvoiceInfo {
    id: string | null;
    invoiceNo: string;
    gibInvoiceNo: string | null;
    invoiceDate: Date | null;
    paymentDate: Date | null;
    paymentDay: number | null;
    branchCode: string | undefined;
    warehouseId: string | undefined;
    warehouseCode: string | null;
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
    stockCardId: string | undefined;
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


export class InvoiceService {
    private invoiceRepository = new BaseRepository<Invoice>(prisma.invoice);
    private invoiceDetailRepository = new BaseRepository<InvoiceDetail>(prisma.invoiceDetail);


    handleSerialToggle = async (checked: boolean) => {
        if (checked) {
            try {
                const lastInvoiceNo = await this.getLastInvoiceNoByType("Sales");

                // Extract components from the last invoice number
                const unitCode = "QRS";
                const currentYear = new Date().getFullYear().toString();
                const sequentialNumber = lastInvoiceNo.slice(-9) ? parseInt(lastInvoiceNo.slice(-9)) + 1 : "000000001";

                // Generate new invoice number
                const newInvoiceNo = `${unitCode}${currentYear}${sequentialNumber
                    .toString()
                    .padStart(9, "0")}`;
                return newInvoiceNo;
            } catch (error) {
                logger.error("Error fetching last invoice number:", error);
                throw error;
            }
        }
    };

    async getAllInvoices(): Promise<Invoice[]> {
        return this.invoiceRepository.findAll();
    }

    async getInvoiceById(id: string): Promise<Invoice | null> {
        return this.invoiceRepository.findById(id);
    }

    async createInvoice(invoice: Invoice): Promise<Invoice> {
        try {
            const Invoice = await prisma.invoice.create({
                data: {
                    invoiceNo: invoice.invoiceNo,
                    gibInvoiceNo: invoice.gibInvoiceNo,
                    invoiceDate: invoice.invoiceDate,
                    invoiceType: invoice.invoiceType,
                    documentType: invoice.documentType,
                    description: invoice.description,
                    genelIskontoTutar: invoice.genelIskontoTutar,
                    genelIskontoOran: invoice.genelIskontoOran,
                    paymentDate: invoice.paymentDate,
                    paymentDay: invoice.paymentDay,
                    totalAmount: invoice.totalAmount,
                    totalVat: invoice.totalVat,
                    totalDiscount: invoice.totalDiscount,
                    totalNet: invoice.totalNet,
                    totalPaid: invoice.totalPaid,
                    totalDebt: invoice.totalDebt,
                    totalBalance: invoice.totalBalance,
                    canceledAt: invoice.canceledAt,

                    priceList: invoice.priceListId ? {
                        connect: {
                            id: invoice.priceListId
                        }
                    } : {},
                    warehouse: invoice.warehouseCode ? {
                        connect: {
                            warehouseCode: invoice.warehouseCode
                        }
                    } : {},
                    outBranch: invoice.outBranchCode ? {
                        connect: {
                            branchCode: invoice.outBranchCode
                        }
                    } : undefined,
                    company: invoice.companyCode ? {
                        connect: {
                            companyCode: invoice.companyCode
                        }
                    } : {},
                    current: invoice.currentCode ? {
                        connect: {
                            currentCode: invoice.currentCode
                        }
                    } : {},
                    branch: invoice.branchCode ? {
                        connect: {
                            branchCode: invoice.branchCode
                        }
                    } : {},
                } as Prisma.InvoiceCreateInput,
            });
            return Invoice;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice> {
        try {
            return await prisma.invoice.update({
                where: { id },
                data: {
                    invoiceNo: invoice.invoiceNo,
                    gibInvoiceNo: invoice.gibInvoiceNo,
                    invoiceDate: invoice.invoiceDate,
                    invoiceType: invoice.invoiceType,
                    documentType: invoice.documentType,
                    description: invoice.description,
                    genelIskontoTutar: invoice.genelIskontoTutar,
                    genelIskontoOran: invoice.genelIskontoOran,
                    paymentDate: invoice.paymentDate,
                    paymentDay: invoice.paymentDay,
                    totalAmount: invoice.totalAmount,
                    totalVat: invoice.totalVat,
                    totalDiscount: invoice.totalDiscount,
                    totalNet: invoice.totalNet,
                    totalPaid: invoice.totalPaid,
                    totalDebt: invoice.totalDebt,
                    totalBalance: invoice.totalBalance,
                    canceledAt: invoice.canceledAt,

                    priceList: invoice.priceListId ? {
                        connect: {
                            id: invoice.priceListId
                        }
                    } : {},
                    warehouse: invoice.warehouseCode ? {
                        connect: {
                            warehouseCode: invoice.warehouseCode
                        }
                    } : {},
                    outBranch: invoice.outBranchCode ? {
                        connect: {
                            branchCode: invoice.outBranchCode
                        }
                    } : undefined,
                    company: invoice.companyCode ? {
                        connect: {
                            companyCode: invoice.companyCode
                        }
                    } : {},
                    current: invoice.currentCode ? {
                        connect: {
                            currentCode: invoice.currentCode
                        }
                    } : {},
                    branch: invoice.branchCode ? {
                        connect: {
                            branchCode: invoice.branchCode
                        }
                    } : {},
                } as Prisma.InvoiceUpdateInput,
            });
        } catch (error) {
            logger.error("Error updating StockCard:", error);
            throw new Error("Could not update StockCard");
        }
    }

    async deleteInvoice(id: string): Promise<boolean> {
        return this.invoiceRepository.delete(id);
    }

    async createPurchaseInvoiceWithRelations(data: InvoiceInfo): Promise<any> {
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
                        invoiceType: "Purchase",
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

                // Alış işlemleri
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

                    if (stockCardWarehouse) {
                        await prisma.stockCardWarehouse.update({
                            where: { id: stockCardWarehouse.id },
                            data: {
                                quantity: stockCardWarehouse.quantity.plus(quantity),
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

                    // StockMovement oluşturma
                    await prisma.stockMovement.create({
                        data: {
                            productCode: productCode,
                            warehouseCode: warehouse.warehouseCode,
                            branchCode: data.branchCode,
                            currentCode: data.currentCode,
                            documentType: "Invoice",
                            invoiceType: "Purchase",
                            movementType: "AlisFaturasi",
                            documentNo: newInvoice.invoiceNo,
                            gcCode: "Giris",
                            description: `${newInvoice.invoiceNo} no'lu alış faturası için stok hareketi`,
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
                                description: `${newInvoice.invoiceNo} no'lu alış faturası için kasa hareketi`,
                                entering: 0,
                                emerging: payment.amount,
                                vaultDirection: "Exit",
                                vaultType: "PurchaseInvoicePayment",
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
                                description: `${newInvoice.invoiceNo} no'lu alış faturası için banka hareketi`,
                                entering: 0,
                                emerging: payment.amount,
                                bankDirection: "Exit",
                                bankType: "PurchaseInvoicePayment",
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
                                description: `${newInvoice.invoiceNo} no'lu alış faturası için pos hareketi`,
                                entering: 0,
                                emerging: payment.amount,
                                posDirection: "Exit",
                                posType: "PurchaseInvoicePayment",
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
                // data.paymensts içindeki tüm amount'ları topla
                const totalAmount = data.payments.reduce((sum, p) => sum + p.amount, 0);
                // data.paymensts içinden methodu openAccount olmayanları al ve amount'larını topla
                const totalPaid = data.payments.filter((p) => p.method !== "openAccount").reduce((sum, p) => sum + p.amount, 0);
                await prisma.currentMovement.create({
                    data: {
                        currentCode: data.currentCode,
                        dueDate: data.paymentDate,
                        description: `${newInvoice.invoiceNo} no'lu alış faturası için cari hareket`,
                        debtAmount: totalAmount,
                        creditAmount: 0,
                        movementType: "Borc",
                        priceListId: data.priceListId,
                        documentType: "Fatura",
                        paymentType: "ÇokluÖdeme",
                        documentNo: newInvoice.invoiceNo,
                        companyCode: _companyCode?.companyCode || "",
                        branchCode: data.branchCode,
                    },
                });

                if (totalPaid > 0) {
                    await prisma.currentMovement.create({
                        data: {
                            currentCode: data.currentCode,
                            dueDate: data.paymentDate,
                            description: `${newInvoice.invoiceNo} no'lu alış faturası için cari hareket`,
                            debtAmount: 0,
                            creditAmount: totalPaid,
                            movementType: "Alacak",
                            priceListId: data.priceListId,
                            documentType: "Fatura",
                            paymentType: "ÇokluÖdeme",
                            documentNo: newInvoice.invoiceNo,
                            companyCode: _companyCode?.companyCode || "",
                            branchCode: data.branchCode,
                        },
                    });
                }
            });
            return result;
        } catch (error) {
            logger.error("Error creating purchase invoice with relations:", error);
            throw error;
        }
    }

    async createSalesInvoiceWithRelations(data: InvoiceInfo): Promise<any> {
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

                    if (stockCardWarehouse) {
                        await prisma.stockCardWarehouse.update({
                            where: { id: stockCardWarehouse.id },
                            data: {
                                quantity: stockCardWarehouse.quantity.minus(quantity),
                            },
                        });
                    } else {
                        console.error("Ürün'ün stoğu bulunamadı. Stoğu olmayan ürünün satışı yapılamaz.");
                    }

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
                                entering: payment.amount,
                                emerging: 0,
                                vaultDirection: "Introduction",
                                vaultType: "SalesInvoicePayment",
                                vaultDocumentType: "General",
                            },
                        });
                        await prisma.vault.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "bank") {
                        await prisma.bankMovement.create({
                            data: {
                                invoiceId: newInvoice.id,
                                bankId: payment.accountId,
                                description: `${newInvoice.invoiceNo} no'lu satış faturası için banka hareketi`,
                                entering: payment.amount,
                                emerging: 0,
                                bankDirection: "Introduction",
                                bankType: "SalesInvoicePayment",
                                bankDocumentType: "General",
                            },
                        });
                        await prisma.bank.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "card") {
                        await prisma.posMovement.create({
                            data: {
                                invoiceId: newInvoice.id,
                                posId: payment.accountId,
                                description: `${newInvoice.invoiceNo} no'lu satış faturası için pos hareketi`,
                                entering: payment.amount,
                                emerging: 0,
                                posDirection: "Introduction",
                                posType: "SalesInvoicePayment",
                                posDocumentType: "General",
                            },
                        });
                        await prisma.pos.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: payment.amount,
                                },
                            },
                        });
                    }
                }
                // data.paymensts içindeki tüm amount'ları topla
                const totalAmount = data.payments.reduce((sum, p) => sum + p.amount, 0);
                // data.paymensts içinden methodu openAccount olmayanları al ve amount'larını topla
                const totalPaid = data.payments.filter((p) => p.method !== "openAccount").reduce((sum, p) => sum + p.amount, 0);
                await prisma.currentMovement.create({
                    data: {
                        currentCode: data.currentCode,
                        dueDate: data.paymentDate,
                        description: `${newInvoice.invoiceNo} no'lu satış faturası için cari hareket`,
                        debtAmount: totalAmount,
                        creditAmount: 0,
                        movementType: "Alacak",
                        priceListId: data.priceListId,
                        documentType: "Fatura",
                        paymentType: "ÇokluÖdeme",
                        documentNo: newInvoice.invoiceNo,
                        companyCode: _companyCode?.companyCode || "",
                        branchCode: data.branchCode,
                    },
                });

                if (totalPaid > 0) {
                    await prisma.currentMovement.create({
                        data: {
                            currentCode: data.currentCode,
                            dueDate: data.paymentDate,
                            description: `${newInvoice.invoiceNo} no'lu satış faturası için cari hareket`,
                            debtAmount: 0,
                            creditAmount: totalPaid,
                            movementType: "Borc",
                            priceListId: data.priceListId,
                            documentType: "Fatura",
                            paymentType: "ÇokluÖdeme",
                            documentNo: newInvoice.invoiceNo,
                            companyCode: _companyCode?.companyCode || "",
                            branchCode: data.branchCode,
                        },
                    });
                }
            });
            return result;
        } catch (error) {
            logger.error("Error creating purchase invoice with relations:", error);
            throw error;
        }
    }

    async createQuickSaleInvoiceWithRelations(data: QuickSaleResponse): Promise<any> {
        try {
            const result = await prisma.$transaction(async (prisma) => {
                let totalAmountt = data.payments.reduce((sum, p) => sum + p.amount, 0);
                // data.paymensts içinden methodu openAccount olmayanları al ve amount'larını topla
                let totalPaidd = data.payments.filter((p) => p.method !== "openAccount").reduce((sum, p) => sum + p.amount, 0);
                totalAmountt = totalAmountt - totalPaidd;
                const _invoiceNo = await this.handleSerialToggle(true);
                // 1. Ana fatura oluşturuluyor
                const newInvoice = await prisma.invoice.create({
                    data: {
                        invoiceNo: _invoiceNo ?? data.id,
                        invoiceDate: data.date,
                        branch: { connect: { branchCode: data.branchCode } },
                        warehouse: { connect: { id: data.warehouseId } },
                        invoiceType: "Sales",
                        documentType: "Order",
                        current: { connect: { currentCode: data.customer.code } },
                        totalAmount: data.total,
                        totalVat: data.totalVat,
                        totalDiscount: 0,
                        totalNet: data.subtotal,
                        totalPaid: totalPaidd,
                        totalDebt: totalAmountt,
                        description: `${_invoiceNo} no'lu hızlı satış faturası`,
                    },
                });

                // 2. İlgili fatura detaylarını ve stok işlemlerini ekleme
                // Fatura detaylarını ekleme
                for (const detail of data.items) {
                    const _productCode = await prisma.stockCard.findUnique({
                        where: { id: detail.productId },
                        select: { productCode: true },
                    });
                    await prisma.invoiceDetail.create({
                        data: {
                            quantity: detail.quantity,
                            unitPrice: detail.unitPrice,
                            vatRate: parseFloat(detail.vatRate.toString()),
                            netPrice: detail.totalAmount - detail.vatAmount,
                            totalPrice: detail.totalAmount,
                            discount: 0,
                            invoice: { connect: { id: newInvoice.id } },
                            stockCard: { connect: { productCode: _productCode?.productCode } },
                        },
                    });
                }

                // Satış işlemleri
                for (const detail of data.items) {
                    const stockCard = await prisma.stockCard.findUnique({
                        where: { id: detail.productId },
                    });

                    if (!stockCard) {
                        throw new Error(`StockCard with ID '${detail.productId}' does not exist.`);
                    }

                    const stockCardWarehouse = await prisma.stockCardWarehouse.findUnique({
                        where: {
                            stockCardId_warehouseId: {
                                stockCardId: detail.productId,
                                warehouseId: data.warehouseId,
                            },
                        },
                    });

                    const _productCode = stockCard.productCode;
                    const quantity = detail.quantity;

                    // Stok miktarını güncelleme

                    const stockWarehouse = await prisma.stockCardWarehouse.update({
                        where: { id: stockCardWarehouse!.id },
                        data: {
                            quantity: stockCardWarehouse!.quantity.minus(quantity),
                        },
                    });

                    // Ensure warehouseCode exists before creating stockMovement
                    const warehouseExists = await prisma.warehouse.findUnique({
                        where: { id: data.warehouseId },
                    });

                    if (!warehouseExists) {
                        throw new Error(`Warehouse with code ${data.warehouseId} does not exist.`);
                    }

                    // StockMovement oluşturma
                    await prisma.stockMovement.create({
                        data: {
                            productCode: _productCode,
                            warehouseCode: warehouseExists.warehouseCode,
                            branchCode: data.branchCode,
                            currentCode: data.customer.code,
                            documentType: "Order",
                            invoiceType: "Sales",
                            movementType: "HizliSatis",
                            documentNo: newInvoice.invoiceNo,
                            gcCode: "Cikis",
                            description: `${newInvoice.invoiceNo} no'lu hızlı satış için stok hareketi`,
                            quantity: quantity,
                            unitPrice: detail.unitPrice,
                            totalPrice: detail.totalAmount,
                            unitOfMeasure: stockCard.unit, // Birim
                        },
                    });
                }
                for (const payment of data.payments) {
                    if (payment.method == "cash") {
                        await prisma.vaultMovement.create({
                            data: {
                                invoiceId: newInvoice.id,
                                vaultId: payment.accountId,
                                description: `${newInvoice.invoiceNo} no'lu hızlı satış için kasa hareketi`,
                                entering: payment.amount,
                                emerging: 0,
                                vaultDirection: "Introduction",
                                vaultType: "SalesInvoicePayment",
                                vaultDocumentType: "General",
                            },
                        });
                        await prisma.vault.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "bank") {
                        await prisma.bankMovement.create({
                            data: {
                                invoiceId: newInvoice.id,
                                bankId: payment.accountId,
                                description: `${newInvoice.invoiceNo} no'lu hızlı satış için banka hareketi`,
                                entering: payment.amount,
                                emerging: 0,
                                bankDirection: "Introduction",
                                bankType: "SalesInvoicePayment",
                                bankDocumentType: "General",
                            },
                        });
                        await prisma.bank.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "card") {
                        await prisma.posMovement.create({
                            data: {
                                invoiceId: newInvoice.id,
                                posId: payment.accountId,
                                description: `${newInvoice.invoiceNo} no'lu hızlı satış için pos hareketi`,
                                entering: payment.amount,
                                emerging: 0,
                                posDirection: "Introduction",
                                posType: "SalesInvoicePayment",
                                posDocumentType: "General",
                            },
                        });
                        await prisma.pos.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: payment.amount,
                                },
                            },
                        });
                    }
                }

                const _companyCode = await prisma.company.findFirst({
                    select: { companyCode: true },
                });
                // data.paymensts içindeki tüm amount'ları topla
                const totalAmount = data.payments.reduce((sum, p) => sum + p.amount, 0);
                // data.paymensts içinden methodu openAccount olmayanları al ve amount'larını topla
                const totalPaid = data.payments.filter((p) => p.method !== "openAccount").reduce((sum, p) => sum + p.amount, 0);
                await prisma.currentMovement.create({
                    data: {
                        currentCode: data.customer.code,
                        dueDate: new Date(),
                        description: `${newInvoice.invoiceNo} no'lu satış faturası için cari hareket`,
                        debtAmount: totalAmount,
                        creditAmount: 0,
                        movementType: "Borc",
                        documentType: "Fatura",
                        paymentType: "ÇokluÖdeme",
                        documentNo: newInvoice.invoiceNo,
                        companyCode: _companyCode?.companyCode || "",
                        branchCode: data.branchCode,
                    },
                });
                if (totalPaid > 0) {
                    await prisma.currentMovement.create({
                        data: {
                            currentCode: data.customer.code,
                            dueDate: new Date(),
                            description: `${newInvoice.invoiceNo} no'lu satış faturası için cari hareket`,
                            debtAmount: 0,
                            creditAmount: totalPaid,
                            movementType: "Alacak",
                            documentType: "Fatura",
                            paymentType: "ÇokluÖdeme",
                            documentNo: newInvoice.invoiceNo,
                            companyCode: _companyCode?.companyCode || "",
                            branchCode: data.branchCode,
                        },
                    });
                }

            });
            return result;
        } catch (error) {
            logger.error("Error creating quick sale invoice with relations:", error);
            throw error;
        }
    }

    async updateInvoiceWithRelations(id: string, invoice: Partial<Invoice>, invoiceDetails: InvoiceDetail[], vaultId?: string): Promise<Invoice> {
        try {
            // 1. Faturayı bul ve `invoiceNo` değerini al
            const existingInvoice = await prisma.invoice.findUnique({
                where: { id },
                select: { invoiceNo: true },
            });

            if (!existingInvoice || !existingInvoice.invoiceNo) {
                throw new Error(`Invoice with ID '${id}' does not exist or has no invoiceNo.`);
            }

            const invoiceNo = existingInvoice.invoiceNo;

            // 2. İlişkili verileri güncelle
            await prisma.$transaction(async (prisma) => {
                // 2.1 Mevcut ilişkili `invoiceDetails` silinir ve yeniden eklenir
                await prisma.invoiceDetail.deleteMany({ where: { invoiceId: id } });
                await prisma.invoiceDetail.createMany({
                    data: invoiceDetails.map((detail) => ({
                        ...detail,
                        invoiceId: id,
                    })),
                });

                // 2.2 Mevcut `currentMovement` verileri güncellenir veya yeniden oluşturulur
                await prisma.currentMovement.deleteMany({ where: { documentNo: invoiceNo } });
                if (invoice.currentCode) {
                    await prisma.currentMovement.create({
                        data: {
                            currentCode: invoice.currentCode,
                            documentNo: invoiceNo,
                            companyCode: invoice.companyCode!,
                            branchCode: invoice.branchCode!,
                            debtAmount: invoiceDetails.reduce((sum, d) => sum.plus(d.netPrice), new Prisma.Decimal(0)),
                            creditAmount: new Prisma.Decimal(0),
                            movementType: "Borc",
                            documentType: "Fatura",
                            description: `Updated Current movement for invoice ${invoiceNo}`,
                        },
                    });
                }

                // 2.3 Mevcut `stockMovement` verileri güncellenir
                await prisma.stockMovement.deleteMany({ where: { documentNo: invoiceNo } });
                await Promise.all(
                    invoiceDetails.map((detail) =>
                        prisma.stockMovement.create({
                            data: {
                                documentNo: invoiceNo,
                                productCode: detail.productCode,
                                gcCode: "Giris",
                                warehouseCode: invoice.warehouseCode!,
                                branchCode: invoice.branchCode!,
                                movementType: "Devir",
                                quantity: detail.quantity,
                                unitPrice: detail.unitPrice,
                                totalPrice: detail.totalPrice,
                                description: `Updated stock movement for invoice ${invoiceNo}`,
                            },
                        })
                    )
                );

                // 2.4 Mevcut `vaultMovement` güncellenir veya yeniden oluşturulur
                await prisma.vaultMovement.deleteMany({ where: { invoiceId: id } });
                if (vaultId) {
                    const existingVault = await prisma.vault.findUnique({ where: { id: vaultId } });

                    if (!existingVault) {
                        throw new Error(`Vault with ID '${vaultId}' does not exist.`);
                    }

                    await prisma.vaultMovement.create({
                        data: {
                            invoiceId: id,
                            vaultId: vaultId,
                            description: `Updated vault movement for invoice ${invoiceNo}`,
                            entering: invoiceDetails.reduce((sum, d) => sum.plus(d.netPrice), new Prisma.Decimal(0)),
                            emerging: new Prisma.Decimal(0),
                            vaultDirection: "Introduction",
                            vaultType: "InputReceipt",
                            vaultDocumentType: "General",
                        },
                    });
                } else {
                    console.log("No vaultId provided. Skipping VaultMovement creation.");
                }
            });

            // 3. Ana faturayı güncelle
            return await prisma.invoice.update({
                where: { id },
                data: {
                    invoiceNo: invoice.invoiceNo || undefined,
                    gibInvoiceNo: invoice.gibInvoiceNo || undefined,
                    invoiceDate: invoice.invoiceDate || undefined,
                    invoiceType: invoice.invoiceType || undefined,
                    documentType: invoice.documentType || undefined,
                    description: invoice.description || undefined,
                    canceledAt: invoice.canceledAt || undefined,

                    // İlişkili alanlar
                    priceList: invoice.priceListId
                        ? { connect: { id: invoice.priceListId } }
                        : undefined,
                    warehouse: invoice.warehouseCode
                        ? { connect: { warehouseCode: invoice.warehouseCode } }
                        : undefined,
                    outBranch: invoice.outBranchCode
                        ? { connect: { branchCode: invoice.outBranchCode } }
                        : undefined,
                    company: invoice.companyCode
                        ? { connect: { companyCode: invoice.companyCode } }
                        : undefined,
                    current: invoice.currentCode !== null && invoice.currentCode !== undefined
                        ? { connect: { currentCode: invoice.currentCode } }
                        : undefined,
                    branch: invoice.branchCode
                        ? { connect: { branchCode: invoice.branchCode } }
                        : undefined,
                },
            });
        } catch (error) {
            logger.error("Error updating invoice with relations:", error);
            throw new Error("Failed to update invoice with related data.");
        }
    }

    async getAllInvoicesWithRelations(): Promise<Invoice[]> {
        return await prisma.invoice.findMany({
            include: {
                invoiceDetail: true, // İlişkili detayları dahil et
            },
        });
    }

    // Belirli bir invoice'ı ID ile ilişkili detaylarla birlikte getirme
    async getInvoiceWithRelationsById(id: string): Promise<Invoice | null> {
        return await prisma.invoice.findUnique({
            where: { id },
            include: {
                invoiceDetail: true, // İlişkili detayları dahil et
            },
        });
    }

    async getLastInvoiceNoByType(invoiceType: string): Promise<string> {
        const lastInvoice = await prisma.invoice.findFirst({
            where: { invoiceType: invoiceType as Invoice["invoiceType"] },
            orderBy: { invoiceNo: "desc" },
        });

        if (lastInvoice) {
            return lastInvoice.invoiceNo;
        }

        return "";
    }

    async getInvoiceInfoById(id: string): Promise<InvoiceDetailResponse | null> {
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                invoiceDetail: true,
                currentMovement: true,
                vaultMovement: true,
                BankMovement: true,
                PosMovement: true,
                current: true,
                priceList: true,
                warehouse: true,
                branch: true,
            },
        });

        if (!invoice) return null;

        const items = invoice.invoiceDetail.map(detail => ({
            id: detail.id,
            stockId: detail.productCode,
            stockCode: detail.productCode,
            stockName: detail.productCode,
            quantity: detail.quantity.toNumber(),
            unit: 'Adet', // Assuming unit is 'Adet', adjust as necessary
            unitPrice: detail.unitPrice.toNumber(),
            vatRate: detail.vatRate.toNumber(),
            vatAmount: detail.totalPrice.toNumber() - detail.netPrice.toNumber(),
            totalAmount: detail.totalPrice.toNumber(),
            priceListId: invoice.priceListId ?? null,
            currency: invoice.priceList?.currency ?? null,
            isVatIncluded: invoice.priceList?.isVatIncluded,
        }));

        const payments: InvoicePayments[] = [];

        if (invoice.vaultMovement) {
            payments.push(
                ...invoice.vaultMovement.map(payment => ({
                    method: 'cash',
                    accountId: payment.vaultId,
                    amount: payment.entering.toNumber(),
                    currency: invoice.priceList?.currency ?? null,
                    description: payment.description,
                }))
            );
        }

        if (invoice.BankMovement) {
            payments.push(
                ...invoice.BankMovement.map(payment => ({
                    method: 'bank',
                    accountId: payment.bankId,
                    amount: payment.entering.toNumber(),
                    currency: invoice.priceList?.currency ?? null,
                    description: payment.description,
                }))
            );
        }

        if (invoice.PosMovement) {
            payments.push(
                ...invoice.PosMovement.map(payment => ({
                    method: 'card',
                    accountId: payment.posId,
                    amount: payment.entering.toNumber(),
                    currency: invoice.priceList?.currency ?? null,
                    description: payment.description,
                }))
            );
        }

        if (invoice.currentMovement) {
            const debtAmount = invoice.currentMovement
                .filter(movement => movement.movementType === 'Borc')
                .reduce((sum, movement) => sum + movement.debtAmount.toNumber(), 0);

            const creditAmount = invoice.currentMovement
                .filter(movement => movement.movementType === 'Alacak')
                .reduce((sum, movement) => sum + movement.creditAmount.toNumber(), 0);

            if (debtAmount - creditAmount > 0) {
                payments.push({
                    method: 'openAccount',
                    accountId: null,
                    amount: debtAmount - creditAmount,
                    currency: invoice.priceList?.currency ?? null,
                    description: null,
                });
            }
        }

        const invoiceDetailResponse: InvoiceDetailResponse = {
            id: invoice.id,
            invoiceNo: invoice.invoiceNo,
            gibInvoiceNo: invoice.gibInvoiceNo,
            invoiceDate: invoice.invoiceDate?.toISOString(),
            paymentDate: invoice.paymentDate?.toISOString(),
            paymentTerm: invoice.paymentDay,
            branchCode: invoice.branch?.branchCode ?? '',
            warehouseId: invoice.warehouse?.id ?? '',
            description: invoice.description,
            invoiceType: invoice.invoiceType,
            documentType: 'Invoice', // Assuming document type is 'Invoice', adjust as necessary
            current: {
                id: invoice.current?.id ?? '',
                currentCode: invoice.current?.currentCode ?? '',
                currentName: invoice.current?.currentName ?? '',
                priceList: invoice.priceList ? {
                    id: invoice.priceList.id,
                    priceListName: invoice.priceList.priceListName,
                    currency: invoice.priceList.currency,
                    isVatIncluded: invoice.priceList.isVatIncluded,
                } : undefined,
            },
            items,
            payments,
        };

        return invoiceDetailResponse;
    }

    async deleteSalesInvoiceWithRelationsAndRecreate(invoiceId: string, data: InvoiceInfo): Promise<any> {
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
                await prisma.currentMovement.deleteMany({ where: { documentNo: data.invoiceNo } });
                await prisma.stockMovement.deleteMany({ where: { documentNo: data.invoiceNo } });
                for (const payment of data.payments) {
                    if (payment.method == "cash") {
                        await prisma.vaultMovement.deleteMany({ where: { invoiceId: invoiceId } });
                        await prisma.vault.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    decrement: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "bank") {
                        await prisma.bankMovement.deleteMany({ where: { invoiceId: invoiceId } });
                        await prisma.bank.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    decrement: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "card") {
                        await prisma.posMovement.deleteMany({ where: { invoiceId: invoiceId } });
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
                const oldInvoiceDetails = await prisma.invoiceDetail.findMany({ where: { invoiceId: invoiceId } });
                for (const detail of oldInvoiceDetails) {
                    const stockCard = await prisma.stockCard.findUnique({
                        where: { productCode: detail.productCode },
                    });

                    if (!stockCard) {
                        throw new Error(`StockCard with ID '${detail.productCode}' does not exist.`);
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
                                stockCardId: stockCard.id,
                                warehouseId: data.warehouseId,
                            },
                        },
                    });

                    const productCode = stockCard.productCode;
                    const quantity = detail.quantity;

                    // Stok miktarını güncelleme

                    if (stockCardWarehouse) {
                        await prisma.stockCardWarehouse.update({
                            where: { id: stockCardWarehouse.id },
                            data: {
                                quantity: stockCardWarehouse.quantity.plus(quantity),
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
                }
                await prisma.invoiceDetail.deleteMany({ where: { invoiceId: invoiceId } });
                await prisma.invoice.update({
                    where: { id: invoiceId },
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
                // Fatura detaylarını ekleme
                for (const detail of data.items) {
                    const _productCode = await prisma.stockCard.findUnique({
                        where: { productCode: detail.stockCardId },
                        select: { productCode: true },
                    });
                    await prisma.invoiceDetail.create({
                        data: {
                            invoiceId: invoiceId,
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
                        where: { productCode: detail.stockCardId },
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
                                stockCardId: stockCard.id,
                                warehouseId: data.warehouseId,
                            },
                        },
                    });

                    const productCode = stockCard.productCode;
                    const quantity = detail.quantity;

                    // Stok miktarını güncelleme

                    if (stockCardWarehouse) {
                        await prisma.stockCardWarehouse.update({
                            where: { id: stockCardWarehouse.id },
                            data: {
                                quantity: stockCardWarehouse.quantity.minus(quantity),
                            },
                        });
                    } else {
                        console.error("Ürün'ün stoğu bulunamadı. Stoğu olmayan ürünün satışı yapılamaz.");
                    }

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
                            documentNo: data.invoiceNo,
                            gcCode: "Cikis",
                            description: `${data.invoiceNo} no'lu satış faturası için stok hareketi`,
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
                                invoiceId: invoiceId,
                                vaultId: payment.accountId,
                                description: `${data.invoiceNo} no'lu satış faturası için kasa hareketi`,
                                entering: payment.amount,
                                emerging: 0,
                                vaultDirection: "Introduction",
                                vaultType: "SalesInvoicePayment",
                                vaultDocumentType: "General",
                            },
                        });
                        await prisma.vault.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "bank") {
                        await prisma.bankMovement.create({
                            data: {
                                invoiceId: invoiceId,
                                bankId: payment.accountId,
                                description: `${data.invoiceNo} no'lu satış faturası için banka hareketi`,
                                entering: payment.amount,
                                emerging: 0,
                                bankDirection: "Introduction",
                                bankType: "SalesInvoicePayment",
                                bankDocumentType: "General",
                            },
                        });
                        await prisma.bank.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "card") {
                        await prisma.posMovement.create({
                            data: {
                                invoiceId: invoiceId,
                                posId: payment.accountId,
                                description: `${data.invoiceNo} no'lu satış faturası için pos hareketi`,
                                entering: payment.amount,
                                emerging: 0,
                                posDirection: "Introduction",
                                posType: "SalesInvoicePayment",
                                posDocumentType: "General",
                            },
                        });
                        await prisma.pos.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: payment.amount,
                                },
                            },
                        });
                    }
                }
                // data.paymensts içindeki tüm amount'ları topla
                const totalAmount = data.payments.reduce((sum, p) => sum + p.amount, 0);
                // data.paymensts içinden methodu openAccount olmayanları al ve amount'larını topla
                const totalPaid = data.payments.filter((p) => p.method !== "openAccount").reduce((sum, p) => sum + p.amount, 0);
                await prisma.currentMovement.create({
                    data: {
                        currentCode: data.currentCode,
                        dueDate: data.paymentDate,
                        description: `${data.invoiceNo} no'lu satış faturası için cari hareket`,
                        debtAmount: totalAmount,
                        creditAmount: 0,
                        movementType: "Alacak",
                        priceListId: data.priceListId,
                        documentType: "Fatura",
                        paymentType: "ÇokluÖdeme",
                        documentNo: data.invoiceNo,
                        companyCode: _companyCode?.companyCode || "",
                        branchCode: data.branchCode,
                    },
                });

                if (totalPaid > 0) {
                    await prisma.currentMovement.create({
                        data: {
                            currentCode: data.currentCode,
                            dueDate: data.paymentDate,
                            description: `${data.invoiceNo} no'lu satış faturası için cari hareket`,
                            debtAmount: 0,
                            creditAmount: totalPaid,
                            movementType: "Borc",
                            priceListId: data.priceListId,
                            documentType: "Fatura",
                            paymentType: "ÇokluÖdeme",
                            documentNo: data.invoiceNo,
                            companyCode: _companyCode?.companyCode || "",
                            branchCode: data.branchCode,
                        },
                    });
                }
            });
            return result;
        } catch (error) {
            console.error(error);
            logger.error(error);
            throw error
        }
    }

    async deletePurchaseInvoiceWithRelationsAndRecreate(invoiceId: string, data: InvoiceInfo): Promise<any> {
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
                await prisma.currentMovement.deleteMany({ where: { documentNo: data.invoiceNo } });
                await prisma.stockMovement.deleteMany({ where: { documentNo: data.invoiceNo } });
                for (const payment of data.payments) {
                    if (payment.method == "cash") {
                        await prisma.vaultMovement.deleteMany({ where: { invoiceId: invoiceId } });
                        await prisma.vault.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "bank") {
                        await prisma.bankMovement.deleteMany({ where: { invoiceId: invoiceId } });
                        await prisma.bank.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "card") {
                        await prisma.posMovement.deleteMany({ where: { invoiceId: invoiceId } });
                        await prisma.pos.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: payment.amount,
                                },
                            },
                        });
                    }
                }
                const oldInvoiceDetails = await prisma.invoiceDetail.findMany({ where: { invoiceId: invoiceId } });
                for (const detail of oldInvoiceDetails) {
                    const stockCard = await prisma.stockCard.findUnique({
                        where: { productCode: detail.productCode },
                    });

                    if (!stockCard) {
                        throw new Error(`StockCard with ID '${detail.productCode}' does not exist.`);
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
                                stockCardId: stockCard.id,
                                warehouseId: data.warehouseId,
                            },
                        },
                    });

                    const productCode = stockCard.productCode;
                    const quantity = detail.quantity;

                    // Stok miktarını güncelleme
                    if (stockCardWarehouse) {
                        await prisma.stockCardWarehouse.update({
                            where: { id: stockCardWarehouse.id },
                            data: {
                                quantity: stockCardWarehouse.quantity.minus(quantity),
                            },
                        });
                    } else {
                        console.error("Ürün'ün stoğu bulunamadı.");
                    }
                }
                await prisma.invoiceDetail.deleteMany({ where: { invoiceId: invoiceId } });
                await prisma.invoice.update({
                    where: { id: invoiceId },
                    data: {
                        invoiceNo: data.invoiceNo,
                        gibInvoiceNo: data.gibInvoiceNo,
                        invoiceDate: data.invoiceDate,
                        invoiceType: "Purchase",
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
                // Fatura detaylarını ekleme
                for (const detail of data.items) {
                    const _productCode = await prisma.stockCard.findUnique({
                        where: { productCode: detail.stockCardId },
                        select: { productCode: true },
                    });
                    await prisma.invoiceDetail.create({
                        data: {
                            invoiceId: invoiceId,
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

                // Alış işlemleri
                for (const detail of data.items) {
                    const stockCard = await prisma.stockCard.findUnique({
                        where: { productCode: detail.stockCardId },
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
                                stockCardId: stockCard.id,
                                warehouseId: data.warehouseId,
                            },
                        },
                    });

                    const productCode = stockCard.productCode;
                    const quantity = detail.quantity;

                    // Stok miktarını güncelleme
                    if (stockCardWarehouse) {
                        await prisma.stockCardWarehouse.update({
                            where: { id: stockCardWarehouse.id },
                            data: {
                                quantity: stockCardWarehouse.quantity.plus(quantity),
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
                            invoiceType: "Purchase",
                            movementType: "AlisFaturasi",
                            documentNo: data.invoiceNo,
                            gcCode: "Giris",
                            description: `${data.invoiceNo} no'lu alış faturası için stok hareketi`,
                            quantity: quantity,
                            unitPrice: detail.unitPrice,
                            totalPrice: detail.totalAmount,
                            unitOfMeasure: stockCard.unit,
                            priceListId: detail.priceListId
                        },
                    });
                }
                for (const payment of data.payments) {
                    if (payment.method == "cash") {
                        await prisma.vaultMovement.create({
                            data: {
                                invoiceId: invoiceId,
                                vaultId: payment.accountId,
                                description: `${data.invoiceNo} no'lu alış faturası için kasa hareketi`,
                                entering: 0,
                                emerging: payment.amount,
                                vaultDirection: "Exit",
                                vaultType: "PurchaseInvoicePayment",
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
                                invoiceId: invoiceId,
                                bankId: payment.accountId,
                                description: `${data.invoiceNo} no'lu alış faturası için banka hareketi`,
                                entering: 0,
                                emerging: payment.amount,
                                bankDirection: "Exit",
                                bankType: "PurchaseInvoicePayment",
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
                                invoiceId: invoiceId,
                                posId: payment.accountId,
                                description: `${data.invoiceNo} no'lu alış faturası için pos hareketi`,
                                entering: 0,
                                emerging: payment.amount,
                                posDirection: "Exit",
                                posType: "PurchaseInvoicePayment",
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
                // data.paymensts içindeki tüm amount'ları topla
                const totalAmount = data.payments.reduce((sum, p) => sum + p.amount, 0);
                // data.paymensts içinden methodu openAccount olmayanları al ve amount'larını topla
                const totalPaid = data.payments.filter((p) => p.method !== "openAccount").reduce((sum, p) => sum + p.amount, 0);
                await prisma.currentMovement.create({
                    data: {
                        currentCode: data.currentCode,
                        dueDate: data.paymentDate,
                        description: `${data.invoiceNo} no'lu alış faturası için cari hareket`,
                        debtAmount: totalAmount,
                        creditAmount: 0,
                        movementType: "Borc",
                        priceListId: data.priceListId,
                        documentType: "Fatura",
                        paymentType: "ÇokluÖdeme",
                        documentNo: data.invoiceNo,
                        companyCode: _companyCode?.companyCode || "",
                        branchCode: data.branchCode,
                    },
                });

                if (totalPaid > 0) {
                    await prisma.currentMovement.create({
                        data: {
                            currentCode: data.currentCode,
                            dueDate: data.paymentDate,
                            description: `${data.invoiceNo} no'lu alış faturası için cari hareket`,
                            debtAmount: 0,
                            creditAmount: totalPaid,
                            movementType: "Alacak",
                            priceListId: data.priceListId,
                            documentType: "Fatura",
                            paymentType: "ÇokluÖdeme",
                            documentNo: data.invoiceNo,
                            companyCode: _companyCode?.companyCode || "",
                            branchCode: data.branchCode,
                        },
                    });
                }
            });
            return result;
        } catch (error) {
            logger.error("Error deleting and recreating purchase invoice with relations:", error);
            throw error;
        }
    }

    async deleteSalesInvoiceWithRelations(invoiceId: string, data: InvoiceInfo): Promise<any> {

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
                await prisma.currentMovement.deleteMany({ where: { documentNo: data.invoiceNo } });
                await prisma.stockMovement.deleteMany({ where: { documentNo: data.invoiceNo } });
                for (const payment of data.payments) {
                    if (payment.method == "cash") {
                        await prisma.vaultMovement.deleteMany({ where: { invoiceId: invoiceId } });
                        await prisma.vault.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    decrement: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "bank") {
                        await prisma.bankMovement.deleteMany({ where: { invoiceId: invoiceId } });
                        await prisma.bank.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    decrement: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "card") {
                        await prisma.posMovement.deleteMany({ where: { invoiceId: invoiceId } });
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
                const oldInvoiceDetails = await prisma.invoiceDetail.findMany({ where: { invoiceId: invoiceId } });
                for (const detail of oldInvoiceDetails) {
                    const stockCard = await prisma.stockCard.findUnique({
                        where: { productCode: detail.productCode },
                    });

                    if (!stockCard) {
                        throw new Error(`StockCard with ID '${detail.productCode}' does not exist.`);
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
                                stockCardId: stockCard.id,
                                warehouseId: data.warehouseId,
                            },
                        },
                    });

                    const productCode = stockCard.productCode;
                    const quantity = detail.quantity;

                    // Stok miktarını güncelleme

                    if (stockCardWarehouse) {
                        await prisma.stockCardWarehouse.update({
                            where: { id: stockCardWarehouse.id },
                            data: {
                                quantity: stockCardWarehouse.quantity.plus(quantity),
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
                }
                await prisma.invoiceDetail.deleteMany({ where: { invoiceId: invoiceId } });
                await prisma.invoice.delete({ where: { id: invoiceId } });
            });
            return result;
        } catch (error) {
            logger.error("Error deleting invoice with relations:", error);
            throw new Error("Failed to delete invoice and its related records.");
        }
    }

    async deletePurchaseInvoiceWithRelations(invoiceId: string, data: InvoiceInfo): Promise<any> {
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
                await prisma.currentMovement.deleteMany({ where: { documentNo: data.invoiceNo } });
                await prisma.stockMovement.deleteMany({ where: { documentNo: data.invoiceNo } });
                for (const payment of data.payments) {
                    if (payment.method == "cash") {
                        await prisma.vaultMovement.deleteMany({ where: { invoiceId: invoiceId } });
                        await prisma.vault.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "bank") {
                        await prisma.bankMovement.deleteMany({ where: { invoiceId: invoiceId } });
                        await prisma.bank.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "card") {
                        await prisma.posMovement.deleteMany({ where: { invoiceId: invoiceId } });
                        await prisma.pos.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: payment.amount,
                                },
                            },
                        });
                    }
                }
                const oldInvoiceDetails = await prisma.invoiceDetail.findMany({ where: { invoiceId: invoiceId } });
                for (const detail of oldInvoiceDetails) {
                    const stockCard = await prisma.stockCard.findUnique({
                        where: { productCode: detail.productCode },
                    });

                    if (!stockCard) {
                        throw new Error(`StockCard with ID '${detail.productCode}' does not exist.`);
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
                                stockCardId: stockCard.id,
                                warehouseId: data.warehouseId,
                            },
                        },
                    });

                    const productCode = stockCard.productCode;
                    const quantity = detail.quantity;

                    // Stok miktarını güncelleme
                    if (stockCardWarehouse) {
                        await prisma.stockCardWarehouse.update({
                            where: { id: stockCardWarehouse.id },
                            data: {
                                quantity: stockCardWarehouse.quantity.minus(quantity),
                            },
                        });
                    } else {
                        console.error("Ürün'ün stoğu bulunamadı.");
                    }
                }
                await prisma.invoiceDetail.deleteMany({ where: { invoiceId: invoiceId } });
                await prisma.invoice.delete({ where: { id: invoiceId } })
            });
        } catch (error) {
            logger.error("Error deleting purchase invoice with relations:", error);
            throw error;
        }
    }

    async cancelPurchaseInvoiceWithRelations(datas: InvoiceInfo[]): Promise<any> {
        try {

            for (const data of datas) {
                if (!data.invoiceNo || data.invoiceNo.trim() === "") {
                    throw new Error("InvoiceNo is required and cannot be empty.");
                }
                const result = await prisma.$transaction(async (prisma) => {
                    const invoiceId = data.id
                    const invoiceDetail = await this.getInvoiceInfoById(data.id)
                    const _companyCode = await prisma.company.findFirst({
                        select: { companyCode: true },
                    });
                    if (!invoiceDetail) {
                        throw new Error("Invoice not found");
                    } else {
                        for (const payment of invoiceDetail.payments) {
                            if (payment.method == "cash") {
                                await prisma.vaultMovement.deleteMany({ where: { invoiceId: invoiceId } });
                                await prisma.vault.update({
                                    where: { id: payment.accountId },
                                    data: {
                                        balance: {
                                            increment: payment.amount,
                                        },
                                    },
                                });
                            } else if (payment.method == "bank") {
                                await prisma.bankMovement.deleteMany({ where: { invoiceId: invoiceId } });
                                await prisma.bank.update({
                                    where: { id: payment.accountId },
                                    data: {
                                        balance: {
                                            increment: payment.amount,
                                        },
                                    },
                                });
                            } else if (payment.method == "card") {
                                await prisma.posMovement.deleteMany({ where: { invoiceId: invoiceId } });
                                await prisma.pos.update({
                                    where: { id: payment.accountId },
                                    data: {
                                        balance: {
                                            increment: payment.amount,
                                        },
                                    },
                                });
                            }
                        }
                    }
                    await prisma.currentMovement.deleteMany({ where: { documentNo: data.invoiceNo } });
                    await prisma.stockMovement.deleteMany({ where: { documentNo: data.invoiceNo } });
                    const oldInvoiceDetails = await prisma.invoiceDetail.findMany({ where: { invoiceId: invoiceId } });
                    for (const detail of oldInvoiceDetails) {
                        const stockCard = await prisma.stockCard.findUnique({
                            where: { productCode: detail.productCode },
                        });

                        if (!stockCard) {
                            throw new Error(`StockCard with ID '${detail.productCode}' does not exist.`);
                        }

                        const warehouse = await prisma.warehouse.findUnique({
                            where: { warehouseCode: data.warehouseCode },
                        });

                        if (!warehouse) {
                            throw new Error(`Warehouse with ID '${data.warehouseId}' does not exist.`);
                        }

                        const stockCardWarehouse = await prisma.stockCardWarehouse.findUnique({
                            where: {
                                stockCardId_warehouseId: {
                                    stockCardId: stockCard.id,
                                    warehouseId: invoiceDetail.warehouseId,
                                },
                            },
                        });

                        const productCode = stockCard.productCode;
                        const quantity = detail.quantity;

                        // Stok miktarını güncelleme
                        if (stockCardWarehouse) {
                            await prisma.stockCardWarehouse.update({
                                where: { id: stockCardWarehouse.id },
                                data: {
                                    quantity: stockCardWarehouse.quantity.minus(quantity),
                                },
                            });
                        } else {
                            console.error("Ürün'ün stoğu bulunamadı.");
                        }
                    }
                    await prisma.invoiceDetail.deleteMany({ where: { invoiceId: invoiceId } });
                    await prisma.invoice.update({
                        where: { id: invoiceId },
                        data: {
                            invoiceNo: data.invoiceNo,
                            gibInvoiceNo: data.gibInvoiceNo,
                            invoiceDate: data.invoiceDate,
                            invoiceType: "Cancel",
                            documentType: "Invoice",
                            current: { connect: { currentCode: data.currentCode } },
                            company: _companyCode?.companyCode ? { connect: { companyCode: _companyCode.companyCode } } : undefined,
                            branch: data.branchCode ? { connect: { branchCode: data.branchCode } } : undefined,
                            warehouse: data.warehouseCode ? { connect: { warehouseCode: data.warehouseCode } } : undefined,
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
                });
                return result;
            }
        } catch (error) {
            logger.error("Error deleting purchase invoice with relations:", error);
            throw error;
        }
    }

    async cancelSalesInvoiceWithRelations(datas: InvoiceInfo[]): Promise<any> {
        try {
            for (const data of datas) {
                if (!data.invoiceNo || data.invoiceNo.trim() === "") {
                    throw new Error("InvoiceNo is required and cannot be empty.");
                }
                const result = await prisma.$transaction(async (prisma) => {
                    const invoiceId = data.id
                    const invoiceDetail = await this.getInvoiceInfoById(data.id)
                    const _companyCode = await prisma.company.findFirst({
                        select: { companyCode: true },
                    });
                    if (!invoiceDetail) {
                        throw new Error("Invoice not found");
                    } else {
                        for (const payment of invoiceDetail.payments) {
                            if (payment.method == "cash") {
                                await prisma.vaultMovement.deleteMany({ where: { invoiceId: invoiceId } });
                                await prisma.vault.update({
                                    where: { id: payment.accountId },
                                    data: {
                                        balance: {
                                            decrement: payment.amount,
                                        },
                                    },
                                });
                            } else if (payment.method == "bank") {
                                await prisma.bankMovement.deleteMany({ where: { invoiceId: invoiceId } });
                                await prisma.bank.update({
                                    where: { id: payment.accountId },
                                    data: {
                                        balance: {
                                            decrement: payment.amount,
                                        },
                                    },
                                });
                            } else if (payment.method == "card") {
                                await prisma.posMovement.deleteMany({ where: { invoiceId: invoiceId } });
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
                    }
                    await prisma.currentMovement.deleteMany({ where: { documentNo: data.invoiceNo } });
                    await prisma.stockMovement.deleteMany({ where: { documentNo: data.invoiceNo } });
                    const oldInvoiceDetails = await prisma.invoiceDetail.findMany({ where: { invoiceId: invoiceId } });
                    for (const detail of oldInvoiceDetails) {
                        const stockCard = await prisma.stockCard.findUnique({
                            where: { productCode: detail.productCode },
                        });

                        if (!stockCard) {
                            throw new Error(`StockCard with ID '${detail.productCode}' does not exist.`);
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
                                    stockCardId: stockCard.id,
                                    warehouseId: invoiceDetail.warehouseId,
                                },
                            },
                        });

                        const productCode = stockCard.productCode;
                        const quantity = detail.quantity;

                        // Stok miktarını güncelleme
                        if (stockCardWarehouse) {
                            await prisma.stockCardWarehouse.update({
                                where: { id: stockCardWarehouse.id },
                                data: {
                                    quantity: stockCardWarehouse.quantity.plus(quantity),
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
                    }
                    await prisma.invoice.update({
                        where: { id: invoiceId },
                        data: {
                            invoiceNo: data.invoiceNo,
                            gibInvoiceNo: data.gibInvoiceNo,
                            invoiceDate: data.invoiceDate,
                            invoiceType: "Cancel",
                            documentType: "Invoice",
                            current: { connect: { currentCode: data.currentCode } },
                            company: _companyCode?.companyCode ? { connect: { companyCode: _companyCode.companyCode } } : undefined,
                            branch: data.branchCode ? { connect: { branchCode: data.branchCode } } : undefined,
                            warehouse: data.warehouseCode ? { connect: { warehouseCode: data.warehouseCode } } : undefined,
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
                });
                return result;
            }
        } catch (error) {
            logger.error("Error deleting invoice with relations:", error);
            throw new Error("Failed to delete invoice and its related records.");
        }
    }

    async deleteQuickSaleInvoiceWithRelationsAndRecreate(invoiceId: string, data: QuickSaleResponse): Promise<any> {
        if (!data.id || !data.branchCode || !data.warehouseId || !data.customer.code) {
            throw new Error("Required fields are missing");
        }

        try {
            const result = await prisma.$transaction(async (prisma) => {
                await prisma.currentMovement.deleteMany({ where: { documentNo: data.id } });
                await prisma.stockMovement.deleteMany({ where: { documentNo: data.id } });
                for (const payment of data.payments) {
                    if (!payment.accountId || !payment.amount) continue;

                    if (payment.method == "cash") {
                        await prisma.vaultMovement.deleteMany({ where: { invoiceId: invoiceId } });
                        await prisma.vault.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    decrement: new Prisma.Decimal(payment.amount),
                                },
                            },
                        });
                    } else if (payment.method == "bank") {
                        await prisma.bankMovement.deleteMany({ where: { invoiceId: invoiceId } });
                        await prisma.bank.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    decrement: new Prisma.Decimal(payment.amount),
                                },
                            },
                        });
                    } else if (payment.method == "card") {
                        await prisma.posMovement.deleteMany({ where: { invoiceId: invoiceId } });
                        await prisma.pos.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    decrement: new Prisma.Decimal(payment.amount),
                                },
                            },
                        });
                    }
                }
                const oldInvoiceDetails = await prisma.invoiceDetail.findMany({ where: { invoiceId: invoiceId } });
                for (const detail of oldInvoiceDetails) {
                    if (!detail.quantity) continue;

                    const stockCard = await prisma.stockCard.findUnique({
                        where: { productCode: detail.productCode },
                    });

                    if (!stockCard) {
                        throw new Error(`StockCard with ID '${detail.productCode}' does not exist.`);
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
                                stockCardId: stockCard.id,
                                warehouseId: data.warehouseId,
                            },
                        },
                    });

                    const productCode = stockCard.productCode;
                    const quantity = detail.quantity;

                    // Stok miktarını güncelleme
                    if (stockCardWarehouse) {
                        await prisma.stockCardWarehouse.update({
                            where: { id: stockCardWarehouse.id },
                            data: {
                                quantity: stockCardWarehouse.quantity.plus(new Prisma.Decimal(quantity)),
                            },
                        });
                    } else {
                        await prisma.stockCardWarehouse.create({
                            data: {
                                stockCardId: stockCard.id,
                                warehouseId: warehouse.id,
                                quantity: new Prisma.Decimal(quantity),
                            },
                        });
                    }
                }
                await prisma.invoiceDetail.deleteMany({ where: { invoiceId: invoiceId } });

                const _invoiceNo = await this.handleSerialToggle(true);
                // 1. Ana fatura oluşturuluyor
                await prisma.invoice.update({
                    where: { id: invoiceId },
                    data: {
                        invoiceNo: _invoiceNo ?? data.id,
                        invoiceDate: new Date(data.date),
                        branch: { connect: { branchCode: data.branchCode } },
                        warehouse: { connect: { id: data.warehouseId } },
                        invoiceType: "Sales",
                        documentType: "Order",
                        current: { connect: { currentCode: data.customer.code } },
                        totalAmount: new Prisma.Decimal(data.total),
                        totalVat: new Prisma.Decimal(data.totalVat),
                        totalDiscount: new Prisma.Decimal(0),
                        totalNet: new Prisma.Decimal(data.subtotal),
                        totalPaid: new Prisma.Decimal(data.payments.reduce((sum, p) => sum + (p.amount || 0), 0)),
                        totalDebt: new Prisma.Decimal(data.payments.filter(p => p.method === "openAccount").reduce((sum, p) => sum + (p.amount || 0), 0)),
                        description: `${_invoiceNo} no'lu hızlı satış faturası`,
                    },
                });

                // 2. İlgili fatura detaylarını ve stok işlemlerini ekleme
                // Fatura detaylarını ekleme
                for (const detail of data.items) {
                    if (!detail.productId || !detail.quantity || !detail.unitPrice || !detail.vatRate || !detail.totalAmount || !detail.vatAmount) continue;

                    const _productCode = await prisma.stockCard.findUnique({
                        where: { id: detail.productId },
                        select: { productCode: true },
                    });

                    if (!_productCode?.productCode) continue;

                    await prisma.invoiceDetail.create({
                        data: {
                            quantity: new Prisma.Decimal(detail.quantity),
                            unitPrice: new Prisma.Decimal(detail.unitPrice),
                            vatRate: new Prisma.Decimal(detail.vatRate),
                            netPrice: new Prisma.Decimal(detail.totalAmount - detail.vatAmount),
                            totalPrice: new Prisma.Decimal(detail.totalAmount),
                            discount: new Prisma.Decimal(0),
                            invoice: { connect: { id: invoiceId } },
                            stockCard: { connect: { productCode: _productCode.productCode } },
                        },
                    });
                }

                // Satış işlemleri
                for (const detail of data.items) {
                    if (!detail.productId || !detail.quantity || !detail.unitPrice || !detail.totalAmount) continue;

                    const stockCard = await prisma.stockCard.findUnique({
                        where: { id: detail.productId },
                    });

                    if (!stockCard) {
                        throw new Error(`StockCard with ID '${detail.productId}' does not exist.`);
                    }

                    const stockCardWarehouse = await prisma.stockCardWarehouse.findUnique({
                        where: {
                            stockCardId_warehouseId: {
                                stockCardId: detail.productId,
                                warehouseId: data.warehouseId,
                            },
                        },
                    });

                    const _productCode = stockCard.productCode;
                    const quantity = detail.quantity;

                    // Stok miktarını güncelleme
                    if (stockCardWarehouse) {
                        await prisma.stockCardWarehouse.update({
                            where: { id: stockCardWarehouse.id },
                            data: {
                                quantity: stockCardWarehouse.quantity.minus(new Prisma.Decimal(quantity)),
                            },
                        });
                    } else {
                        console.error("Ürün'ün stoğu bulunamadı. Stoğu olmayan ürünün satışı yapılamaz.");
                    }

                    // Ensure warehouseCode exists before creating stockMovement
                    const warehouseExists = await prisma.warehouse.findUnique({
                        where: { id: data.warehouseId },
                    });

                    if (!warehouseExists) {
                        throw new Error(`Warehouse with code ${data.warehouseId} does not exist.`);
                    }

                    // StockMovement oluşturma
                    await prisma.stockMovement.create({
                        data: {
                            productCode: _productCode,
                            warehouseCode: warehouseExists.warehouseCode,
                            branchCode: data.branchCode,
                            currentCode: data.customer.code,
                            documentType: "Order",
                            invoiceType: "Sales",
                            movementType: "HizliSatis",
                            documentNo: _invoiceNo ?? data.id,
                            gcCode: "Cikis",
                            description: `${_invoiceNo} no'lu hızlı satış için stok hareketi`,
                            quantity: new Prisma.Decimal(quantity),
                            unitPrice: new Prisma.Decimal(detail.unitPrice),
                            totalPrice: new Prisma.Decimal(detail.totalAmount),
                            unitOfMeasure: stockCard.unit,
                        },
                    });
                }

                for (const payment of data.payments) {
                    if (!payment.accountId || !payment.amount) continue;

                    if (payment.method == "cash") {
                        await prisma.vaultMovement.create({
                            data: {
                                invoiceId: invoiceId,
                                vaultId: payment.accountId,
                                description: `${_invoiceNo} no'lu hızlı satış için kasa hareketi`,
                                entering: new Prisma.Decimal(payment.amount),
                                emerging: new Prisma.Decimal(0),
                                vaultDirection: "Introduction",
                                vaultType: "SalesInvoicePayment",
                                vaultDocumentType: "General",
                            },
                        });
                        await prisma.vault.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: new Prisma.Decimal(payment.amount),
                                },
                            },
                        });
                    } else if (payment.method == "bank") {
                        await prisma.bankMovement.create({
                            data: {
                                invoiceId: invoiceId,
                                bankId: payment.accountId,
                                description: `${_invoiceNo} no'lu hızlı satış için banka hareketi`,
                                entering: new Prisma.Decimal(payment.amount),
                                emerging: new Prisma.Decimal(0),
                                bankDirection: "Introduction",
                                bankType: "SalesInvoicePayment",
                                bankDocumentType: "General",
                            },
                        });
                        await prisma.bank.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: new Prisma.Decimal(payment.amount),
                                },
                            },
                        });
                    } else if (payment.method == "card") {
                        await prisma.posMovement.create({
                            data: {
                                invoiceId: invoiceId,
                                posId: payment.accountId,
                                description: `${_invoiceNo} no'lu hızlı satış için pos hareketi`,
                                entering: new Prisma.Decimal(payment.amount),
                                emerging: new Prisma.Decimal(0),
                                posDirection: "Introduction",
                                posType: "SalesInvoicePayment",
                                posDocumentType: "General",
                            },
                        });
                        await prisma.pos.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    increment: new Prisma.Decimal(payment.amount),
                                },
                            },
                        });
                    }
                }

                const _companyCode = await prisma.company.findFirst({
                    select: { companyCode: true },
                });

                // data.paymensts içindeki tüm amount'ları topla
                const totalAmount = data.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
                // data.paymensts içinden methodu openAccount olmayanları al ve amount'larını topla
                const totalPaid = data.payments.filter((p) => p.method !== "openAccount").reduce((sum, p) => sum + (p.amount || 0), 0);

                await prisma.currentMovement.create({
                    data: {
                        currentCode: data.customer.code,
                        dueDate: new Date(),
                        description: `${_invoiceNo} no'lu satış faturası için cari hareket`,
                        debtAmount: new Prisma.Decimal(totalAmount),
                        creditAmount: new Prisma.Decimal(0),
                        movementType: "Borc",
                        documentType: "Fatura",
                        paymentType: "ÇokluÖdeme",
                        documentNo: _invoiceNo ?? data.id,
                        companyCode: _companyCode?.companyCode || "",
                        branchCode: data.branchCode,
                    },
                });

                if (totalPaid > 0) {
                    await prisma.currentMovement.create({
                        data: {
                            currentCode: data.customer.code,
                            dueDate: new Date(),
                            description: `${_invoiceNo} no'lu satış faturası için cari hareket`,
                            debtAmount: new Prisma.Decimal(0),
                            creditAmount: new Prisma.Decimal(totalPaid),
                            movementType: "Alacak",
                            documentType: "Fatura",
                            paymentType: "ÇokluÖdeme",
                            documentNo: _invoiceNo ?? data.id,
                            companyCode: _companyCode?.companyCode || "",
                            branchCode: data.branchCode,
                        },
                    });
                }
            });
            return result;
        } catch (error) {
            logger.error("Error deleting and recreating quick sale invoice with relations:", error);
            throw error;
        }
    }

    async deleteQuickSaleInvoiceWithRelations(invoiceId: string, data: QuickSaleResponse): Promise<any> {
        try {
            const result = await prisma.$transaction(async (prisma) => {
                await prisma.currentMovement.deleteMany({ where: { documentNo: data.id } });
                await prisma.stockMovement.deleteMany({ where: { documentNo: data.id } });
                for (const payment of data.payments) {
                    if (payment.method == "cash") {
                        await prisma.vaultMovement.deleteMany({ where: { invoiceId: invoiceId } });
                        await prisma.vault.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    decrement: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "bank") {
                        await prisma.bankMovement.deleteMany({ where: { invoiceId: invoiceId } });
                        await prisma.bank.update({
                            where: { id: payment.accountId },
                            data: {
                                balance: {
                                    decrement: payment.amount,
                                },
                            },
                        });
                    } else if (payment.method == "card") {
                        await prisma.posMovement.deleteMany({ where: { invoiceId: invoiceId } });
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
                const oldInvoiceDetails = await prisma.invoiceDetail.findMany({ where: { invoiceId: invoiceId } });
                for (const detail of oldInvoiceDetails) {
                    const stockCard = await prisma.stockCard.findUnique({
                        where: { productCode: detail.productCode },
                    });

                    if (!stockCard) {
                        throw new Error(`StockCard with ID '${detail.productCode}' does not exist.`);
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
                                stockCardId: stockCard.id,
                                warehouseId: data.warehouseId,
                            },
                        },
                    });

                    const productCode = stockCard.productCode;
                    const quantity = detail.quantity;

                    // Stok miktarını güncelleme
                    if (stockCardWarehouse) {
                        await prisma.stockCardWarehouse.update({
                            where: { id: stockCardWarehouse.id },
                            data: {
                                quantity: stockCardWarehouse.quantity.plus(quantity),
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
                }
                await prisma.invoiceDetail.deleteMany({ where: { invoiceId: invoiceId } });
                await prisma.invoice.delete({ where: { id: invoiceId } });
            });
            return result;
        } catch (error) {
            logger.error("Error deleting quick sale invoice with relations:", error);
            throw error;
        }
    }
}

export default InvoiceService;