import prisma from "../../config/prisma";
import {
  CurrentMovement,
  Prisma,
  InvoiceType,
  DocumentType,
  StockUnits,
  ReceiptType,
  CurrentMovementType,
  CurrentMovementDocumentType,
  CurrentPaymentType,
} from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import { Decimal } from "@prisma/client/runtime/library";
import VaultMovementService from "./vaultMovementService";
import { PosMovementService } from "./posMovementService";
import BankMovementService from "./bankMovementService";
import { extractUsernameFromToken } from "./extractUsernameService";

// Interface tanımlamaları
interface CurrentMovementResponse {
  id: string;
  currentCode: string | null;
  currentName: string;
  dueDate: Date | null;
  description: string | null;
  debtAmount: Decimal | null;
  creditAmount: Decimal | null;
  movementType: CurrentMovementType;
  documentType: CurrentMovementDocumentType | null;
  documentNo: string | null;
  paymentType: CurrentPaymentType | null;
  branchCode: string;
  branchName: string;
  companyCode: string;
  createdAt: Date;
  createdBy: string;
  createdByFullName: string;
  updatedByFullName: string;
  receipt?: ReceiptInfo | null;
  invoice?: InvoiceInfo | null;
}

interface ReceiptInfo {
  documentNo: string;
  receiptType: ReceiptType;
  receiptDate: Date;
  description: string;
  outWarehouse: string | null;
  inWarehouse: string | null;
  details: ReceiptDetailInfo[];
}

interface ReceiptDetailInfo {
  stockCardId: string;
  productCode: string;
  productName: string;
  quantity: Decimal;
  unitPrice: Decimal;
  totalPrice: Decimal;
  unit: StockUnits;
}

interface InvoiceInfo {
  invoiceNo: string;
  gibInvoiceNo: string | null;
  invoiceDate: Date | null;
  invoiceType: InvoiceType | null;
  documentType: DocumentType | null;
  totalAmount: Decimal | null;
  totalVat: Decimal | null;
  totalDiscount: Decimal | null;
  totalNet: Decimal | null;
  totalPaid: Decimal | null;
  totalDebt: Decimal | null;
  details: InvoiceDetailInfo[];
}

interface InvoiceDetailInfo {
  productCode: string | null;
  quantity: Decimal | null;
  unitPrice: Decimal | null;
  totalPrice: Decimal | null;
  vatRate: Decimal | null;
  discount: Decimal | null;
  netPrice: Decimal | null;
}

export class CurrentMovementService {
  private vaultMovementService: VaultMovementService;
  private bankMovementService: BankMovementService;
  private posMovementService: PosMovementService;
  private currentMovementRepository: BaseRepository<CurrentMovement>;

  constructor() {
    this.currentMovementRepository = new BaseRepository<CurrentMovement>(
      prisma.currentMovement
    );
    this.vaultMovementService = new VaultMovementService();
    this.bankMovementService = new BankMovementService();
    this.posMovementService = new PosMovementService();
  }

  async createCurrentMovement(
    currentMovement: any,
    bearerToken: string
  ): Promise<any> {
    try {
      const username = extractUsernameFromToken(bearerToken);
      const companyCode = await prisma.company.findFirst();
      const createdCurrentMovement = await prisma.currentMovement.create({
        data: {
          dueDate: currentMovement.dueDate,
          description: currentMovement.description,
          debtAmount: currentMovement.debtAmount,
          creditAmount: currentMovement.creditAmount,
          movementType: currentMovement.movementType,
          documentType: currentMovement.documentType,
          paymentType: currentMovement.paymentType,
          createdByUser: {
            connect: {
              username: username,
            },
          },
          updatedByUser: {
            connect: {
              username: username,
            },
          },

          current: currentMovement.currentCode
            ? {
                connect: {
                  currentCode: currentMovement.currentCode,
                },
              }
            : undefined,
          company: currentMovement.companyCode
            ? {
                connect: {
                  companyCode: currentMovement.companyCode,
                },
              }
            : {
                connect: {
                  companyCode: companyCode?.companyCode,
                },
              },
          branch: currentMovement.branchCode
            ? {
                connect: {
                  branchCode: currentMovement.branchCode,
                },
              }
            : {},
          StockCardPriceList: currentMovement?.priceListId
            ? {
                connect: {
                  id: currentMovement.priceListId,
                },
              }
            : undefined,
          invoice: currentMovement?.documentNo
            ? {
                connect: {
                  id: currentMovement.documentNo,
                },
              }
            : undefined,
        } as Prisma.CurrentMovementCreateInput,
      });
      return createdCurrentMovement;
    } catch (error) {
      logger.error("Error creating current movement", error);
      throw error;
    }
  }

  async updateCurrentMovement(
    id: string,
    currentMovement: Partial<CurrentMovement>,
    bearerToken: string
  ): Promise<CurrentMovement> {
    try {
      const username = extractUsernameFromToken(bearerToken);
      const debtAmount = currentMovement.debtAmount ?? new Decimal(0); // Eğer debtAmount yoksa 0 yap
      const creditAmount = currentMovement.creditAmount ?? new Decimal(0); // Eğer creditAmount yoksa 0 yap
      const updatedCurrentMovement = await prisma.currentMovement.update({
        where: { id },
        data: {
          dueDate: currentMovement.dueDate,
          description: currentMovement.description,
          debtAmount: debtAmount,
          creditAmount: creditAmount,
          documentType: currentMovement.documentType,
          paymentType: currentMovement.paymentType,
          updatedByUser: {
            connect: {
              username: username,
            },
          },

          current: currentMovement.currentCode
            ? {
                connect: {
                  currentCode: currentMovement.currentCode,
                },
              }
            : undefined,
          company: currentMovement.companyCode
            ? {
                connect: {
                  companyCode: currentMovement.companyCode,
                },
              }
            : {},
          branch: currentMovement.branchCode
            ? {
                connect: {
                  branchCode: currentMovement.branchCode,
                },
              }
            : {},
          StockCardPriceList: currentMovement.priceListId
            ? {
                connect: {
                  id: currentMovement.priceListId,
                },
              }
            : undefined,
          invoice: currentMovement.documentNo
            ? {
                connect: {
                  id: currentMovement.documentNo,
                },
              }
            : undefined,
        } as Prisma.CurrentMovementUpdateInput,
      });

      //  İlişkili olan vaultMovement bilgilerini alıyoruz
      const vaultMovement = await prisma.vaultMovement.findFirst({
        where: {
          currentMovementId: updatedCurrentMovement.id,
        },
      });
      const vaultMovementData = {
        vaultId: vaultMovement?.vaultId,
        entering: updatedCurrentMovement.debtAmount ?? new Decimal(0),
        emerging: updatedCurrentMovement.creditAmount ?? new Decimal(0),
        currentMovementId: updatedCurrentMovement.id,
      };
      if (vaultMovement) {
        // VaultMovement bilgilerini güncelliyoruz
        await this.vaultMovementService.updateVaultMovement(
          vaultMovement.id,
          vaultMovementData,
          bearerToken
        );
      }

      // İlişkili olan bankMovement bilgilerini alıyoruz
      const bankMovement = await prisma.bankMovement.findFirst({
        where: {
          currentMovementId: updatedCurrentMovement.id,
        },
      });
      const bankMovementData = {
        bankId: bankMovement?.bankId,
        entering: updatedCurrentMovement.debtAmount ?? new Decimal(0),
        emerging: updatedCurrentMovement.creditAmount ?? new Decimal(0),
        currentMovementId: updatedCurrentMovement.id,
      };
      if (bankMovement) {
        // BankMovement bilgilerini güncelliyoruz
        await this.bankMovementService.updateBankMovement(
          bankMovement.id,
          bankMovementData,
          bearerToken
        );
      }

      // İlişkili olan posMovement bilgilerini alıyoruz
      const posMovement = await prisma.posMovement.findFirst({
        where: {
          currentMovementId: updatedCurrentMovement.id,
        },
      });
      const posMovementData = {
        posId: posMovement?.posId,
        entering: updatedCurrentMovement.debtAmount ?? new Decimal(0),
        emerging: updatedCurrentMovement.creditAmount ?? new Decimal(0),
        currentMovementId: updatedCurrentMovement.id,
      };
      if (posMovement) {
        // PosMovement bilgilerini güncelliyoruz
        await this.posMovementService.updatePosMovement(
          posMovement.id,
          posMovementData,
          bearerToken
        );
      }

      return updatedCurrentMovement;
    } catch (error) {
      logger.error(`Error updating current movement with id ${id}`, error);
      throw error;
    }
  }

  async deleteCurrentMovement(id: string): Promise<boolean> {
    try {
      return await this.currentMovementRepository.delete(id);
    } catch (error) {
      logger.error(`Error deleting current movement with id ${id}`, error);
      throw error;
    }
  }

  async getCurrentMovementById(
    id: string
  ): Promise<CurrentMovementResponse | null> {
    try {
      const currentMovement = await prisma.currentMovement.findUnique({
        where: { id },
        select: {
          id: true,
          currentCode: true,
          dueDate: true,
          description: true,
          debtAmount: true,
          creditAmount: true,
          movementType: true,
          documentType: true,
          documentNo: true,
          paymentType: true,
          branchCode: true,
          companyCode: true,
          createdAt: true,
          createdBy: true,

          current: {
            select: {
              currentName: true,
            },
          },
          branch: {
            select: {
              branchName: true,
            },
          },
          createdByUser: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          updatedByUser: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          Receipt: {
            select: {
              documentNo: true,
              receiptType: true,
              receiptDate: true,
              description: true,
              outWarehouse: true,
              inWarehouse: true,
              receiptDetail: {
                select: {
                  stockCard: {
                    select: {
                      id: true,
                      productCode: true,
                      productName: true,
                      unit: true,
                    },
                  },
                  quantity: true,
                  unitPrice: true,
                  totalPrice: true,
                },
              },
            },
          },
          invoice: {
            select: {
              invoiceNo: true,
              gibInvoiceNo: true,
              invoiceDate: true,
              invoiceType: true,
              documentType: true,
              totalAmount: true,
              totalVat: true,
              totalDiscount: true,
              totalNet: true,
              totalPaid: true,
              totalDebt: true,
              invoiceDetail: {
                select: {
                  productCode: true,
                  quantity: true,
                  unitPrice: true,
                  totalPrice: true,
                  vatRate: true,
                  discount: true,
                  netPrice: true,
                },
              },
            },
          },
        },
      });

      if (!currentMovement) return null;

      const response: CurrentMovementResponse = {
        id: currentMovement.id,
        currentCode: currentMovement.currentCode,
        currentName: currentMovement.current?.currentName ?? "",
        dueDate: currentMovement.dueDate,
        description: currentMovement.description ?? "",
        debtAmount: currentMovement.debtAmount,
        creditAmount: currentMovement.creditAmount,
        movementType: currentMovement.movementType,
        documentType: currentMovement.documentType,
        documentNo: currentMovement.documentNo,
        paymentType: currentMovement.paymentType,
        branchCode: currentMovement.branchCode,
        branchName: currentMovement.branch?.branchName ?? "",
        companyCode: currentMovement.companyCode,
        createdAt: currentMovement.createdAt,
        createdBy: currentMovement.createdBy ?? "",
        createdByFullName: currentMovement.createdByUser
          ? `${currentMovement.createdByUser.firstName} ${currentMovement.createdByUser.lastName}`.trim()
          : "",
        updatedByFullName: currentMovement.updatedByUser
          ? `${currentMovement.updatedByUser.firstName} ${currentMovement.updatedByUser.lastName}`.trim()
          : "",

        receipt: currentMovement.Receipt?.[0]
          ? {
              documentNo: currentMovement.Receipt[0].documentNo,
              receiptType: currentMovement.Receipt[0].receiptType,
              receiptDate: currentMovement.Receipt[0].receiptDate,
              description: currentMovement.Receipt[0].description ?? "",
              outWarehouse: currentMovement.Receipt[0].outWarehouse,
              inWarehouse: currentMovement.Receipt[0].inWarehouse,
              details: currentMovement.Receipt[0].receiptDetail.map(
                (detail) => ({
                  stockCardId: detail.stockCard.id,
                  productCode: detail.stockCard.productCode,
                  productName: detail.stockCard.productName,
                  quantity: detail.quantity,
                  unitPrice: detail.unitPrice,
                  totalPrice: detail.totalPrice,
                  unit: detail.stockCard.unit,
                })
              ),
            }
          : null,

        invoice: currentMovement.invoice
          ? {
              invoiceNo: currentMovement.invoice.invoiceNo,
              gibInvoiceNo: currentMovement.invoice.gibInvoiceNo,
              invoiceDate: currentMovement.invoice.invoiceDate,
              invoiceType: currentMovement.invoice.invoiceType,
              documentType: currentMovement.invoice.documentType,
              totalAmount: currentMovement.invoice.totalAmount,
              totalVat: currentMovement.invoice.totalVat,
              totalDiscount: currentMovement.invoice.totalDiscount,
              totalNet: currentMovement.invoice.totalNet,
              totalPaid: currentMovement.invoice.totalPaid,
              totalDebt: currentMovement.invoice.totalDebt,
              details: currentMovement.invoice.invoiceDetail.map((detail) => ({
                productCode: detail.productCode,
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
                totalPrice: detail.totalPrice,
                vatRate: detail.vatRate,
                discount: detail.discount,
                netPrice: detail.netPrice,
              })),
            }
          : null,
      };

      return response;
    } catch (error) {
      logger.error(`Error fetching current movement with id ${id}`, error);
      throw error;
    }
  }

  async getAllCurrentMovements(): Promise<CurrentMovement[]> {
    try {
      return await this.currentMovementRepository.findAll();
    } catch (error) {
      logger.error("Error fetching all current movements", error);
      throw error;
    }
  }

  async getAllCurrentMovementsWithCurrents(): Promise<CurrentMovement[]> {
    try {
      return await prisma.currentMovement.findMany({
        include: {
          current: true,
        },
      });
    } catch (error) {
      logger.error("Error fetching all current movements with currents", error);
      throw error;
    }
  }

  async getAllCurrentMovementsWithCurrentsByCurrentId(
    currentId: string
  ): Promise<CurrentMovement[]> {
    try {
      return await prisma.currentMovement.findMany({
        where: {
          current: {
            id: currentId,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      logger.error(
        "Error fetching all current movements with currents by current id",
        error
      );
      throw error;
    }
  }

  async getCurrentMovementsWithFilters(
    filter: any
  ): Promise<CurrentMovement[] | null> {
    try {
      return await this.currentMovementRepository.findWithFilters(filter);
    } catch (error) {
      logger.error("Error fetching current movements with filters", error);
      throw error;
    }
  }
}

export default CurrentMovementService;
