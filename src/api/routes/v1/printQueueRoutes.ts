import { Elysia, t } from "elysia";
import PrintQueueController from "../../controllers/printQueueController";

const PrintQueueRoutes = (app: Elysia) => {
  app.group("/print-queue", (app) =>
    app
      .post("/", PrintQueueController.create, {
        body: t.Object({
          productCode: t.String(),
          quantity: t.Number(),
        }),
        tags: ["Print Queue"],
      })
      .post("/bulk", PrintQueueController.createMany, {
        body: t.Array(
          t.Object({
            productCode: t.String(),
            quantity: t.Number(),
          })
        ),
        tags: ["Print Queue"],
      })
      .get("/", PrintQueueController.findAll, {
        tags: ["Print Queue"],
      })
      .get("/pending", PrintQueueController.findPending, {
        tags: ["Print Queue"],
      })
      .get("/statistics", PrintQueueController.getStatistics, {
        tags: ["Print Queue"],
      })
      .get("/:id", PrintQueueController.findById, {
        params: t.Object({
          id: t.String(),
        }),
        tags: ["Print Queue"],
      })
      .put("/:id/status", PrintQueueController.updateStatus, {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Object({
          status: t.String(),
          printedAt: t.Optional(t.String()),
          printedBy: t.Optional(t.String()),
          printerName: t.Optional(t.String()),
          errorMessage: t.Optional(t.String()),
          retryCount: t.Optional(t.Number()),
        }),
        tags: ["Print Queue"],
      })
      .post("/mark-as-printed", PrintQueueController.markAsPrinted, {
        body: t.Object({
          ids: t.Array(t.String()),
          printedBy: t.String(),
          printerName: t.String(),
        }),
        tags: ["Print Queue"],
      })
      .delete("/:id", PrintQueueController.delete, {
        params: t.Object({
          id: t.String(),
        }),
        tags: ["Print Queue"],
      })
      .delete("/bulk", PrintQueueController.deleteMany, {
        body: t.Object({
          ids: t.Array(t.String()),
        }),
        tags: ["Print Queue"],
      })
      .post("/reset-failed", PrintQueueController.resetFailedPrints, {
        tags: ["Print Queue"],
      })
  );
  return app;
};

export default PrintQueueRoutes;
