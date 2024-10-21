
import InvoiceService from '../../services/concrete/invoiceService';
import { Context } from 'elysia';
import { Invoice, InvoiceDetail } from '@prisma/client';

const invoiceService = new InvoiceService();

const InvoiceController = {
    // API to create an invoice
    createInvoice: async (ctx: Context) => { 
        const invoiceData = ctx.body as Invoice;
        try {
            const invoice = await invoiceService.createInvoice(invoiceData);
            ctx.set.status = 200;
            return invoice;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating invoice", details: error.message };
        }
    },

    // API to update an invoice
    updateInvoice: async (ctx: Context) => {
        const { id } = ctx.params;
        const invoiceData: Partial<InvoiceDetail> = ctx.body as Partial<Invoice>;
        try {
            const invoice = await invoiceService.updateInvoice(id, invoiceData);
            ctx.set.status = 200;
            return invoice;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating invoice", details: error.message };
        }
    },

    // API to delete an invoice
    deleteInvoice: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const invoice = await invoiceService.deleteInvoice(id);
            ctx.set.status = 200;
            return invoice;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting invoice", details: error.message };
        }
    },

    // API to get all invoices
    getAllInvoices: async (ctx: Context) => {
        try {
            const invoices = await invoiceService.getAllInvoices();
            ctx.set.status = 200;
            return invoices;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error getting all invoices", details: error.message };
        }
    },

    // API to get an invoice by ID
    getInvoiceById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const invoice = await invoiceService.getInvoiceById(id);
            if (!invoice) {
                return ctx.error(404, 'Invoice not found');
            }
            ctx.set.status = 200;
            return invoice;
        } catch (error : any) {
            ctx.set.status = 500;
            return { error: "Error getting invoice", details: error.message };
        }
    },

    // API to create an invoice with relations
    createInvoiceWithRelations: async (ctx: Context) => {
        const data = ctx.body as { invoice: Invoice, invoiceDetails: InvoiceDetail[] };
        const invoiceData = data.invoice as Invoice;
        const invoiceDetails = data.invoiceDetails as InvoiceDetail[];
        try {
            const invoice = await invoiceService.createInvoiceWithRelations(invoiceData, invoiceDetails);
            ctx.set.status = 200;
            return invoice;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating invoice with relations", details: error.message };
        }
    },

    // API to update an invoice with relations
    updateInvoiceWithRelations: async (ctx: Context) => {
        const { id } = ctx.params;
        const data = ctx.body as { invoice: Partial<Invoice>, invoiceDetails: InvoiceDetail[] };
        const invoiceData = data.invoice as Partial<Invoice>;
        const invoiceDetails = data.invoiceDetails as InvoiceDetail[];
        try {
            const invoice = await invoiceService.updateInvoiceWithRelations(id, invoiceData, invoiceDetails);
            ctx.set.status = 200;
            return invoice;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating invoice with relations", details: error.message };
        }
    },

    // API to delete an invoice with relations
    deleteInvoiceWithRelations: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const invoice = await invoiceService.deleteInvoiceWithRelations(id);
            ctx.set.status = 200;
            return invoice;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting invoice with relations", details: error.message };
        }
    },

    // API to get all invoices with relations
    getAllInvoicesWithRelations: async (ctx: Context) => {
        try {
            const invoices = await invoiceService.getAllInvoicesWithRelations();
            ctx.set.status = 200;
            return invoices;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error getting all invoices with relations", details: error.message };
        }
    },  

    getInvoiceWithRelationsById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const invoices = await invoiceService.getInvoiceWithRelationsById(id);
            ctx.set.status = 200;
            return invoices;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error getting all invoices with relations by ID", details: error.message };
        }
    }

};

export default InvoiceController;