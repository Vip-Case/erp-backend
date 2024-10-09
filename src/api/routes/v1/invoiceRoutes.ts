
import { Elysia } from 'elysia';
import InvoiceController from '../../controllers/invoiceController';

export const InvoiceRoutes = (app: Elysia) => {
    app.group("/invoices", (app) =>
        app.get("/", InvoiceController.getAllInvoices, { tags: ["Invoices"] })
            .post("/", InvoiceController.createInvoice, { tags: ["Invoices"] })
            .get("/:id", InvoiceController.getInvoiceById, { tags: ["Invoices"] })
            .put("/:id", InvoiceController.updateInvoice, { tags: ["Invoices"] })
            .delete("/:id", InvoiceController.deleteInvoice, { tags: ["Invoices"] })
            .post("/createInvoiceWithRelations", InvoiceController.createInvoiceWithRelations, { tags: ["Invoices"] })
            .put("/updateInvoiceWithRelations/:id", InvoiceController.updateInvoiceWithRelations, { tags: ["Invoices"] })
            .delete("/deleteInvoiceWithRelations/:id", InvoiceController.deleteInvoiceWithRelations, { tags: ["Invoices"] })
            .get("/invoicesWithRelations", InvoiceController.getAllInvoicesWithRelations, { tags: ["Invoices"] })
            .get("/invoicesWithRelations/:id", InvoiceController.getInvoiceWithRelationsById, { tags: ["Invoices"] })
    );
};