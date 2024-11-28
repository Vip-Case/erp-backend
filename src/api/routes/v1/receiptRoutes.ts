
import { Elysia } from 'elysia';
import ReceiptController from '../../controllers/receiptController';
import { ReceiptPlain } from '../../../../prisma/prismabox/Receipt';

export const ReceiptRoutes = (app: Elysia) => {
    app.group("/receipts", (app) =>
        app.get("/", ReceiptController.getAllReceipts, { tags: ["Receipts"] })
            .post("/", ReceiptController.createReceipt, { tags: ["Receipts"] })
            .get("/:id", ReceiptController.getReceiptById, { tags: ["Receipts"] })
            .put("/:id", ReceiptController.updateReceipt, { tags: ["Receipts"] })
            .delete("/:id", ReceiptController.deleteReceipt, { tags: ["Receipts"] })
            .post("/createReceiptWithRelations", ReceiptController.createReceiptWithRelations, { tags: ["Receipts"] })
            .put("/updateReceiptWithRelations/:id", ReceiptController.updateReceiptWithRelations, { tags: ["Receipts"] })
            .delete("/deleteReceiptWithRelations/:id", ReceiptController.deleteReceiptWithRelations, { tags: ["Receipts"] })
            .get("/ReceiptsWithRelations", ReceiptController.getAllReceiptsWithRelations, { tags: ["Receipts"] })
            .get("/ReceiptsWithRelations/:id", ReceiptController.getReceiptWithRelationsById, { tags: ["Receipts"] })
    );
  return app;
};

export default ReceiptRoutes;