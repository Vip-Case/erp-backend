import prisma from "../../config/prisma";
import { Prisma, BankMovement } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import BankService from "./bankService";
export class BankMovementService {
  private bankMovementRepository: BaseRepository<BankMovement>;

  constructor() {
    this.bankMovementRepository = new BaseRepository<BankMovement>(
      prisma.bankMovement
    );
  }

  async createBankMovement(
    bankMovement: BankMovement,
    username: string
  ): Promise<BankMovement> {
    try {
      const createdBankMovement = await prisma.bankMovement.create({
        data: {
          description: bankMovement.description,
          entering: bankMovement.entering,
          emerging: bankMovement.emerging,
          bankDirection: bankMovement.bankDirection,
          bankType: bankMovement.bankType,
          bankDocumentType: bankMovement.bankDocumentType,
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

          bank: bankMovement.bankId
            ? {
                connect: {
                  id: bankMovement.bankId,
                },
              }
            : undefined,

          invoice: bankMovement?.invoiceId
            ? {
                connect: {
                  id: bankMovement.invoiceId,
                },
              }
            : undefined,

          receipt: bankMovement?.receiptId
            ? {
                connect: {
                  id: bankMovement.receiptId,
                },
              }
            : undefined,

          currentMovement: bankMovement?.currentMovementId
            ? {
                connect: {
                  id: bankMovement.currentMovementId,
                },
              }
            : undefined,
        } as Prisma.BankMovementCreateInput,
      });

      BankService.updateBankBalance(
        bankMovement.bankId,
        bankMovement.entering,
        bankMovement.emerging
      );

      return createdBankMovement;
    } catch (error) {
      logger.error("Error creating bankMovement", error);
      throw error;
    }
  }

  async updateBankMovement(
    id: string,
    bankMovement: Partial<BankMovement>,
    username: string
  ): Promise<BankMovement> {
    try {
      // Eski bankMovement bilgilerini alıyoruz
      const oldBankMovement = await this.bankMovementRepository.findById(id);
      // Güncellenmemiş enterin ve emerging değerlerini alıyoruz
      const entering: number = Number(oldBankMovement?.entering || 0);
      const emerging: number = Number(oldBankMovement?.emerging || 0);
      // Güncellenen enterin ve emerging değerlerini alıyoruz
      const newEntering: number = Number(bankMovement.entering || 0);
      const newEmerging: number = Number(bankMovement.emerging || 0);
      // Eski değerlerden yeni değerleri çıkartarak farkı buluyoruz eğer negatif değer ise positive yaparak hesaplamayı yapıyoruz
      const enteringDifference = newEntering - entering;
      const emergingDifference = newEmerging - emerging;
      const enteringValue =
        enteringDifference < 0 ? enteringDifference * -1 : enteringDifference;
      const emergingValue =
        emergingDifference < 0 ? emergingDifference * -1 : emergingDifference;
      // Önce yeni gelen veride bankId var mı kontrol ediyoruz eğer yoksa eski bankId yi alıyoruz eğer varsa yeni bankId yi alıyoruz
      if (!oldBankMovement) {
        throw new Error(`BankMovement with id ${id} not found`);
      }
      const bankId = bankMovement.bankId || oldBankMovement.bankId;
      // Banka bakisini güncelliyoruz
      BankService.updateBankBalance(
        bankId,
        new Prisma.Decimal(enteringValue),
        new Prisma.Decimal(emergingValue)
      );
      // Güncelleme işlemini yapıyoruz
      const updatedBankMovement = await prisma.bankMovement.update({
        where: { id },
        data: {
          invoiceId: bankMovement?.invoiceId,
          receiptId: bankMovement?.receiptId,
          description: bankMovement?.description,
          entering: bankMovement?.entering,
          emerging: bankMovement?.emerging,
          bankDirection: bankMovement?.bankDirection,
          bankType: bankMovement?.bankType,
          bankDocumentType: bankMovement?.bankDocumentType,
          updatedByUser: {
            connect: {
              username: username,
            },
          },

          bank: bankMovement.bankId
            ? {
                connect: {
                  id: bankMovement.bankId,
                },
              }
            : undefined,

          invoice: bankMovement.invoiceId
            ? {
                connect: {
                  id: bankMovement.invoiceId,
                },
              }
            : undefined,

          receipt: bankMovement.receiptId
            ? {
                connect: {
                  id: bankMovement.receiptId,
                },
              }
            : undefined,

          currentMovement: bankMovement.currentMovementId
            ? {
                connect: {
                  id: bankMovement.currentMovementId,
                },
              }
            : undefined,
        } as Prisma.BankMovementUpdateInput,
      });
      return updatedBankMovement;
    } catch (error) {
      logger.error(`Error updating bankMovement with id ${id}`, error);
      throw error;
    }
  }

  async deleteBankMovement(id: string): Promise<boolean> {
    try {
      return await this.bankMovementRepository.delete(id);
    } catch (error) {
      logger.error(`Error deleting bankMovement with id ${id}`, error);
      throw error;
    }
  }

  async getBankMovementById(id: string): Promise<BankMovement | null> {
    try {
      return await this.bankMovementRepository.findById(id);
    } catch (error) {
      logger.error(`Error fetching bankMovement with id ${id}`, error);
      throw error;
    }
  }

  async getBankMovementsByBankId(bankId: string): Promise<BankMovement[]> {
    try {
      return await prisma.bankMovement.findMany({
        where: { bankId: bankId },
        include: {
          bank: true,
        },
      });
    } catch (error) {
      logger.error(`Error fetching bankMovements with bankId ${bankId}`, error);
      throw error;
    }
  }

  async getAllBankMovements(): Promise<BankMovement[]> {
    try {
      return await prisma.bankMovement.findMany({
        include: {
          bank: true,
        },
      });
    } catch (error) {
      logger.error("Error fetching all bankMovements", error);
      throw error;
    }
  }
}

export default BankMovementService;
