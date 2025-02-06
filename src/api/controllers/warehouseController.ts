import WarehouseService, {
  StockTakeWarehouse,
  OrderWarehouseType,
} from "../../services/concrete/warehouseService";
import { Context } from "elysia";
import { Warehouse, ReceiptType } from "@prisma/client";

export interface OrderPrepareWarehouse {
  id: string;
  warehouseId: string;
  branchCode: string;
  currentId: string;
  products: Array<{
    stockCardId: string;
    quantity: number;
  }>;
}

// Service Initialization
const warehouseService = new WarehouseService();

export const WarehouseController = {
  createWarehouse: async (ctx: Context) => {
    const warehouseData: Warehouse = ctx.body as Warehouse;
    const bearerToken = ctx.request.headers.get("Authorization");

    if (!bearerToken) {
      return ctx.error(401, "Authorization header is missing.");
    }

    try {
      const warehouse = await warehouseService.createWarehouse(
        warehouseData,
        bearerToken
      );
      ctx.set.status = 200;
      return warehouse;
    } catch (error: any) {
      ctx.set.status = 500;
      return { error: "Error creating warehouse", details: error.message };
    }
  },

  updateWarehouse: async (ctx: Context) => {
    const { id } = ctx.params;
    const warehouseData: Partial<Warehouse> = ctx.body as Partial<Warehouse>;
    const bearerToken = ctx.request.headers.get("Authorization");

    if (!bearerToken) {
      return ctx.error(401, "Authorization header is missing.");
    }

    try {
      const warehouse = await warehouseService.updateWarehouse(
        id,
        warehouseData,
        bearerToken
      );
      ctx.set.status = 200;
      return warehouse;
    } catch (error: any) {
      ctx.set.status = 500;
      return { error: "Error updating warehouse", details: error.message };
    }
  },

  deleteWarehouse: async (ctx: Context) => {
    const { id } = ctx.params;
    try {
      const warehouse = await warehouseService.deleteWarehouse(id);
      ctx.set.status = 200;
      return warehouse;
    } catch (error: any) {
      ctx.set.status = 500;
      return { error: "Error deleting warehouse", details: error.message };
    }
  },

  getWarehouseById: async (ctx: Context) => {
    const { id } = ctx.params;
    try {
      const warehouse = await warehouseService.getWarehouseById(id);
      if (!warehouse) {
        return ctx.error(404, "Warehouse not found");
      }
      ctx.set.status = 200;
      return warehouse;
    } catch (error: any) {
      ctx.set.status = 500;
      return { error: "Error fetching warehouse", details: error.message };
    }
  },

  getAllWarehouses: async (ctx: Context) => {
    try {
      const warehouses = await warehouseService.getAllWarehouses();
      ctx.set.status = 200;
      return warehouses;
    } catch (error: any) {
      ctx.set.status = 500;
      return { error: "Error fetching warehouses", details: error.message };
    }
  },

  getWarehousesWithFilters: async (ctx: Context) => {
    const filters = ctx.query as Partial<Warehouse>;
    try {
      const warehouses = await warehouseService.getWarehousesWithFilters(
        filters
      );
      ctx.set.status = 200;
      return warehouses;
    } catch (error: any) {
      ctx.set.status = 500;
      return { error: "Error fetching warehouses", details: error.message };
    }
  },

  createStocktakeWarehouse: async (ctx: Context) => {
    const stockTakeData: StockTakeWarehouse = ctx.body as StockTakeWarehouse;
    const bearerToken = ctx.request.headers.get("Authorization");

    if (!bearerToken) {
      return ctx.error(401, "Authorization header is missing.");
    }

    try {
      const result = await warehouseService.createStocktakeWarehouse(
        stockTakeData,
        bearerToken
      );
      if (!result) {
        return ctx.error(400, "Stok sayım işlemi oluşturulamadı");
      }
      ctx.set.status = 201;
      return {
        success: true,
        data: result,
        message: "Stok sayım işlemi başarıyla oluşturuldu",
      };
    } catch (error: any) {
      ctx.set.status = error.status || 500;
      return {
        success: false,
        error: "Stok sayım işlemi oluşturulurken hata oluştu",
        details: error.message,
      };
    }
  },

  updateStocktakeWarehouse: async (ctx: Context) => {
    const { id } = ctx.params;
    const stockTakeData: StockTakeWarehouse = ctx.body as StockTakeWarehouse;
    try {
      const warehouse = await warehouseService.updateStocktakeWarehouse(
        id,
        stockTakeData
      );
      ctx.set.status = 200;
      return warehouse;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Error updating stocktake warehouse",
        details: error.message,
      };
    }
  },

  deleteStocktakeWarehouse: async (ctx: Context) => {
    const { id } = ctx.params;
    try {
      const warehouse = await warehouseService.deleteStocktakeWarehouse(id);
      ctx.set.status = 200;
      return warehouse;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Error deleting stocktake warehouse",
        details: error.message,
      };
    }
  },

  getStocktakeWarehouseById: async (ctx: Context) => {
    const { id } = ctx.params;
    try {
      const warehouse = await warehouseService.getStocktakeWarehouseById(id);
      if (!warehouse) {
        return ctx.error(404, "Stocktake warehouse not found");
      }
      ctx.set.status = 200;
      return warehouse;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Error fetching stocktake warehouse",
        details: error.message,
      };
    }
  },

  getAllStocktakeWarehouses: async (ctx: Context) => {
    try {
      const warehouses = await warehouseService.getStocktakeWarehouses();
      ctx.set.status = 200;
      return warehouses;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Error fetching stocktake warehouses",
        details: error.message,
      };
    }
  },

  createOrderWarehouse: async (ctx: Context) => {
    const orderData = ctx.body as OrderWarehouseType;
    const bearerToken = ctx.request.headers.get("Authorization");

    if (!bearerToken) {
      return ctx.error(401, "Authorization header is missing.");
    }

    try {
      const result = await warehouseService.createOrderWarehouse(
        orderData,
        bearerToken
      );
      if (!result) {
        return ctx.error(
          400,
          `Sipariş ${
            orderData.orderType === "prepare" ? "hazırlama" : "iade"
          } işlemi oluşturulamadı`
        );
      }
      ctx.set.status = 201;
      return {
        success: true,
        data: result,
        message: `Sipariş ${
          orderData.orderType === "prepare" ? "hazırlama" : "iade"
        } işlemi başarıyla oluşturuldu`,
      };
    } catch (error: any) {
      ctx.set.status = error.status || 500;
      return {
        success: false,
        error: `Sipariş ${
          orderData.orderType === "prepare" ? "hazırlama" : "iade"
        } işlemi oluşturulurken hata oluştu`,
        details: error.message,
      };
    }
  },

  getAllReceipts: async (ctx: Context) => {
    try {
      const {
        page,
        limit,
        startDate,
        endDate,
        createdAtFrom,
        receiptType,
        documentNo,
        currentCode,
        currentName,
      } = ctx.query;

      const filters = {
        ...(startDate && endDate
          ? {
              startDate: new Date(startDate as string),
              endDate: new Date(endDate as string),
            }
          : {}),
        ...(createdAtFrom
          ? { createdAtFrom: new Date(createdAtFrom as string) }
          : {}),
        ...(receiptType ? { receiptType: receiptType as ReceiptType } : {}),
        ...(documentNo ? { documentNo: documentNo as string } : {}),
        ...(currentCode ? { currentCode: currentCode as string } : {}),
        ...(currentName ? { currentName: currentName as string } : {}),
      };

      const pagination = {
        ...(page ? { page: parseInt(page as string) } : {}),
        ...(limit ? { limit: parseInt(limit as string) } : {}),
      };

      const receipts = await warehouseService.getAllReceipts(
        Object.keys(filters).length > 0 ? filters : undefined,
        Object.keys(pagination).length > 0 ? pagination : undefined
      );

      ctx.set.status = 200;
      return receipts;
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        error: "Fişler getirilirken hata oluştu",
        details: error.message,
      };
    }
  },

  getReceiptById: async (ctx: Context) => {
    const { id } = ctx.params;
    try {
      const receipt = await warehouseService.getReceiptById(id);
      if (!receipt) {
        return ctx.error(404, "Fiş bulunamadı");
      }
      ctx.set.status = 200;
      return receipt;
    } catch (error: any) {
      ctx.set.status = 500;
      return { error: "Fiş getirilirken hata oluştu", details: error.message };
    }
  },

  deleteOrderWarehouse: async (ctx: Context) => {
    const { id } = ctx.params;
    try {
      const result = await warehouseService.deleteOrderWarehouseByReceiptId(id);
      if (!result) {
        return ctx.error(404, "Sipariş kaydı bulunamadı");
      }
      ctx.set.status = 200;
      return {
        success: true,
        message: "Sipariş kaydı başarıyla silindi",
        data: result,
      };
    } catch (error: any) {
      ctx.set.status = error.message.includes("bulunamadı") ? 404 : 500;
      return {
        success: false,
        error: "Sipariş kaydı silinirken hata oluştu",
        details: error.message,
      };
    }
  },

  updateOrderWarehouse: async (ctx: Context) => {
    const { id } = ctx.params;
    const updateData = ctx.body as OrderWarehouseType;
    const bearerToken = ctx.request.headers.get("Authorization");

    if (!bearerToken) {
      return ctx.error(401, "Authorization header is missing.");
    }

    try {
      const result = await warehouseService.updateOrderWarehouseByReceiptId(
        id,
        updateData,
        bearerToken
      );
      if (!result) {
        return ctx.error(
          404,
          `Sipariş ${
            updateData.orderType === "prepare" ? "hazırlama" : "iade"
          } kaydı bulunamadı`
        );
      }
      ctx.set.status = 200;
      return {
        success: true,
        message: `Sipariş ${
          updateData.orderType === "prepare" ? "hazırlama" : "iade"
        } kaydı başarıyla güncellendi`,
        data: result,
      };
    } catch (error: any) {
      ctx.set.status = error.message.includes("bulunamadı") ? 404 : 500;
      return {
        success: false,
        error: `Sipariş ${
          updateData.orderType === "prepare" ? "hazırlama" : "iade"
        } kaydı güncellenirken hata oluştu`,
        details: error.message,
      };
    }
  },
};

export default WarehouseController;
