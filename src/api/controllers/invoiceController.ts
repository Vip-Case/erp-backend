import InvoiceService, {
  QuickSaleResponse,
} from "../../services/concrete/invoiceService";
import { Context } from "elysia";
import { Invoice, InvoiceDetail } from "@prisma/client";
import { InvoiceInfo } from "../../services/concrete/invoiceService";

const invoiceService = new InvoiceService();

const InvoiceController = {
  // API to get all invoices
  getAllInvoices: async (ctx: Context) => {
    try {
      const { page, limit, orderBy, filter } = ctx.query;

      // Query parametrelerini dönüştürme
      const params = {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        orderBy: orderBy ? JSON.parse(orderBy as string) : undefined,
        filter: filter ? JSON.parse(filter as string) : undefined,
      };

      const invoices = await invoiceService.getAllInvoices(params);
      ctx.set.status = 200;
      return invoices;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Faturalar listelenirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  // API to get an invoice by ID
  getInvoiceById: async (ctx: Context) => {
    const { id } = ctx.params;
    try {
      const invoice = await invoiceService.getInvoiceById(id);
      if (!invoice) {
        return ctx.error(404, "Invoice not found");
      }
      ctx.set.status = 200;
      return invoice;
    } catch (error: any) {
      ctx.set.status = 500;
      return { error: "Error getting invoice", details: error.message };
    }
  },

  // API to create an purchase invoice with relations
  createPurchaseInvoiceWithRelations: async (ctx: Context) => {
    const data = ctx.body as InvoiceInfo;
    const bearerToken = ctx.request.headers.get("Authorization");

    if (!bearerToken) {
      return ctx.error(401, "Authorization header is missing.");
    }

    try {
      const invoice = await invoiceService.createPurchaseInvoiceWithRelations(
        data,
        bearerToken
      );
      ctx.set.status = 200;
      return invoice;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Error creating invoice with relations",
        details: error.message,
      };
    }
  },

  // API to create an sales invoice with relations
  createSalesInvoiceWithRelations: async (ctx: Context) => {
    const data = ctx.body as InvoiceInfo;
    const bearerToken = ctx.request.headers.get("Authorization");

    if (!bearerToken) {
      return ctx.error(401, "Authorization header is missing.");
    }

    try {
      const invoice = await invoiceService.createSalesInvoiceWithRelations(
        data,
        bearerToken
      );
      ctx.set.status = 200;
      return invoice;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Error creating invoice with relations",
        details: error.message,
      };
    }
  },

  // API to delete an sales invoice with relations and recreate
  deleteSalesInvoiceWithRelationsAndRecreate: async (ctx: Context) => {
    const { id } = ctx.params;
    const data = ctx.body as InvoiceInfo;
    const bearerToken = ctx.request.headers.get("Authorization");

    if (!bearerToken) {
      return ctx.error(401, "Authorization header is missing.");
    }

    try {
      const invoice =
        await invoiceService.deleteSalesInvoiceWithRelationsAndRecreate(
          id,
          data,
          bearerToken
        );
      ctx.set.status = 200;
      return invoice;
    } catch (error: any) {
      console.error("Satış faturası silme ve yeniden oluşturma hatası:", error);
      ctx.set.status = error.status || 500;
      return {
        error: "Fatura silme ve yeniden oluşturma işlemi başarısız",
        details: error.message,
      };
    }
  },

  // API to delete an purchase invoice with relations and recreate
  deletePurchaseInvoiceWithRelationsAndRecreate: async (ctx: Context) => {
    const { id } = ctx.params;
    const data = ctx.body as InvoiceInfo;
    const bearerToken = ctx.request.headers.get("Authorization");

    if (!bearerToken) {
      return ctx.error(401, "Authorization header is missing.");
    }

    try {
      const invoice =
        await invoiceService.deletePurchaseInvoiceWithRelationsAndRecreate(
          id,
          data,
          bearerToken
        );
      ctx.set.status = 200;
      return invoice;
    } catch (error: any) {
      console.error("Satış faturası silme ve yeniden oluşturma hatası:", error);
      ctx.set.status = error.status || 500;
      return {
        error: "Fatura silme ve yeniden oluşturma işlemi başarısız",
        details: error.message,
      };
    }
  },

  // API to delete an invoice with relations
  deleteSalesInvoiceWithRelations: async (ctx: Context) => {
    const { id } = ctx.params;
    const data = ctx.body as InvoiceInfo;
    try {
      const invoice = await invoiceService.deleteSalesInvoiceWithRelations(
        id,
        data
      );
      ctx.set.status = 200;
      return invoice;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Error deleting invoice with relations",
        details: error.message,
      };
    }
  },

  deletePurchaseInvoiceWithRelations: async (ctx: Context) => {
    const { id } = ctx.params;
    const data = ctx.body as InvoiceInfo;
    try {
      const invoice = await invoiceService.deletePurchaseInvoiceWithRelations(
        id,
        data
      );
      ctx.set.status = 200;
      return invoice;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Error deleting invoice with relations",
        details: error.message,
      };
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
      return {
        error: "Error getting all invoices with relations",
        details: error.message,
      };
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
      return {
        error: "Error getting all invoices with relations by ID",
        details: error.message,
      };
    }
  },

  getLastInvoiceNoByType: async (ctx: Context) => {
    const { type } = ctx.params;
    try {
      const invoiceNo = await invoiceService.getLastInvoiceNoByType(type);
      ctx.set.status = 200;
      return invoiceNo;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Error getting last invoice no by type",
        details: error.message,
      };
    }
  },

  getInvoiceInfoById: async (ctx: Context) => {
    const { id } = ctx.params;
    try {
      const invoiceInfo = await invoiceService.getInvoiceInfoById(id);
      ctx.set.status = 200;
      return invoiceInfo;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Error getting invoice info by ID",
        details: error.message,
      };
    }
  },

  createQuickSaleInvoiceWithRelations: async (ctx: Context) => {
    const data = ctx.body as any;
    const bearerToken = ctx.request.headers.get("Authorization");

    if (!bearerToken) {
      return ctx.error(401, "Authorization header is missing.");
    }

    try {
      const invoice = await invoiceService.createQuickSaleInvoiceWithRelations(
        data,
        bearerToken
      );
      ctx.set.status = 200;
      return invoice;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Hızlı satış oluşturulurken hata oluştu.",
        details: error.message,
      };
    }
  },

  cancelPurchaseInvoiceWithRelations: async (ctx: Context) => {
    const data = ctx.body as any[];

    try {
      const invoice = await invoiceService.cancelPurchaseInvoiceWithRelations(
        data
      );
      ctx.set.status = 200;
      return invoice;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Fatura İptal Edilirken Hata Oluştu.",
        details: error.message,
      };
    }
  },

  cancelSalesInvoiceWithRelations: async (ctx: Context) => {
    const data = ctx.body as any[];

    try {
      const invoice = await invoiceService.cancelSalesInvoiceWithRelations(
        data
      );
      ctx.set.status = 200;
      return invoice;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Fatura İptal Edilirken Hata Oluştu.",
        details: error.message,
      };
    }
  },

  deleteQuickSaleInvoiceWithRelationsAndRecreate: async (ctx: Context) => {
    const { id } = ctx.params;
    const data = ctx.body as QuickSaleResponse;
    const bearerToken = ctx.request.headers.get("Authorization");

    if (!bearerToken) {
      return ctx.error(401, "Authorization header is missing.");
    }

    try {
      const invoice =
        await invoiceService.deleteQuickSaleInvoiceWithRelationsAndRecreate(
          id,
          data,
          bearerToken
        );
      ctx.set.status = 200;
      return invoice;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Error deleting invoice with relations",
        details: error.message,
      };
    }
  },

  deleteQuickSaleInvoiceWithRelations: async (ctx: Context) => {
    const { id } = ctx.params;
    try {
      const invoice = await invoiceService.deleteQuickSaleInvoiceWithRelations(
        id
      );
      ctx.set.status = 200;
      return invoice;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Error deleting invoice with relations",
        details: error.message,
      };
    }
  },
};

export default InvoiceController;
