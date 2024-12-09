
import { Invoice, InvoiceDetail, Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import logger from "../../utils/logger";
import { BaseRepository } from "../../repositories/baseRepository";
import { time } from "console";

export const InvoiceRelations = {
    invoiceDetail: true
};

export interface InvoicePaymentDetail {
    paymentWayId: string;
    paymentAmount: number;
};

export class InvoiceService {
    private invoiceRepository = new BaseRepository<Invoice>(prisma.invoice);
    private invoiceDetailRepository = new BaseRepository<InvoiceDetail>(prisma.invoiceDetail);

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

    async createInvoiceWithRelations(
        invoice: Invoice,
        invoiceDetails: InvoiceDetail[],
        vaultId?: string
    ): Promise<any> {
        if (!invoice.invoiceNo || invoice.invoiceNo.trim() === "") {
            throw new Error("InvoiceNo is required and cannot be empty.");
        }

        try {
            const result = await prisma.$transaction(async (prisma) => {

                // 1. Ana fatura oluşturuluyor
                const newInvoice = await prisma.invoice.create({
                    data: {
                        invoiceNo: invoice.invoiceNo,
                        gibInvoiceNo: invoice.gibInvoiceNo,
                        invoiceDate: invoice.invoiceDate,
                        invoiceType: invoice.invoiceType,
                        documentType: invoice.documentType,
                        description: invoice.description,
                        current: invoice.currentCode ? { connect: { currentCode: invoice.currentCode } } : undefined,
                        company: invoice.companyCode ? { connect: { companyCode: invoice.companyCode } } : undefined,
                        branch: { connect: { branchCode: invoice.branchCode } },
                        warehouse: invoice.warehouseCode ? { connect: { warehouseCode: invoice.warehouseCode } } : undefined,
                        priceList: invoice.priceListId ? { connect: { id: invoice.priceListId } } : undefined,
                    },
                });
                // 2. İlgili fatura detaylarını ve stok işlemlerini ekleme
                // Fatura detaylarını ekleme
                await prisma.invoiceDetail.createMany({
                    data: invoiceDetails.map((detail) => ({
                        ...detail,
                        invoiceId: newInvoice.id,
                    })),
                });

                // Alış veya Satış işlemleri
                if (invoice.invoiceType === "Purchase" || invoice.invoiceType === "Sales") {
                    for (const detail of invoiceDetails) {
                        const { productCode, quantity } = detail;

                        // StockCard doğrulama
                        const stockCard = await prisma.stockCard.findUnique({
                            where: { productCode },
                        });

                        if (!stockCard) {
                            throw new Error(`StockCard with productCode '${productCode}' does not exist.`);
                        }

                        // StockCardWarehouse doğrulama veya oluşturma
                        const warehouse = await prisma.warehouse.findUnique({
                            where: { warehouseCode: invoice.warehouseCode },
                        });

                        if (!warehouse) {
                            throw new Error(`Warehouse with code '${invoice.warehouseCode}' does not exist.`);
                        }

                        const stockCardWarehouse = await prisma.stockCardWarehouse.findUnique({
                            where: {
                                stockCardId_warehouseId: {
                                    stockCardId: stockCard.id,
                                    warehouseId: warehouse.id,
                                },
                            },
                        });

                        // Stok miktarını güncelleme
                        if (invoice.invoiceType === "Purchase") {
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
                        } else if (invoice.invoiceType === "Sales") {
                            if (stockCardWarehouse) {
                                const newQuantity = stockCardWarehouse.quantity.minus(quantity);

                                if (newQuantity.isNegative() && !stockCard.allowNegativeStock) {
                                    throw new Error(
                                        `Insufficient stock for productCode '${productCode}' in warehouse '${invoice.warehouseCode}'.`
                                    );
                                }

                                await prisma.stockCardWarehouse.update({
                                    where: { id: stockCardWarehouse.id },
                                    data: {
                                        quantity: newQuantity,
                                    },
                                });
                            } else {
                                throw new Error(
                                    `StockCardWarehouse record not found for productCode '${productCode}' in warehouse '${invoice.warehouseCode}'.`
                                );
                            }
                        }

                        // StockMovement oluşturma
                        await prisma.stockMovement.create({
                            data: {
                                documentNo: newInvoice.invoiceNo,
                                productCode: detail.productCode,
                                gcCode: invoice.invoiceType === "Purchase" ? "Giris" : "Cikis",
                                warehouseCode: invoice.warehouseCode!,
                                branchCode: invoice.branchCode!,
                                movementType: invoice.invoiceType === "Purchase" ? "Devir" : "Devir",
                                quantity: detail.quantity,
                                unitPrice: detail.unitPrice,
                                totalPrice: detail.totalPrice,
                                description: `Stock movement for invoice ${newInvoice.invoiceNo}`,
                            },
                        });
                    }

                    // CurrentMovement oluşturma
                    if (invoice.currentCode) {
                        await prisma.currentMovement.create({
                            data: {
                                currentCode: invoice.currentCode,
                                documentNo: newInvoice.invoiceNo,
                                companyCode: invoice.companyCode!,
                                branchCode: invoice.branchCode!,
                                debtAmount:
                                    invoice.invoiceType === "Purchase"
                                        ? invoiceDetails.reduce((sum, d) => sum.plus(d.netPrice), new Prisma.Decimal(0))
                                        : new Prisma.Decimal(0),
                                creditAmount:
                                    invoice.invoiceType === "Sales"
                                        ? invoiceDetails.reduce((sum, d) => sum.plus(d.netPrice), new Prisma.Decimal(0))
                                        : new Prisma.Decimal(0),
                                movementType: invoice.invoiceType === "Purchase" ? "Borc" : "Alacak",
                                documentType: "Fatura",
                                description: `Current movement for invoice ${newInvoice.invoiceNo}`,
                            },
                        });
                    }

                    // VaultMovement oluşturma
                    if (vaultId) {
                        const vault = await prisma.vault.findUnique({ where: { id: vaultId } });

                        if (!vault) {
                            throw new Error(`Vault with ID '${vaultId}' does not exist.`);
                        }

                        await prisma.vaultMovement.create({
                            data: {
                                invoiceId: newInvoice.id,
                                vaultId: vaultId,
                                description: `Vault movement for invoice ${newInvoice.invoiceNo}`,
                                entering:
                                    invoice.invoiceType === "Purchase"
                                        ? invoiceDetails.reduce((sum, d) => sum.plus(d.netPrice), new Prisma.Decimal(0))
                                        : new Prisma.Decimal(0),
                                emerging:
                                    invoice.invoiceType === "Sales"
                                        ? invoiceDetails.reduce((sum, d) => sum.plus(d.netPrice), new Prisma.Decimal(0))
                                        : new Prisma.Decimal(0),
                                vaultDirection: invoice.invoiceType === "Purchase" ? "Introduction" : "Exit",
                                vaultType: invoice.invoiceType === "Purchase" ? "InputReceipt" : "ExitReceipt",
                                vaultDocumentType: "General",
                            },
                        });
                    }
                }
            }, { timeout: 30000 });

            return result;
        } catch (error) {
            logger.error("Error creating invoice with relations:", error);
            throw error;
        }
    }

    async updateInvoiceWithRelations(
        id: string,
        invoice: Partial<Invoice>,
        invoiceDetails: InvoiceDetail[],
        vaultId?: string
    ): Promise<Invoice> {
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

    async deleteInvoiceWithRelations(id: string): Promise<boolean> {
        try {
            // 1. Faturayı getir ve `invoiceNo` değerini al
            const existingInvoice = await prisma.invoice.findUnique({
                where: { id },
                select: { invoiceNo: true },
            });

            if (!existingInvoice || !existingInvoice.invoiceNo) {
                throw new Error(`Invoice with ID '${id}' does not exist or has no invoiceNo.`);
            }

            const invoiceNo = existingInvoice.invoiceNo;

            // 2. İlişkili verileri `invoiceNo` kullanarak sil
            await prisma.$transaction([
                prisma.invoiceDetail.deleteMany({ where: { invoiceId: id } }), // Invoice ID ile ilişkili
                prisma.currentMovement.deleteMany({ where: { documentNo: invoiceNo } }), // InvoiceNo ile ilişkili
                prisma.stockMovement.deleteMany({ where: { documentNo: invoiceNo } }), // InvoiceNo ile ilişkili
                prisma.vaultMovement.deleteMany({ where: { invoiceId: id } }), // Vault hareketleri ID ile ilişkili
            ]);

            // 3. Ana faturayı sil
            await prisma.invoice.delete({ where: { id } });

            console.log(`Invoice and all related records deleted successfully for invoiceNo: ${invoiceNo}`);
            return true;
        } catch (error) {
            logger.error("Error deleting invoice with relations:", error);
            throw new Error("Failed to delete invoice and its related records.");
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
}

export default InvoiceService;