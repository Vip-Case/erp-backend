
import { Invoice, InvoiceDetail, Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import logger from "../../utils/logger";
import { BaseRepository } from "../../repositories/baseRepository";

export const InvoiceRelations = {
    InvoiceDetail: true
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
                    Current: invoice.currentCode ? {
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
                    Current: invoice.currentCode ? {
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

    async createInvoiceWithRelations(invoice: Invoice, invoiceDetails: InvoiceDetail[]): Promise<Invoice> {
        try {
            const newInvoice = await this.invoiceRepository.create(invoice);
            for (const invoiceDetail of invoiceDetails) {
                invoiceDetail.invoiceId = newInvoice.id;
                await this.invoiceDetailRepository.create(invoiceDetail);
            }
            return newInvoice;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async updateInvoiceWithRelations(id: string, invoice: Partial<Invoice>, invoiceDetails: InvoiceDetail[]): Promise<Invoice> {
        try {
            await this.invoiceDetailRepository.deleteWithFilters({ invoiceId: id });
            for (const invoiceDetail of invoiceDetails) {
                invoiceDetail.invoiceId = id;
                await this.invoiceDetailRepository.create(invoiceDetail);
            }
            return this.invoiceRepository.update(id, invoice);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async deleteInvoiceWithRelations(id: string): Promise<boolean> {
        try {
            await this.invoiceDetailRepository.deleteWithFilters({ invoiceId: id });
            return this.invoiceRepository.delete(id);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async getAllInvoicesWithRelations(): Promise<any[]> {
        return await prisma.invoice.findMany({
            include: {
                invoiceDetail: true
            }
        });
    }

    async getInvoiceWithRelationsById(id: string): Promise<Invoice | null> {
        return this.invoiceRepository.findByIdWithOptions(id, {
            include: {
                InvoiceDetail: true
            }
        });
    }

}

export default InvoiceService;