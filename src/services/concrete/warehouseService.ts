import prisma from "../../config/prisma";
import {
  Prisma,
  Warehouse,
  ReceiptType,
  StockTakeType,
  StockTakeStatus,
  StokManagementType,
  GCCode,
} from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import { extractUsernameFromToken } from "./extractUsernameService";

export interface StockTakeWarehouseProduct {
  stockCardId: string;
  quantity: number;
  note?: string;
}

export interface StockTakeWarehouse {
  warehouseId: string;
  branchCode: string;
  stockTakeType: StockTakeType;
  description?: string;
  reference?: string;
  products: StockTakeWarehouseProduct[];
}

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

export interface OrderReturnWarehouse {
  id: string;
  warehouseId: string;
  branchCode: string;
  currentId: string;
  products: Array<{
    stockCardId: string;
    quantity: number;
  }>;
}

export interface ReceiptFilters {
  startDate?: Date;
  endDate?: Date;
  receiptType?: ReceiptType;
  documentNo?: string;
  currentId?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ReceiptResponse {
  data: Array<{
    id: string;
    documentNo: string;
    receiptType: ReceiptType;
    description: string | null;
    branchCode: string;
    createdAt: Date;
    current: {
      id: string;
      currentCode: string;
      currentName: string;
    } | null;
    receiptDetail?: Array<{
      id: string;
      quantity: Prisma.Decimal;
      unitPrice: Prisma.Decimal;
      totalPrice: Prisma.Decimal;
      stockCard: {
        id: string;
        productName: string;
        productCode: string;
      };
    }>;
    createdByUser: {
      id: string;
      username: string;
      firstName: string | null;
      lastName: string | null;
    } | null;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DetailedReceiptResponse {
  id: string;
  documentNo: string;
  receiptType: ReceiptType;
  description: string | null;
  branchCode: string;
  createdAt: Date;
  current: {
    id: string;
    currentCode: string;
    currentName: string;
    priceList: {
      id: string;
      priceListName: string;
      currency: string;
      isVatIncluded: boolean;
    };
  } | null;
  receiptDetail: Array<{
    id: string;
    quantity: Prisma.Decimal;
    unitPrice: Prisma.Decimal;
    totalPrice: Prisma.Decimal;
    vatRate: Prisma.Decimal;
    discount: Prisma.Decimal;
    netPrice: Prisma.Decimal;
    stockCard: {
      id: string;
      productName: string;
      productCode: string;
      unit: string;
    };
  }>;
  currentMovement: {
    id: string;
    documentType: string | null;
    movementType: string;
    debtAmount: Prisma.Decimal | null;
    creditAmount: Prisma.Decimal | null;
    description: string | null;
  } | null;
  createdByUser: {
    id: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
}

async function generateDocumentNumber(
  prisma: any,
  prefix: string
): Promise<string> {
  const lastReceipt = await prisma.receipt.findFirst({
    where: {
      documentNo: {
        startsWith: prefix,
      },
    },
    orderBy: {
      documentNo: "desc",
    },
  });

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");

  if (!lastReceipt) {
    return `${prefix}${year}${month}00001`;
  }

  const lastNumber = parseInt(lastReceipt.documentNo.slice(-5));
  const newNumber = String(lastNumber + 1).padStart(5, "0");
  return `${prefix}${year}${month}${newNumber}`;
}

async function generateStockTakeDocumentNo(prisma: any): Promise<string> {
  const lastStockTake = await prisma.stockTake.findFirst({
    where: {
      documentNo: {
        startsWith: "ST",
      },
    },
    orderBy: {
      documentNo: "desc",
    },
  });

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");

  if (!lastStockTake) {
    return `ST${year}${month}00001`;
  }

  const lastNumber = parseInt(lastStockTake.documentNo.slice(-5));
  const newNumber = String(lastNumber + 1).padStart(5, "0");
  return `ST${year}${month}${newNumber}`;
}

export class WarehouseService {
  private warehouseRepository: BaseRepository<Warehouse>;

  constructor() {
    this.warehouseRepository = new BaseRepository<Warehouse>(prisma.warehouse);
  }

  async createWarehouse(
    warehouse: Warehouse,
    bearerToken: string
  ): Promise<Warehouse> {
    try {
      const username = extractUsernameFromToken(bearerToken);
      const createdWarehouse = await prisma.warehouse.create({
        data: {
          warehouseName: warehouse.warehouseName,
          warehouseCode: warehouse.warehouseCode,
          address: warehouse.address,
          countryCode: warehouse.countryCode,
          city: warehouse.city,
          district: warehouse.district,
          phone: warehouse.phone,
          email: warehouse.email,
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
          company: warehouse.companyCode
            ? {
                connect: { companyCode: warehouse.companyCode },
              }
            : {},
        } as Prisma.WarehouseCreateInput,
      });
      return createdWarehouse;
    } catch (error) {
      logger.error("Error creating warehouse", error);
      throw error;
    }
  }

  async updateWarehouse(
    id: string,
    warehouse: Partial<Warehouse>,
    bearerToken: string
  ): Promise<Warehouse> {
    try {
      const username = extractUsernameFromToken(bearerToken);
      return await prisma.warehouse.update({
        where: { id },
        data: {
          warehouseName: warehouse.warehouseName,
          warehouseCode: warehouse.warehouseCode,
          address: warehouse.address,
          countryCode: warehouse.countryCode,
          city: warehouse.city,
          district: warehouse.district,
          phone: warehouse.phone,
          email: warehouse.email,
          updatedByUser: {
            connect: {
              username: username,
            },
          },

          company: warehouse.companyCode
            ? {
                connect: { companyCode: warehouse.companyCode },
              }
            : {},
        } as Prisma.WarehouseUpdateInput,
      });
    } catch (error) {
      logger.error(`Error updating warehouse with id ${id}`, error);
      throw error;
    }
  }

  async deleteWarehouse(id: string): Promise<boolean> {
    try {
      return await this.warehouseRepository.delete(id);
    } catch (error) {
      logger.error(`Error deleting warehouse with id ${id}`, error);
      throw error;
    }
  }

  async getWarehouseById(id: string): Promise<Warehouse | null> {
    try {
      return await this.warehouseRepository.findById(id);
    } catch (error) {
      logger.error(`Error fetching warehouse with id ${id}`, error);
      throw error;
    }
  }

  async getWarehousesWithStockCount(): Promise<Warehouse[]> {
    try {
      return await this.warehouseRepository.findAll();
    } catch (error) {
      logger.error("Error fetching all warehouses", error);
      throw error;
    }
  }

  async getAllWarehouses() {
    try {
      const warehouses = await prisma.warehouse.findMany({
        include: {
          stockCardWarehouse: true,
        },
      });

      // StockCardWarehouse tablosundaki stockCardId'ye göre kaç farklı ürün olduğunu hesaplayıp değişkene atıyoruz.
      const stockCount = warehouses.map((warehouse) => {
        const totalStock = warehouse.stockCardWarehouse.reduce(
          (acc, stockCardWarehouse) => {
            return acc + stockCardWarehouse.quantity.toNumber();
          },
          0
        );

        return {
          id: warehouse.id,
          warehouseName: warehouse.warehouseName,
          warehouseCode: warehouse.warehouseCode,
          address: warehouse.address,
          countryCode: warehouse.countryCode,
          city: warehouse.city,
          district: warehouse.district,
          phone: warehouse.phone,
          email: warehouse.email,
          companyCode: warehouse.companyCode,
          createdAt: warehouse.createdAt,
          updatedAt: warehouse.updatedAt,
          createdBy: warehouse.createdBy,
          updatedBy: warehouse.updatedBy,
          stockCount: warehouse.stockCardWarehouse.length,
          totalStock: totalStock,
        };
      });

      return stockCount;
    } catch (error) {
      logger.error("Error fetching warehouses with stock count", error);
      throw error;
    }
  }

  async getWarehousesWithFilters(filter: any): Promise<Warehouse[] | null> {
    try {
      return await this.warehouseRepository.findWithFilters(filter);
    } catch (error) {
      logger.error("Error fetching warehouses with filters", error);
      throw error;
    }
  }

  async createStocktakeWarehouse(
    data: StockTakeWarehouse,
    bearerToken: string
  ): Promise<any> {
    try {
      const username = extractUsernameFromToken(bearerToken);
      const result = await prisma.$transaction(async (prisma) => {
        // Ana sayım kaydını oluştur
        const stockTake = await prisma.stockTake.create({
          data: {
            documentNo: await generateStockTakeDocumentNo(prisma),
            warehouseId: data.warehouseId,
            branchCode: data.branchCode,
            stockTakeType: data.stockTakeType as StockTakeType,
            status: "Completed" as StockTakeStatus,
            description: data.description,
            reference: data.reference,
            startedAt: new Date(),
            createdBy: username,
            details: {
              create: await Promise.all(
                data.products.map(async (product) => {
                  // Mevcut stok miktarını al
                  const currentStock =
                    await prisma.stockCardWarehouse.findFirst({
                      where: {
                        stockCardId: product.stockCardId,
                        warehouseId: data.warehouseId,
                      },
                    });

                  const currentQuantity =
                    currentStock?.quantity || new Prisma.Decimal(0);
                  const difference = new Prisma.Decimal(product.quantity).minus(
                    currentQuantity
                  );

                  return {
                    stockCardId: product.stockCardId,
                    quantity: new Prisma.Decimal(product.quantity),
                    difference: difference,
                    note: product.note,
                  };
                })
              ),
            },
          },
          include: {
            details: {
              include: {
                stockCard: true,
              },
            },
            warehouse: true,
            branch: true,
            createdByUser: true,
          },
        });

        // Stok hareketlerini oluştur
        for (const detail of stockTake.details) {
          if (!detail.difference.equals(new Prisma.Decimal(0))) {
            const _productCode = await prisma.stockCard.findUnique({
              where: { id: detail.stockCardId },
              select: { productCode: true },
            });

            const _warehouseCode = await prisma.warehouse.findUnique({
              where: { id: data.warehouseId },
              select: { warehouseCode: true },
            });

            await prisma.stockMovement.create({
              data: {
                documentType: "Other",
                invoiceType: "Other",
                movementType: "Sayim",
                gcCode: detail.difference.isPositive() ? "Giris" : "Cikis",
                type: "Stok Sayım",
                description: "Stok Sayım Farkı",
                quantity: detail.difference.abs(),
                stockCard: {
                  connect: { productCode: _productCode?.productCode },
                },
                warehouse: {
                  connect: { warehouseCode: _warehouseCode?.warehouseCode },
                },
                branch: {
                  connect: { branchCode: data.branchCode },
                },
              },
            });

            // StockCardWarehouse tablosunu güncelle
            await prisma.stockCardWarehouse.upsert({
              where: {
                stockCardId_warehouseId: {
                  stockCardId: detail.stockCardId,
                  warehouseId: data.warehouseId,
                },
              },
              update: {
                quantity: detail.quantity,
              },
              create: {
                stockCardId: detail.stockCardId,
                warehouseId: data.warehouseId,
                quantity: detail.quantity,
              },
            });
          }
        }

        return stockTake;
      });

      return result;
    } catch (error) {
      logger.error("Error creating stocktake warehouse", error);
      throw error;
    }
  }

  async updateStocktakeWarehouse(
    id: string,
    data: StockTakeWarehouse
  ): Promise<any> {
    try {
      const result = await prisma.$transaction(async (prisma) => {
        const stockTake = await prisma.stockTake.update({
          where: { id },
          data: {
            stockTakeType: data.stockTakeType,
            description: data.description,
            reference: data.reference,
            details: {
              deleteMany: {},
              create: await Promise.all(
                data.products.map(async (product) => {
                  const currentStock =
                    await prisma.stockCardWarehouse.findFirst({
                      where: {
                        stockCardId: product.stockCardId,
                        warehouseId: data.warehouseId,
                      },
                    });

                  const currentQuantity =
                    currentStock?.quantity || new Prisma.Decimal(0);
                  const difference = new Prisma.Decimal(product.quantity).minus(
                    currentQuantity
                  );

                  return {
                    stockCardId: product.stockCardId,
                    quantity: new Prisma.Decimal(product.quantity),
                    difference: difference,
                    note: product.note,
                  };
                })
              ),
            },
          },
          include: {
            details: {
              include: {
                stockCard: true,
              },
            },
            warehouse: true,
            branch: true,
          },
        });

        // Stok hareketlerini güncelle
        for (const detail of stockTake.details) {
          if (!detail.difference.equals(new Prisma.Decimal(0))) {
            const _productCode = await prisma.stockCard.findUnique({
              where: { id: detail.stockCardId },
              select: { productCode: true },
            });

            const _warehouseCode = await prisma.warehouse.findUnique({
              where: { id: data.warehouseId },
              select: { warehouseCode: true },
            });

            await prisma.stockMovement.create({
              data: {
                documentType: "Other",
                invoiceType: "Other",
                movementType: "Sayim",
                gcCode: detail.difference.isPositive() ? "Giris" : "Cikis",
                type: "Stok Sayım",
                description: "Stok Sayım Farkı Güncelleme",
                quantity: detail.difference.abs(),
                stockCard: {
                  connect: { productCode: _productCode?.productCode },
                },
                warehouse: {
                  connect: { warehouseCode: _warehouseCode?.warehouseCode },
                },
                branch: {
                  connect: { branchCode: data.branchCode },
                },
              },
            });

            // StockCardWarehouse tablosunu güncelle
            await prisma.stockCardWarehouse.upsert({
              where: {
                stockCardId_warehouseId: {
                  stockCardId: detail.stockCardId,
                  warehouseId: data.warehouseId,
                },
              },
              update: {
                quantity: detail.quantity,
              },
              create: {
                stockCardId: detail.stockCardId,
                warehouseId: data.warehouseId,
                quantity: detail.quantity,
              },
            });
          }
        }

        return stockTake;
      });

      return result;
    } catch (error) {
      logger.error("Error updating stocktake warehouse", error);
      throw error;
    }
  }

  async deleteStocktakeWarehouse(id: string): Promise<any> {
    try {
      return await prisma.stockTake.delete({
        where: { id },
      });
    } catch (error) {
      logger.error("Error deleting stocktaking warehouse", error);
      throw error;
    }
  }

  async getStocktakeWarehouseById(id: string): Promise<any> {
    try {
      return await prisma.stockTake.findUnique({
        where: { id },
        include: {
          warehouse: true,
          details: {
            include: {
              stockCard: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error("Error fetching stocktaking warehouse by id", error);
      throw error;
    }
  }

  async getStocktakeWarehouses(): Promise<any> {
    try {
      return await prisma.stockTake.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      logger.error("Error fetching stocktaking warehouses", error);
      throw error;
    }
  }

  async createOrderPrepareWarehouse(
    data: OrderPrepareWarehouse,
    bearerToken: string
  ): Promise<any> {
    try {
      const username = extractUsernameFromToken(bearerToken);
      const result = await prisma.$transaction(async (prisma) => {
        // Branch'e ait company code'u al
        const branch = await prisma.branch.findUnique({
          where: { branchCode: data.branchCode },
          select: { companyCode: true },
        });

        if (!branch) {
          throw new Error("Şube bulunamadı");
        }

        let totalAmount = 0;
        let receiptDetails = [];

        // Cariye ait aktif fiyat listesini al
        const currentPriceList = await prisma.current.findFirst({
          where: {
            id: data.currentId,
          },
          include: {
            priceList: true,
          },
        });

        if (!currentPriceList) {
          throw new Error("Cariye tanımlı aktif fiyat listesi bulunamadı");
        }

        for (const product of data.products) {
          // Stok kartının fiyat listesindeki fiyatını al
          const stockCardPrice = await prisma.stockCardPriceListItems.findFirst(
            {
              where: {
                stockCardId: product.stockCardId,
                priceListId: currentPriceList.priceListId,
              },
            }
          );

          if (!stockCardPrice) {
            throw new Error(
              `${product.stockCardId} ID'li stok kartı için fiyat listesinde fiyat bulunamadı`
            );
          }

          const productUnitPrice = stockCardPrice.price.toNumber();
          const subtotal = productUnitPrice * product.quantity;
          const vatRate = stockCardPrice.vatRate || 0;
          const vatAmount = (subtotal * Number(vatRate)) / 100;
          const total = subtotal + vatAmount;

          totalAmount += total;

          receiptDetails.push({
            stockCardId: product.stockCardId,
            quantity: product.quantity,
            unitPrice: productUnitPrice,
            subtotal: subtotal,
            vatRate: vatRate,
            vatAmount: vatAmount,
            total: total,
            warehouseId: data.warehouseId,
            discount: 0,
            netPrice: productUnitPrice,
          });

          // Mevcut stok kontrolü ve güncelleme kodları...

          // Önce mevcut stok kartı-depo ilişkisini bul
          const existingStockCardWarehouse =
            await prisma.stockCardWarehouse.findFirst({
              where: {
                stockCardId: product.stockCardId,
                warehouseId: data.warehouseId,
              },
              include: {
                stockCard: true,
              },
            });

          if (!existingStockCardWarehouse) {
            throw new Error(`Stok kartı bulunamadı: ${product.stockCardId}`);
          }

          // Yeni miktar = Mevcut miktar - Çıkılacak miktar
          const newQuantity =
            existingStockCardWarehouse.quantity.toNumber() - product.quantity;

          if (newQuantity < 0) {
            throw new Error(
              `Yetersiz stok. Stok kartı: ${product.stockCardId}, Mevcut: ${existingStockCardWarehouse.quantity}, İstenen: ${product.quantity}`
            );
          }

          const stockCardWarehouse = await prisma.stockCardWarehouse.update({
            where: {
              id: existingStockCardWarehouse.id,
            },
            data: {
              quantity: newQuantity,
            },
            include: {
              stockCard: true,
              warehouse: true,
            },
          });

          const _productCode = await prisma.stockCard.findUnique({
            where: { id: product.stockCardId },
            select: { productCode: true },
          });
          const _warehouseCode = await prisma.warehouse.findUnique({
            where: { id: data.warehouseId },
            select: { warehouseCode: true },
          });

          await prisma.stockMovement.create({
            data: {
              documentType: "Order",
              invoiceType: "Other",
              movementType: "Devir",
              gcCode: "Cikis",
              type: "Siparis Hazirlama",
              description: "Siparis Hazirlama Cikisi",
              quantity: product.quantity,
              stockCard: {
                connect: { productCode: _productCode?.productCode },
              },
              warehouse: {
                connect: { warehouseCode: _warehouseCode?.warehouseCode },
              },
              branch: {
                connect: { branchCode: data.branchCode },
              },
            },
          });
        }

        // CurrentMovement oluştur
        const _current = await prisma.current.findUnique({
          where: { id: data.currentId },
          select: { currentName: true },
        });

        const currentMovement = await prisma.currentMovement.create({
          data: {
            current: {
              connect: { id: data.currentId },
            },
            documentType: "Muhtelif",
            movementType: "Borc",
            debtAmount: totalAmount,
            creditAmount: 0,
            createdByUser: {
              connect: { username: username },
            },
            description: `Sipariş Hazırlama - ${_current?.currentName}`,
            branch: {
              connect: { branchCode: data.branchCode },
            },
            company: {
              connect: { companyCode: branch.companyCode },
            },
          },
        });

        const orderPrepare = await prisma.orderPrepareWarehouse.create({
          data: {
            warehouse: {
              connect: { id: data.warehouseId },
            },
            createdByUser: {
              connect: { username: username },
            },
            current: {
              connect: { id: data.currentId },
            },
            currentMovement: {
              connect: { id: currentMovement.id },
            },
          },
          include: {
            warehouse: true,
            current: true,
          },
        });

        // Receipt oluştur
        const receipt = await prisma.receipt.create({
          data: {
            receiptType: ReceiptType.Cikis,
            documentNo: await generateDocumentNumber(prisma, "SH"),
            description: "Sipariş Hazırlama",
            branchCode: data.branchCode,
            createdBy: username,
            currentId: data.currentId,
            currentMovementId: currentMovement.id,
          },
        });

        // Receipt Details oluştur
        for (const detail of receiptDetails) {
          await prisma.receiptDetail.create({
            data: {
              receiptId: receipt.id,
              stockCardId: detail.stockCardId,
              quantity: new Prisma.Decimal(String(detail.quantity)),
              unitPrice: new Prisma.Decimal(String(detail.unitPrice)),
              totalPrice: new Prisma.Decimal(String(detail.total)),
              vatRate: new Prisma.Decimal(String(detail.vatRate)),
              discount: new Prisma.Decimal(String(detail.discount)),
              netPrice: new Prisma.Decimal(String(detail.netPrice)),
            },
          });
        }

        return orderPrepare;
      });
      return result;
    } catch (error) {
      logger.error("Error preparing order warehouse", error);
      throw error;
    }
  }

  async createOrderReturnWarehouse(
    data: OrderReturnWarehouse,
    bearerToken: string
  ): Promise<any> {
    try {
      const username = extractUsernameFromToken(bearerToken);
      const result = await prisma.$transaction(async (prisma) => {
        // Branch'e ait company code'u al
        const branch = await prisma.branch.findUnique({
          where: { branchCode: data.branchCode },
          select: { companyCode: true },
        });

        if (!branch) {
          throw new Error("Şube bulunamadı");
        }

        let totalAmount = 0;
        let receiptDetails = [];

        // Cariye ait aktif fiyat listesini al
        const currentPriceList = await prisma.current.findFirst({
          where: {
            id: data.currentId,
          },
          include: {
            priceList: true,
          },
        });

        if (!currentPriceList) {
          throw new Error("Cariye tanımlı aktif fiyat listesi bulunamadı");
        }

        for (const product of data.products) {
          // Stok kartının fiyat listesindeki fiyatını al
          const stockCardPrice = await prisma.stockCardPriceListItems.findFirst(
            {
              where: {
                stockCardId: product.stockCardId,
                priceListId: currentPriceList.priceListId,
              },
            }
          );

          if (!stockCardPrice) {
            throw new Error(
              `${product.stockCardId} ID'li stok kartı için fiyat listesinde fiyat bulunamadı`
            );
          }

          const productUnitPrice = stockCardPrice.price.toNumber();
          const subtotal = productUnitPrice * product.quantity;
          const vatRate = stockCardPrice.vatRate || 0;
          const vatAmount = (subtotal * Number(vatRate)) / 100;
          const total = subtotal + vatAmount;

          totalAmount += total;

          receiptDetails.push({
            stockCardId: product.stockCardId,
            quantity: product.quantity,
            unitPrice: productUnitPrice,
            subtotal: subtotal,
            vatRate: vatRate,
            vatAmount: vatAmount,
            total: total,
            warehouseId: data.warehouseId,
            discount: 0,
            netPrice: productUnitPrice,
          });

          // Mevcut stok kontrolü ve güncelleme
          const existingStockCardWarehouse =
            await prisma.stockCardWarehouse.findFirst({
              where: {
                stockCardId: product.stockCardId,
                warehouseId: data.warehouseId,
              },
              include: {
                stockCard: true,
              },
            });

          if (!existingStockCardWarehouse) {
            // Eğer stok kartı-depo ilişkisi yoksa yeni oluştur
            await prisma.stockCardWarehouse.create({
              data: {
                stockCardId: product.stockCardId,
                warehouseId: data.warehouseId,
                quantity: product.quantity,
              },
            });
          } else {
            // Varolan stok kartı-depo ilişkisini güncelle
            const newQuantity =
              existingStockCardWarehouse.quantity.toNumber() + product.quantity;

            await prisma.stockCardWarehouse.update({
              where: {
                id: existingStockCardWarehouse.id,
              },
              data: {
                quantity: newQuantity,
              },
            });
          }

          const _productCode = await prisma.stockCard.findUnique({
            where: { id: product.stockCardId },
            select: { productCode: true },
          });
          const _warehouseCode = await prisma.warehouse.findUnique({
            where: { id: data.warehouseId },
            select: { warehouseCode: true },
          });

          await prisma.stockMovement.create({
            data: {
              documentType: "Order",
              invoiceType: "Other",
              movementType: "Devir",
              gcCode: "Giris",
              type: "Siparis Iade",
              description: "Siparis Iade Girisi",
              quantity: product.quantity,
              stockCard: {
                connect: { productCode: _productCode?.productCode },
              },
              warehouse: {
                connect: { warehouseCode: _warehouseCode?.warehouseCode },
              },
              branch: {
                connect: { branchCode: data.branchCode },
              },
            },
          });
        }

        // CurrentMovement oluştur
        const _current = await prisma.current.findUnique({
          where: { id: data.currentId },
          select: { currentName: true },
        });

        const currentMovement = await prisma.currentMovement.create({
          data: {
            current: {
              connect: { id: data.currentId },
            },
            documentType: "Muhtelif",
            movementType: "Alacak",
            debtAmount: 0,
            creditAmount: totalAmount,
            createdByUser: {
              connect: { username: username },
            },
            description: `Sipariş İade - ${_current?.currentName}`,
            branch: {
              connect: { branchCode: data.branchCode },
            },
            company: {
              connect: { companyCode: branch.companyCode },
            },
          },
        });

        const orderReturn = await prisma.orderPrepareWarehouse.create({
          data: {
            warehouse: {
              connect: { id: data.warehouseId },
            },
            createdByUser: {
              connect: { username: username },
            },
            current: {
              connect: { id: data.currentId },
            },
            currentMovement: {
              connect: { id: currentMovement.id },
            },
            status: "Returned",
          },
          include: {
            warehouse: true,
            current: true,
          },
        });

        // Receipt oluştur
        const receipt = await prisma.receipt.create({
          data: {
            receiptType: ReceiptType.Giris,
            documentNo: await generateDocumentNumber(prisma, "SI"),
            description: "Sipariş İade",
            branchCode: data.branchCode,
            createdBy: username,
            currentId: data.currentId,
            currentMovementId: currentMovement.id,
          },
        });

        // Receipt Details oluştur
        for (const detail of receiptDetails) {
          await prisma.receiptDetail.create({
            data: {
              receiptId: receipt.id,
              stockCardId: detail.stockCardId,
              quantity: new Prisma.Decimal(String(detail.quantity)),
              unitPrice: new Prisma.Decimal(String(detail.unitPrice)),
              totalPrice: new Prisma.Decimal(String(detail.total)),
              vatRate: new Prisma.Decimal(String(detail.vatRate)),
              discount: new Prisma.Decimal(String(detail.discount)),
              netPrice: new Prisma.Decimal(String(detail.netPrice)),
            },
          });
        }

        return orderReturn;
      });
      return result;
    } catch (error) {
      logger.error("Error returning order warehouse", error);
      throw error;
    }
  }

  async getAllReceipts(
    filters?: ReceiptFilters,
    pagination?: PaginationParams
  ): Promise<ReceiptResponse> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const skip = (page - 1) * limit;

      const where: Prisma.ReceiptWhereInput = {};

      if (filters?.startDate && filters?.endDate) {
        where.createdAt = {
          gte: filters.startDate,
          lte: filters.endDate,
        };
      }

      if (filters?.receiptType) {
        where.receiptType = filters.receiptType;
      }

      if (filters?.documentNo) {
        where.documentNo = {
          contains: filters.documentNo,
        };
      }

      if (filters?.currentId) {
        where.currentId = filters.currentId;
      }

      const total = await prisma.receipt.count({ where });

      const receipts = await prisma.receipt.findMany({
        where,
        include: {
          current: {
            select: {
              id: true,
              currentCode: true,
              currentName: true,
            },
          },
          receiptDetail: {
            include: {
              stockCard: {
                select: {
                  id: true,
                  productName: true,
                  productCode: true,
                },
              },
            },
          },
          createdByUser: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      });

      const formattedReceipts = receipts.map((receipt) => ({
        id: receipt.id,
        documentNo: receipt.documentNo,
        receiptType: receipt.receiptType,
        description: receipt.description,
        branchCode: receipt.branchCode,
        createdAt: receipt.createdAt,
        current: receipt.current
          ? {
              id: receipt.current.id,
              currentCode: receipt.current.currentCode,
              currentName: receipt.current.currentName,
            }
          : null,
        receiptDetail: receipt.receiptDetail?.map((detail) => ({
          id: detail.id,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          totalPrice: detail.totalPrice,
          stockCard: {
            id: detail.stockCard.id,
            productName: detail.stockCard.productName,
            productCode: detail.stockCard.productCode,
          },
        })),
        createdByUser: receipt.createdByUser
          ? {
              id: receipt.createdByUser.id,
              username: receipt.createdByUser.username,
              firstName: receipt.createdByUser.firstName,
              lastName: receipt.createdByUser.lastName,
            }
          : null,
      }));

      return {
        data: formattedReceipts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error("Error fetching all receipts", error);
      throw error;
    }
  }

  async getReceiptById(id: string): Promise<DetailedReceiptResponse> {
    try {
      const receipt = await prisma.receipt.findUnique({
        where: { id },
        include: {
          receiptDetail: {
            include: {
              stockCard: {
                select: {
                  id: true,
                  productName: true,
                  productCode: true,
                  unit: true,
                },
              },
            },
          },
          current: {
            include: {
              priceList: {
                select: {
                  id: true,
                  priceListName: true,
                  currency: true,
                  isVatIncluded: true,
                },
              },
            },
          },
          currentMovement: {
            select: {
              id: true,
              documentType: true,
              movementType: true,
              debtAmount: true,
              creditAmount: true,
              description: true,
            },
          },
          createdByUser: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!receipt) {
        throw new Error("Fiş bulunamadı");
      }

      const formattedReceipt: DetailedReceiptResponse = {
        id: receipt.id,
        documentNo: receipt.documentNo,
        receiptType: receipt.receiptType,
        description: receipt.description,
        branchCode: receipt.branchCode,
        createdAt: receipt.createdAt,
        current: receipt.current
          ? {
              id: receipt.current.id,
              currentCode: receipt.current.currentCode,
              currentName: receipt.current.currentName,
              priceList: receipt.current.priceList,
            }
          : null,
        receiptDetail: receipt.receiptDetail.map((detail) => ({
          id: detail.id,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          totalPrice: detail.totalPrice,
          vatRate: detail.vatRate,
          discount: detail.discount,
          netPrice: detail.netPrice,
          stockCard: {
            id: detail.stockCard.id,
            productName: detail.stockCard.productName,
            productCode: detail.stockCard.productCode,
            unit: detail.stockCard.unit,
          },
        })),
        currentMovement: receipt.currentMovement,
        createdByUser: receipt.createdByUser,
      };

      return formattedReceipt;
    } catch (error) {
      logger.error(`Error fetching receipt with id ${id}`, error);
      throw error;
    }
  }

  async deleteOrderPrepareWarehouseByReceiptId(
    receiptId: string
  ): Promise<any> {
    try {
      const result = await prisma.$transaction(async (prisma) => {
        // Önce fiş kaydını bul
        const receipt = await prisma.receipt.findUnique({
          where: { id: receiptId },
          include: {
            currentMovement: true,
          },
        });

        if (!receipt) {
          throw new Error("Fiş kaydı bulunamadı");
        }

        // Fiş üzerinden currentMovementId'yi al
        const currentMovementId = receipt.currentMovementId;

        if (!currentMovementId) {
          throw new Error("Cari hareket kaydı bulunamadı");
        }

        // CurrentMovement ile ilişkili OrderPrepareWarehouse kaydını bul
        const orderPrepare = await prisma.orderPrepareWarehouse.findFirst({
          where: { currentMovementId },
          include: {
            currentMovement: {
              include: {
                VaultMovement: true,
                BankMovement: true,
                PosMovement: true,
              },
            },
          },
        });

        if (!orderPrepare) {
          throw new Error("Sipariş hazırlama kaydı bulunamadı");
        }

        // Kasa hareketlerini sil
        await prisma.vaultMovement.deleteMany({
          where: { currentMovementId },
        });

        // Banka hareketlerini sil
        await prisma.bankMovement.deleteMany({
          where: { currentMovementId },
        });

        // POS hareketlerini sil
        await prisma.posMovement.deleteMany({
          where: { currentMovementId },
        });

        // Stok hareketlerini bul
        const stockMovements = await prisma.stockMovement.findMany({
          where: { documentNo: receipt.documentNo },
        });

        // Her bir stok hareketi için stok miktarlarını geri al
        for (const movement of stockMovements) {
          if (movement.gcCode === "Cikis") {
            // Çıkış yapılan ürünleri geri ekle
            await prisma.stockCardWarehouse.updateMany({
              where: {
                stockCardId: movement.productCode,
                warehouseId: movement.warehouseCode,
              },
              data: {
                quantity: {
                  increment: movement.quantity || 0,
                },
              },
            });
          } else if (movement.gcCode === "Giris") {
            // Giriş yapılan ürünleri çıkar
            await prisma.stockCardWarehouse.updateMany({
              where: {
                stockCardId: movement.productCode,
                warehouseId: movement.warehouseCode,
              },
              data: {
                quantity: {
                  decrement: movement.quantity || 0,
                },
              },
            });
          }
        }

        // Stok hareketlerini sil
        await prisma.stockMovement.deleteMany({
          where: { documentNo: receipt.documentNo },
        });

        // Fiş detaylarını sil
        await prisma.receiptDetail.deleteMany({
          where: { receiptId },
        });

        // Fişi sil
        await prisma.receipt.delete({
          where: { id: receiptId },
        });

        // Cari hareketi sil
        await prisma.currentMovement.delete({
          where: { id: currentMovementId },
        });

        // Son olarak sipariş hazırlama kaydını sil
        return await prisma.orderPrepareWarehouse.delete({
          where: { id: orderPrepare.id },
        });
      });

      return result;
    } catch (error) {
      logger.error(
        "Error deleting order prepare warehouse by receipt id",
        error
      );
      throw error;
    }
  }

  async updateOrderPrepareWarehouseByReceiptId(
    receiptId: string,
    updateData: OrderPrepareWarehouse,
    bearerToken: string
  ): Promise<any> {
    try {
      const username = extractUsernameFromToken(bearerToken);
      const result = await prisma.$transaction(async (prisma) => {
        // Önce fiş kaydını bul
        const receipt = await prisma.receipt.findUnique({
          where: { id: receiptId },
          include: {
            currentMovement: true,
            receiptDetail: true,
          },
        });

        if (!receipt) {
          throw new Error("Fiş kaydı bulunamadı");
        }

        // Fiş üzerinden currentMovementId'yi al
        const currentMovementId = receipt.currentMovementId;

        if (!currentMovementId) {
          throw new Error("Cari hareket kaydı bulunamadı");
        }

        // CurrentMovement ile ilişkili OrderPrepareWarehouse kaydını bul
        const orderPrepare = await prisma.orderPrepareWarehouse.findFirst({
          where: { currentMovementId },
        });

        if (!orderPrepare) {
          throw new Error("Sipariş hazırlama kaydı bulunamadı");
        }

        // Cariye ait aktif fiyat listesini al
        const currentPriceList = await prisma.current.findFirst({
          where: {
            id: updateData.currentId,
          },
          include: {
            priceList: true,
          },
        });

        if (!currentPriceList) {
          throw new Error("Cariye tanımlı aktif fiyat listesi bulunamadı");
        }

        let totalAmount = 0;
        let receiptDetails = [];

        // Eski stok hareketlerini bul ve stok miktarlarını geri al
        const oldStockMovements = await prisma.stockMovement.findMany({
          where: { documentNo: receipt.documentNo },
        });

        for (const movement of oldStockMovements) {
          if (movement.gcCode === "Cikis") {
            // Eski çıkışları geri ekle
            await prisma.stockCardWarehouse.updateMany({
              where: {
                stockCardId: movement.productCode,
                warehouseId: movement.warehouseCode,
              },
              data: {
                quantity: {
                  increment: movement.quantity || 0,
                },
              },
            });
          }
        }

        // Eski stok hareketlerini sil
        await prisma.stockMovement.deleteMany({
          where: { documentNo: receipt.documentNo },
        });

        // Yeni ürünler için işlemler
        for (const product of updateData.products) {
          // Stok kartının fiyat listesindeki fiyatını al
          const stockCardPrice = await prisma.stockCardPriceListItems.findFirst(
            {
              where: {
                stockCardId: product.stockCardId,
                priceListId: currentPriceList.priceListId,
              },
            }
          );

          if (!stockCardPrice) {
            throw new Error(
              `${product.stockCardId} ID'li stok kartı için fiyat listesinde fiyat bulunamadı`
            );
          }

          const productUnitPrice = stockCardPrice.price.toNumber();
          const subtotal = productUnitPrice * product.quantity;
          const vatRate = stockCardPrice.vatRate || 0;
          const vatAmount = (subtotal * Number(vatRate)) / 100;
          const total = subtotal + vatAmount;

          totalAmount += total;

          receiptDetails.push({
            stockCardId: product.stockCardId,
            quantity: product.quantity,
            unitPrice: productUnitPrice,
            subtotal: subtotal,
            vatRate: vatRate,
            vatAmount: vatAmount,
            total: total,
            discount: 0,
            netPrice: productUnitPrice,
          });

          // Stok kontrolü ve güncelleme
          const existingStockCardWarehouse =
            await prisma.stockCardWarehouse.findFirst({
              where: {
                stockCardId: product.stockCardId,
                warehouseId: updateData.warehouseId,
              },
            });

          if (!existingStockCardWarehouse) {
            throw new Error(`Stok kartı bulunamadı: ${product.stockCardId}`);
          }

          const newQuantity =
            existingStockCardWarehouse.quantity.toNumber() - product.quantity;

          if (newQuantity < 0) {
            throw new Error(
              `Yetersiz stok. Stok kartı: ${product.stockCardId}, Mevcut: ${existingStockCardWarehouse.quantity}, İstenen: ${product.quantity}`
            );
          }

          await prisma.stockCardWarehouse.update({
            where: {
              id: existingStockCardWarehouse.id,
            },
            data: {
              quantity: newQuantity,
            },
          });

          const _productCode = await prisma.stockCard.findUnique({
            where: { id: product.stockCardId },
            select: { productCode: true },
          });

          const _warehouseCode = await prisma.warehouse.findUnique({
            where: { id: updateData.warehouseId },
            select: { warehouseCode: true },
          });

          // Yeni stok hareketi oluştur
          await prisma.stockMovement.create({
            data: {
              documentType: "Order",
              invoiceType: "Other",
              movementType: "Devir",
              gcCode: "Cikis",
              type: "Siparis Hazirlama",
              description: "Siparis Hazirlama Cikisi",
              quantity: product.quantity,
              stockCard: {
                connect: { productCode: _productCode?.productCode },
              },
              warehouse: {
                connect: { warehouseCode: _warehouseCode?.warehouseCode },
              },
              branch: {
                connect: { branchCode: updateData.branchCode },
              },
            },
          });
        }

        // Cari hareketi güncelle
        await prisma.currentMovement.update({
          where: { id: currentMovementId },
          data: {
            debtAmount: totalAmount,
            updatedBy: username,
          },
        });

        // Fiş detaylarını güncelle
        await prisma.receiptDetail.deleteMany({
          where: { receiptId },
        });

        for (const detail of receiptDetails) {
          await prisma.receiptDetail.create({
            data: {
              receiptId,
              stockCardId: detail.stockCardId,
              quantity: new Prisma.Decimal(String(detail.quantity)),
              unitPrice: new Prisma.Decimal(String(detail.unitPrice)),
              totalPrice: new Prisma.Decimal(String(detail.total)),
              vatRate: new Prisma.Decimal(String(detail.vatRate)),
              discount: new Prisma.Decimal(String(detail.discount)),
              netPrice: new Prisma.Decimal(String(detail.netPrice)),
            },
          });
        }

        // OrderPrepareWarehouse kaydını güncelle
        return await prisma.orderPrepareWarehouse.update({
          where: { id: orderPrepare.id },
          data: {
            warehouseId: updateData.warehouseId,
            currentId: updateData.currentId,
            updatedBy: username,
          },
        });
      });

      return result;
    } catch (error) {
      logger.error("Error updating order prepare warehouse", error);
      throw error;
    }
  }
}

export default WarehouseService;
