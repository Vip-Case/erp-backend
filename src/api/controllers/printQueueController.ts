import { Context } from "elysia";
import { PrintQueueService } from "../../services/concrete/printQueueService";

type CreateBody = {
  productCode: string;
  quantity: number;
};

type UpdateStatusBody = {
  status: string;
  printedAt?: Date;
  printedBy?: string;
  printerName?: string;
  errorMessage?: string;
  retryCount?: number;
};

type MarkAsPrintedBody = {
  ids: string[];
  printedBy: string;
  printerName: string;
};

type DeleteManyBody = {
  ids: string[];
};

export default class PrintQueueController {
  private static printQueueService = new PrintQueueService();

  static create = async (ctx: Context & { body: CreateBody }) => {
    try {
      const result = await PrintQueueController.printQueueService.create(
        ctx.body
      );
      return {
        status: 201,
        body: {
          message: "Print queue created successfully",
          data: result,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { message: error.message },
      };
    }
  };

  static createMany = async (ctx: Context & { body: CreateBody[] }) => {
    try {
      const result = await PrintQueueController.printQueueService.createMany(
        ctx.body
      );
      return {
        status: 201,
        body: {
          message: `${result.count} print queue items created successfully`,
          data: result,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { message: error.message },
      };
    }
  };

  static findAll = async (_: Context) => {
    try {
      const result = await PrintQueueController.printQueueService.findAll();
      return {
        status: 200,
        body: {
          data: result,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { message: error.message },
      };
    }
  };

  static findPending = async (_: Context) => {
    try {
      const result = await PrintQueueController.printQueueService.findPending();
      return {
        status: 200,
        body: {
          data: result,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { message: error.message },
      };
    }
  };

  static findById = async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const result = await PrintQueueController.printQueueService.findById(id);
      if (!result) {
        return {
          status: 404,
          body: { message: "Print queue not found" },
        };
      }
      return {
        status: 200,
        body: {
          data: result,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { message: error.message },
      };
    }
  };

  static updateStatus = async (
    ctx: Context & { body: UpdateStatusBody; params: { id: string } }
  ) => {
    try {
      const { id } = ctx.params;
      const result = await PrintQueueController.printQueueService.updateStatus(
        id,
        ctx.body
      );
      return {
        status: 200,
        body: {
          message: "Print queue status updated successfully",
          data: result,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { message: error.message },
      };
    }
  };

  static markAsPrinted = async (ctx: Context & { body: MarkAsPrintedBody }) => {
    try {
      const { ids, printedBy, printerName } = ctx.body;
      const result = await PrintQueueController.printQueueService.markAsPrinted(
        ids,
        printedBy,
        printerName
      );
      return {
        status: 200,
        body: {
          message: `${result.count} items marked as printed`,
          data: result,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { message: error.message },
      };
    }
  };

  static delete = async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const result = await PrintQueueController.printQueueService.delete(id);
      return {
        status: 200,
        body: {
          message: "Print queue deleted successfully",
          data: result,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { message: error.message },
      };
    }
  };

  static deleteMany = async (ctx: Context & { body: DeleteManyBody }) => {
    try {
      const { ids } = ctx.body;
      const result = await PrintQueueController.printQueueService.deleteMany(
        ids
      );
      return {
        status: 200,
        body: {
          message: `${result.count} items deleted successfully`,
          data: result,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { message: error.message },
      };
    }
  };

  static getStatistics = async (_: Context) => {
    try {
      const result =
        await PrintQueueController.printQueueService.getStatistics();
      return {
        status: 200,
        body: {
          data: result,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { message: error.message },
      };
    }
  };

  static resetFailedPrints = async (_: Context) => {
    try {
      const result =
        await PrintQueueController.printQueueService.resetFailedPrints();
      return {
        status: 200,
        body: {
          message: `${result.count} failed prints reset successfully`,
          data: result,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { message: error.message },
      };
    }
  };
}
