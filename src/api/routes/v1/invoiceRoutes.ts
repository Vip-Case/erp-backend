import { Elysia, t } from "elysia";
import InvoiceController from "../../controllers/invoiceController";

export const InvoiceRoutes = (app: Elysia) => {
  app.group("/invoices", (app) =>
    app
      .get("/", InvoiceController.getAllInvoices, {
        query: t.Object({
          page: t.Optional(t.String()),
          limit: t.Optional(t.String()),
          orderBy: t.Optional(t.String()),
          filter: t.Optional(t.String()),
        }),
        tags: ["Invoices"],
      })
      .get("/:id", InvoiceController.getInvoiceById, { tags: ["Invoices"] })
      .post("/purchase", InvoiceController.createPurchaseInvoiceWithRelations, {
        tags: ["Invoices"],
      })
      .put(
        "/purchase/:id",
        InvoiceController.deletePurchaseInvoiceWithRelationsAndRecreate,
        { tags: ["Invoices"] }
      )
      .delete(
        "/purchase/:id",
        InvoiceController.deletePurchaseInvoiceWithRelations,
        { tags: ["Invoices"] }
      )
      .post(
        "/purchase/cancel",
        InvoiceController.cancelPurchaseInvoiceWithRelations,
        { tags: ["Invoices"] }
      )
      .post("/sales", InvoiceController.createSalesInvoiceWithRelations, {
        tags: ["Invoices"],
      })
      .put(
        "/sales/:id",
        InvoiceController.deleteSalesInvoiceWithRelationsAndRecreate,
        { tags: ["Invoices"] }
      )
      .delete("/sales/:id", InvoiceController.deleteSalesInvoiceWithRelations, {
        tags: ["Invoices"],
      })
      .post(
        "/sales/cancel",
        InvoiceController.cancelSalesInvoiceWithRelations,
        { tags: ["Invoices"] }
      )
      .get(
        "/invoicesWithRelations",
        InvoiceController.getAllInvoicesWithRelations,
        { tags: ["Invoices"] }
      )
      .get(
        "/invoicesWithRelations/:id",
        InvoiceController.getInvoiceWithRelationsById,
        { tags: ["Invoices"] }
      )
      .get(
        "/getLastInvoiceNoByType/:type",
        InvoiceController.getLastInvoiceNoByType,
        { tags: ["Invoices"] }
      )
      .get("/getInvoiceInfoById/:id", InvoiceController.getInvoiceInfoById, {
        tags: ["Invoices"],
      })
      .post(
        "/createQuickSaleInvoiceWithRelations",
        InvoiceController.createQuickSaleInvoiceWithRelations,
        { tags: ["Invoices"] }
      )
      .put(
        "/updateQuickSaleInvoice/:id",
        InvoiceController.deleteQuickSaleInvoiceWithRelationsAndRecreate,
        { tags: ["Invoices"] }
      )
      .delete(
        "/deleteQuickSaleInvoice/:id",
        InvoiceController.deleteQuickSaleInvoiceWithRelations,
        { tags: ["Invoices"] }
      )
  );
  return app;
};

export default InvoiceRoutes;
