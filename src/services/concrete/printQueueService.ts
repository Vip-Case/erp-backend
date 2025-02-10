import { PrismaClient, PrintQueue } from "@prisma/client";
import { IPrintQueueService } from "../abstracts/IPrintQueueService";

export class PrintQueueService implements IPrintQueueService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: {
    productCode: string;
    quantity: number;
  }): Promise<PrintQueue> {
    return this.prisma.printQueue.create({
      data: {
        productCode: data.productCode,
        quantity: data.quantity,
        status: "PENDING",
      },
      include: {
        stockCard: true,
        printedByUser: true,
      },
    });
  }

  async createMany(
    data: { productCode: string; quantity: number }[]
  ): Promise<{ count: number }> {
    const createData = data.map((item) => ({
      productCode: item.productCode,
      quantity: item.quantity,
      status: "PENDING",
    }));

    return this.prisma.printQueue.createMany({
      data: createData,
    });
  }

  async findAll(): Promise<PrintQueue[]> {
    return this.prisma.printQueue.findMany({
      include: {
        stockCard: true,
        printedByUser: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findPending(): Promise<
    Pick<PrintQueue, "id" | "productCode" | "quantity">[]
  > {
    return this.prisma.printQueue.findMany({
      where: {
        status: "PENDING",
      },
      select: {
        id: true,
        productCode: true,
        quantity: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findById(id: string): Promise<PrintQueue | null> {
    return this.prisma.printQueue.findUnique({
      where: { id },
      include: {
        stockCard: true,
        printedByUser: true,
      },
    });
  }

  async updateStatus(
    id: string,
    data: {
      status: string;
      printedAt?: Date;
      printedBy?: string;
      printerName?: string;
      errorMessage?: string;
      retryCount?: number;
    }
  ): Promise<PrintQueue> {
    return this.prisma.printQueue.update({
      where: { id },
      data: {
        status: data.status,
        printedAt: data.printedAt,
        printedBy: data.printedBy,
        printerName: data.printerName,
        errorMessage: data.errorMessage,
        retryCount: data.retryCount || { increment: 1 },
      },
      include: {
        stockCard: true,
        printedByUser: true,
      },
    });
  }

  async delete(id: string): Promise<PrintQueue> {
    return this.prisma.printQueue.delete({
      where: { id },
    });
  }

  async deleteMany(ids: string[]): Promise<{ count: number }> {
    return this.prisma.printQueue.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findByStatus(status: string): Promise<PrintQueue[]> {
    return this.prisma.printQueue.findMany({
      where: { status },
      include: {
        stockCard: true,
        printedByUser: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<PrintQueue[]> {
    return this.prisma.printQueue.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        stockCard: true,
        printedByUser: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findByPrinter(printerName: string): Promise<PrintQueue[]> {
    return this.prisma.printQueue.findMany({
      where: { printerName },
      include: {
        stockCard: true,
        printedByUser: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getStatistics(): Promise<{
    totalPrinted: number;
    totalPending: number;
    totalFailed: number;
    averagePrintTime: number;
  }> {
    const [printed, pending, failed, printTimes] = await Promise.all([
      this.prisma.printQueue.count({ where: { status: "PRINTED" } }),
      this.prisma.printQueue.count({ where: { status: "PENDING" } }),
      this.prisma.printQueue.count({ where: { status: "FAILED" } }),
      this.prisma.printQueue.findMany({
        where: {
          status: "PRINTED",
          printedAt: { not: null },
        },
        select: {
          createdAt: true,
          printedAt: true,
        },
      }),
    ]);

    const totalPrintTime = printTimes.reduce((acc, curr) => {
      if (curr.printedAt) {
        return acc + (curr.printedAt.getTime() - curr.createdAt.getTime());
      }
      return acc;
    }, 0);

    const averagePrintTime =
      printTimes.length > 0 ? totalPrintTime / printTimes.length : 0;

    return {
      totalPrinted: printed,
      totalPending: pending,
      totalFailed: failed,
      averagePrintTime,
    };
  }

  async updateManyStatus(
    ids: string[],
    status: string
  ): Promise<{ count: number }> {
    return this.prisma.printQueue.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status,
      },
    });
  }

  async markAsPrinted(
    ids: string[],
    printedBy: string,
    printerName: string
  ): Promise<{ count: number }> {
    return this.prisma.printQueue.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status: "PRINTED",
        printedAt: new Date(),
        printedBy,
        printerName,
      },
    });
  }

  async findFailedPrints(): Promise<PrintQueue[]> {
    return this.prisma.printQueue.findMany({
      where: {
        status: "FAILED",
      },
      include: {
        stockCard: true,
        printedByUser: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async resetFailedPrints(): Promise<{ count: number }> {
    return this.prisma.printQueue.updateMany({
      where: {
        status: "FAILED",
      },
      data: {
        status: "PENDING",
        errorMessage: null,
        retryCount: 0,
      },
    });
  }
}
