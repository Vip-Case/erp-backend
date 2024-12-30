
import { Elysia } from 'elysia';
import InvoiceController from '../../controllers/invoiceController';

export const InvoiceRoutes = (app: Elysia) => {
  app.group("/invoices", (app) =>
    app.get("/", InvoiceController.getAllInvoices, { tags: ["Invoices"] })
      .post("/", InvoiceController.createInvoice, { tags: ["Invoices"] })
      .get("/:id", InvoiceController.getInvoiceById, { tags: ["Invoices"] })
      .put("/:id", InvoiceController.updateInvoice, { tags: ["Invoices"] })
      .delete("/:id", InvoiceController.deleteInvoice, { tags: ["Invoices"] })
      .post("/purchase", InvoiceController.createPurchaseInvoiceWithRelations, { tags: ["Invoices"] })
      .put("/purchase/:id", InvoiceController.deletePurchaseInvoiceWithRelationsAndRecreate, { tags: ["Invoices"] })
      .delete("/purchase/:id", InvoiceController.deletePurchaseInvoiceWithRelations, { tags: ["Invoices"] })
      .post("/sales", InvoiceController.createSalesInvoiceWithRelations, { tags: ["Invoices"] })
      .put("/sales/:id", InvoiceController.deleteSalesInvoiceWithRelationsAndRecreate, { tags: ["Invoices"] })
      .delete("/sales/:id", InvoiceController.deleteSalesInvoiceWithRelations, { tags: ["Invoices"] })
      .put("/updateInvoiceWithRelations/:id", InvoiceController.updateInvoiceWithRelations, { tags: ["Invoices"] })
      .get("/invoicesWithRelations", InvoiceController.getAllInvoicesWithRelations, { tags: ["Invoices"] })
      .get("/invoicesWithRelations/:id", InvoiceController.getInvoiceWithRelationsById, { tags: ["Invoices"] })
      .get("/getLastInvoiceNoByType/:type", InvoiceController.getLastInvoiceNoByType, { tags: ["Invoices"] })
      .get("/getInvoiceInfoById/:id", InvoiceController.getInvoiceInfoById, { tags: ["Invoices"] })
      .post("/createQuickSaleInvoiceWithRelations", InvoiceController.createQuickSaleInvoiceWithRelations, { tags: ["Invoices"] })
  );
  return app;
};

export default InvoiceRoutes;
