import { Elysia } from "elysia";
import StockCardController from "../../controllers/stockCardController";

export const StockCardRoutes = (app: Elysia) => {
  app.group("/stockcards", (app) =>
    app
      .get("/createStockCard", StockCardController.getAllStockCards, {
        tags: ["Stock Cards"],
      }) //, body: StockCardPlainInputCreate, response: { body: StockCardPlain }
      .post("/create", StockCardController.createStockCard, {
        tags: ["Stock Cards"],
      }) //, response: { body: StockCardPlain }
      .post("/mobile/create", StockCardController.createStockCardFromMobile, {
        tags: ["Stock Cards"],
      })
      .get("/:id", StockCardController.getStockCardById, {
        tags: ["Stock Cards"],
      })
      .put("/:id", StockCardController.updateStockCard, {
        tags: ["Stock Cards"],
      })
      .delete("/:id", StockCardController.deleteStockCard, {
        tags: ["Stock Cards"],
      })
      .post("/", StockCardController.createStockCardsWithRelations, {
        tags: ["Stock Cards"],
      })
      .put("/critical-stock/:id", StockCardController.updateCriticalStock, {
        tags: ["Stock Cards"],
      })
      .put(
        "/updateStockCardsWithRelations/:id",
        StockCardController.updateStockCardsWithRelations,
        { tags: ["Stock Cards"] }
      )
      .delete(
        "/deleteStockCardsWithRelations/:id",
        StockCardController.deleteStockCardsWithRelations,
        { tags: ["Stock Cards"] }
      )
      .delete(
        "/deleteManyStockCardsWithRelations",
        StockCardController.deleteManyStockCardsWithRelations,
        { tags: ["Stock Cards"] }
      )
      .get(
        "/stockCardsWithRelations",
        StockCardController.getAllStockCardsWithRelations,
        { tags: ["Stock Cards"] }
      )
      .get(
        "/stockCardsWithRelations/:id",
        StockCardController.getStockCardsWithRelationsById,
        { tags: ["Stock Cards"] }
      )
      .get("/search", StockCardController.searchStockCards, {
        tags: ["Stock Cards"],
      })
      .get("/byWarehouse/:id", StockCardController.getStockCardsByWarehouseId, {
        tags: ["Stock Cards"],
      })
      .get(
        "/byWarehouse/search/:id",
        StockCardController.searchStockCardsByWarehouseId,
        { tags: ["Stock Cards"] }
      )
      .put("/updateBarcodes", StockCardController.updateStockCardBarcodes, {
        tags: ["Stock Cards"],
      })
      .post(
        "/searchBarcodes",
        StockCardController.getStockCardBarcodesBySearch,
        { tags: ["Stock Cards"] }
      )
      .post("/bulkUpdatePrices", StockCardController.bulkUpdatePrices, {
        tags: ["Stock Cards"],
      })
      .post("/balance-report", StockCardController.getStockBalanceReport, {
        tags: ["Stock Cards"],
      })
      .get("/turnover-report", StockCardController.getStockTurnoverReport, {
        tags: ["Stock Cards"],
        detail: {
          summary: "Stok Devir Raporu",
          description:
            "Stok kartlarının devir hızı ve hareket analizini içeren detaylı rapor",
          tags: ["Stock Cards", "Reports"],
        },
      })
      .get(
        "/analyze-critical-stock",
        StockCardController.analyzeCriticalStockLevels,
        {
          tags: ["Stock Cards"],
          detail: {
            summary: "Kritik Stok Seviyesi Analizi",
            description:
              "Stok devir raporuna göre kritik stok seviyelerini analiz eder ve günceller",
            tags: ["Stock Cards", "Reports"],
          },
        }
      )
  );
  return app;
};

export default StockCardRoutes;
