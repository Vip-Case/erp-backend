import { PrintQueue } from "@prisma/client";

export interface IPrintQueueService {
  create(data: { productCode: string; quantity: number }): Promise<PrintQueue>;
  createMany(
    data: { productCode: string; quantity: number }[]
  ): Promise<{ count: number }>;
  findAll(): Promise<PrintQueue[]>;
  findPending(): Promise<Pick<PrintQueue, "id" | "productCode" | "quantity">[]>;
  findById(id: string): Promise<PrintQueue | null>;
  updateStatus(
    id: string,
    data: {
      status: string;
      printedAt?: Date;
      printedBy?: string;
      printerName?: string;
      errorMessage?: string;
      retryCount?: number;
    }
  ): Promise<PrintQueue>;
  delete(id: string): Promise<PrintQueue>;
  deleteMany(ids: string[]): Promise<{ count: number }>;
  findByStatus(status: string): Promise<PrintQueue[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<PrintQueue[]>;
  findByPrinter(printerName: string): Promise<PrintQueue[]>;
  getStatistics(): Promise<{
    totalPrinted: number;
    totalPending: number;
    totalFailed: number;
    averagePrintTime: number;
  }>;
  updateManyStatus(ids: string[], status: string): Promise<{ count: number }>;
  markAsPrinted(
    ids: string[],
    printedBy: string,
    printerName: string
  ): Promise<{ count: number }>;
  findFailedPrints(): Promise<PrintQueue[]>;
  resetFailedPrints(): Promise<{ count: number }>;
}
