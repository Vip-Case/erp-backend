
import ReceiptService from '../../services/concrete/receiptService';
import { Context } from 'elysia';
import { Receipt, ReceiptDetail } from '@prisma/client';

// Service Initialization
const receiptService = new ReceiptService();

export const ReceiptController = {

    createReceipt: async (ctx: Context) => {
        const receiptData: Receipt = ctx.body as Receipt;
        const bearerToken = ctx.request.headers.get("Authorization");
        
        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }
        
        try {
            const receipt = await receiptService.createReceipt(receiptData, bearerToken);
            ctx.set.status = 200;
            return receipt;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating attribute", details: error.message };
        }
    },

    updateReceipt: async (ctx: Context) => {
        const { id } = ctx.params;
        const receiptData: Partial<Receipt> = ctx.body as Partial<Receipt>;
        const bearerToken = ctx.request.headers.get("Authorization");
        
        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }

        try {
            const attribute = await receiptService.updateReceipt(id, receiptData, bearerToken);
            ctx.set.status = 200;
            return attribute;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating receipt", details: error.message };
        }
    },

    deleteReceipt: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const receipt = await receiptService.deleteReceipt(id);
            ctx.set.status = 200;
            return receipt;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting receipt", details: error.message };
        }
    },

    getReceiptById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const receipt = await receiptService.getReceiptById(id);
            if (!receipt) {
                return ctx.error(404, 'Receipt not found');
            }
            ctx.set.status = 200;
            return receipt;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching Receipt", details: error.message };
        }
    },

    getAllReceipts: async (ctx: Context) => {
        try {
            const receipts = await receiptService.getAllReceipts();
            ctx.set.status = 200;
            return receipts;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching Receipts", details: error.message };
        }
    },

    // API to create an receipt with relations
    createReceiptWithRelations: async (ctx: Context) => {
        const data = ctx.body as { receipt: Receipt, receiptDetails: ReceiptDetail[] };
        const receiptData = data.receipt as Receipt;
        const receiptDetails = data.receiptDetails as ReceiptDetail[];
        try {
            const receipt = await receiptService.createReceiptWithRelations(receiptData, receiptDetails);
            ctx.set.status = 200;
            return receipt;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating receipt with relations", details: error.message };
        }
    },

    // API to update an receipt with relations
    updateReceiptWithRelations: async (ctx: Context) => {
        const { id } = ctx.params;
        const data = ctx.body as { receipt: Partial<Receipt>, receiptDetails: ReceiptDetail[] };
        const receiptData = data.receipt as Partial<Receipt>;
        const receiptDetails = data.receiptDetails as ReceiptDetail[];
        try {
            const receipt = await receiptService.updateReceiptWithRelations(id, receiptData, receiptDetails);
            ctx.set.status = 200;
            return receipt;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating receipt with relations", details: error.message };
        }
    },

    // API to delete an receipt with relations
    deleteReceiptWithRelations: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const receipt = await receiptService.deleteReceiptWithRelations(id);
            ctx.set.status = 200;
            return receipt;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting receipt with relations", details: error.message };
        }
    },

    // API to get all receipts with relations
    getAllReceiptsWithRelations: async (ctx: Context) => {
        try {
            const receipts = await receiptService.getAllReceiptsWithRelations();
            ctx.set.status = 200;
            return receipts;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error getting all receipts with relations", details: error.message };
        }
    },  

    getReceiptWithRelationsById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const receipts = await receiptService.getReceiptWithRelationsById(id);
            ctx.set.status = 200;
            return receipts;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error getting all receipts with relations by ID", details: error.message };
        }
    }

}

export default ReceiptController;