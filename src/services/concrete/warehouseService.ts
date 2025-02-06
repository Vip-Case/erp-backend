import prisma from "../../config/prisma";
import {
  Prisma,
  Warehouse,
  ReceiptType,
  StockTakeType,
  StockTakeStatus,
  StokManagementType,
  GCCode,
  DocumentType,
  InvoiceType,
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

export interface ReceiptFilters {
  startDate?: Date;
  endDate?: Date;
  createdAtFrom?: Date;
  receiptType?: ReceiptType;
  documentNo?: string;
  currentCode?: string;
  currentName?: string;
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
    outWarehouse: {
      id: string;
      warehouseCode: string;
      warehouseName: string;
    } | null;
    inWarehouse: {
      id: string;
      warehouseCode: string;
      warehouseName: string;
    } | null;
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
        unit: string;
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
  outWarehouse: {
    id: string;
    warehouseCode: string;
    warehouseName: string;
  } | null;
  inWarehouse: {
    id: string;
    warehouseCode: string;
    warehouseName: string;
  } | null;
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
      stockCardPriceLists: Array<{
        select: {
          id: string;
          price: Prisma.Decimal;
          vatRate: Prisma.Decimal;
          priceList: {
            select: {
              id: string;
              priceListName: string;
              currency: string;
              isVatIncluded: boolean;
            };
          };
        };
      }>;
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

export interface OrderWarehouseType {
  id: string;
  warehouseId: string;
  branchCode: string;
  currentId: string;
  orderType: "prepare" | "return";
  products: Array<{
    stockCardId: string;
    quantity: number;
  }>;
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
                type: "Stok Sayım Farkı",
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

      if (filters?.createdAtFrom) {
        where.createdAt =
          filters?.startDate && filters?.endDate
            ? {
                ...(where.createdAt as object),
                gte: filters.createdAtFrom,
              }
            : {
                gte: filters.createdAtFrom,
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

      if (filters?.currentCode) {
        where.current = {
          currentCode: filters.currentCode,
        };
      }

      if (filters?.currentName) {
        where.current = filters?.currentCode
          ? {
              ...(where.current as object),
              currentName: {
                contains: filters.currentName,
              },
            }
          : {
              currentName: {
                contains: filters.currentName,
              },
            };
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
          outReceiptWarehouse: {
            select: {
              id: true,
              warehouseCode: true,
              warehouseName: true,
            },
          },
          inReceiptWarehouse: {
            select: {
              id: true,
              warehouseCode: true,
              warehouseName: true,
            },
          },
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
        outWarehouse: receipt.outReceiptWarehouse
          ? {
              id: receipt.outReceiptWarehouse.id,
              warehouseCode: receipt.outReceiptWarehouse.warehouseCode,
              warehouseName: receipt.outReceiptWarehouse.warehouseName,
            }
          : null,
        inWarehouse: receipt.inReceiptWarehouse
          ? {
              id: receipt.inReceiptWarehouse.id,
              warehouseCode: receipt.inReceiptWarehouse.warehouseCode,
              warehouseName: receipt.inReceiptWarehouse.warehouseName,
            }
          : null,
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
            unit: detail.stockCard.unit,
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
                  stockCardPriceLists: {
                    select: {
                      id: true,
                      price: true,
                      vatRate: true,
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
          outReceiptWarehouse: {
            select: {
              id: true,
              warehouseCode: true,
              warehouseName: true,
            },
          },
          inReceiptWarehouse: {
            select: {
              id: true,
              warehouseCode: true,
              warehouseName: true,
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
        outWarehouse: receipt.outReceiptWarehouse
          ? {
              id: receipt.outReceiptWarehouse.id,
              warehouseCode: receipt.outReceiptWarehouse.warehouseCode,
              warehouseName: receipt.outReceiptWarehouse.warehouseName,
            }
          : null,
        inWarehouse: receipt.inReceiptWarehouse
          ? {
              id: receipt.inReceiptWarehouse.id,
              warehouseCode: receipt.inReceiptWarehouse.warehouseCode,
              warehouseName: receipt.inReceiptWarehouse.warehouseName,
            }
          : null,
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
            stockCardPriceLists: detail.stockCard.stockCardPriceLists.map(
              (priceList) => ({
                select: {
                  id: priceList.id,
                  price: priceList.price,
                  vatRate: priceList.vatRate || new Prisma.Decimal(0),
                  priceList: {
                    select: {
                      id: priceList.priceList.id,
                      priceListName: priceList.priceList.priceListName,
                      currency: priceList.priceList.currency,
                      isVatIncluded: priceList.priceList.isVatIncluded,
                    },
                  },
                },
              })
            ),
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

  async createOrderWarehouse(
    data: OrderWarehouseType,
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

        // Warehouse'dan warehouseCode'u al
        const warehouse = await prisma.warehouse.findUnique({
          where: { id: data.warehouseId },
          select: { warehouseCode: true },
        });

        if (!warehouse) {
          throw new Error("Depo bulunamadı");
        }

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

        let totalAmount = 0;
        let stockMovements = [];
        let receiptDetails = [];

        // Fiş numarasını önceden oluştur
        const documentNo = await generateDocumentNumber(
          prisma,
          data.orderType === "prepare" ? "SH" : "SI"
        );

        // Ürünleri işle ve stok kontrolü yap
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

          // Stok kartı ve depo bilgilerini al
          const stockCard = await prisma.stockCard.findUnique({
            where: { id: product.stockCardId },
          });

          const warehouse = await prisma.warehouse.findUnique({
            where: { id: data.warehouseId },
          });

          if (!stockCard || !warehouse) {
            throw new Error("Stok kartı veya depo bilgisi bulunamadı");
          }

          // Stok kontrolü ve güncelleme
          const existingStockCardWarehouse =
            await prisma.stockCardWarehouse.findFirst({
              where: {
                stockCardId: product.stockCardId,
                warehouseId: data.warehouseId,
              },
            });

          if (data.orderType === "prepare") {
            if (!existingStockCardWarehouse) {
              throw new Error(`Stok kartı bulunamadı: ${product.stockCardId}`);
            }

            const newQuantity =
              existingStockCardWarehouse.quantity.toNumber() - product.quantity;

            if (newQuantity < 0 && !stockCard.allowNegativeStock) {
              throw new Error(
                `Yetersiz stok. Stok kartı: ${stockCard.productCode}, Mevcut: ${existingStockCardWarehouse.quantity}, İstenen: ${product.quantity}`
              );
            }

            await prisma.stockCardWarehouse.update({
              where: { id: existingStockCardWarehouse.id },
              data: { quantity: newQuantity },
            });
          } else {
            if (!existingStockCardWarehouse) {
              await prisma.stockCardWarehouse.create({
                data: {
                  stockCardId: product.stockCardId,
                  warehouseId: data.warehouseId,
                  quantity: product.quantity,
                },
              });
            } else {
              await prisma.stockCardWarehouse.update({
                where: { id: existingStockCardWarehouse.id },
                data: {
                  quantity: {
                    increment: product.quantity,
                  },
                },
              });
            }
          }

          // Stok hareketi oluştur
          stockMovements.push({
            documentType: DocumentType.Order,
            invoiceType: InvoiceType.Other,
            movementType: "Devir" as StokManagementType,
            gcCode: data.orderType === "prepare" ? GCCode.Cikis : GCCode.Giris,
            type:
              data.orderType === "prepare"
                ? "Siparis Hazirlama"
                : "Siparis Iade",
            description:
              data.orderType === "prepare"
                ? "Siparis Hazirlama Cikisi"
                : "Siparis Iade Girisi",
            quantity: new Prisma.Decimal(String(product.quantity)),
            productCode: stockCard?.productCode || "",
            warehouseCode: warehouse?.warehouseCode || "",
            branchCode: data.branchCode,
            currentCode: currentPriceList.currentCode,
            receiptNo: documentNo,
            createdBy: username,
            updatedBy: username,
          });

          // Fiş detayı bilgilerini hazırla
          receiptDetails.push({
            stockCardId: product.stockCardId,
            quantity: product.quantity,
            unitPrice: productUnitPrice,
            totalPrice: total,
            vatRate: vatRate,
            discount: 0,
            netPrice: productUnitPrice,
          });
        }

        // Cari hareket oluştur
        const currentMovement = await prisma.currentMovement.create({
          data: {
            current: { connect: { id: data.currentId } },
            documentType: "Muhtelif",
            movementType: data.orderType === "prepare" ? "Borc" : "Alacak",
            debtAmount: data.orderType === "prepare" ? totalAmount : 0,
            creditAmount: data.orderType === "prepare" ? 0 : totalAmount,
            createdByUser: { connect: { username: username } },
            updatedByUser: { connect: { username: username } },
            description: `${
              data.orderType === "prepare"
                ? "Sipariş Hazırlama"
                : "Sipariş İade"
            }`,
            branch: { connect: { branchCode: data.branchCode } },
            company: { connect: { companyCode: branch.companyCode } },
          },
        });

        // Fiş oluştur
        const receipt = await prisma.receipt.create({
          data: {
            receiptType:
              data.orderType === "prepare"
                ? ReceiptType.Cikis
                : ReceiptType.Giris,
            documentNo: documentNo,
            description:
              data.orderType === "prepare"
                ? "Sipariş Hazırlama"
                : "Sipariş İade",
            branchCode: data.branchCode,
            createdBy: username,
            updatedBy: username,
            currentId: data.currentId,
            currentMovementId: currentMovement.id,
            ...(data.orderType === "prepare"
              ? { outWarehouse: warehouse.warehouseCode }
              : { inWarehouse: warehouse.warehouseCode }),
          },
        });

        // Stok hareketlerini oluştur
        for (const movement of stockMovements) {
          await prisma.stockMovement.create({
            data: movement,
          });
        }

        // Fiş detaylarını oluştur
        for (const detail of receiptDetails) {
          await prisma.receiptDetail.create({
            data: {
              receiptId: receipt.id,
              stockCardId: detail.stockCardId,
              quantity: new Prisma.Decimal(String(detail.quantity)),
              unitPrice: new Prisma.Decimal(String(detail.unitPrice)),
              totalPrice: new Prisma.Decimal(String(detail.totalPrice)),
              vatRate: new Prisma.Decimal(String(detail.vatRate)),
              discount: new Prisma.Decimal(String(detail.discount)),
              netPrice: new Prisma.Decimal(String(detail.netPrice)),
            },
          });
        }

        // OrderPrepareWarehouse kaydı oluştur
        return await prisma.orderPrepareWarehouse.create({
          data: {
            warehouse: { connect: { id: data.warehouseId } },
            current: { connect: { id: data.currentId } },
            currentMovement: { connect: { id: currentMovement.id } },
            createdByUser: { connect: { username: username } },
            updatedByUser: { connect: { username: username } },
            status: data.orderType === "return" ? "Returned" : undefined,
          },
          include: {
            warehouse: true,
            current: true,
            currentMovement: true,
          },
        });
      });

      return result;
    } catch (error) {
      logger.error("Error creating order warehouse", error);
      throw error;
    }
  }

  async deleteOrderWarehouseByReceiptId(receiptId: string): Promise<any> {
    try {
      const result = await prisma.$transaction(async (prisma) => {
        // Önce fiş kaydını bul
        const receipt = await prisma.receipt.findUnique({
          where: { id: receiptId },
          include: {
            currentMovement: true,
            receiptDetail: {
              include: {
                stockCard: true,
              },
            },
          },
        });

        if (!receipt) {
          throw new Error("Fiş kaydı bulunamadı");
        }

        // Stok hareketlerini bul
        const stockMovements = await prisma.stockMovement.findMany({
          where: { receiptNo: receipt.documentNo },
          include: {
            stockCard: true,
            warehouse: true,
          },
        });

        // Her bir stok hareketi için stok miktarlarını geri al
        for (const movement of stockMovements) {
          const existingStockCardWarehouse =
            await prisma.stockCardWarehouse.findFirst({
              where: {
                stockCardId: movement.stockCard.id,
                warehouseId: movement.warehouse.id,
              },
            });

          if (!existingStockCardWarehouse) {
            throw new Error(
              `Stok kartı-depo ilişkisi bulunamadı: ${movement.stockCard.productCode}`
            );
          }

          // Eğer çıkış hareketi ise geri iade et, giriş hareketi ise geri çık
          if (movement.gcCode === "Cikis") {
            await prisma.stockCardWarehouse.update({
              where: { id: existingStockCardWarehouse.id },
              data: {
                quantity: {
                  increment: movement.quantity || 0,
                },
              },
            });
          } else {
            await prisma.stockCardWarehouse.update({
              where: { id: existingStockCardWarehouse.id },
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
          where: { receiptNo: receipt.documentNo },
        });

        // Fiş detaylarını sil
        await prisma.receiptDetail.deleteMany({
          where: { receiptId },
        });

        // Kasa, banka ve POS hareketlerini sil
        await prisma.vaultMovement.deleteMany({
          where: { receiptId },
        });

        await prisma.bankMovement.deleteMany({
          where: { receiptId },
        });

        await prisma.posMovement.deleteMany({
          where: { receiptId },
        });

        // Fişi sil
        await prisma.receipt.delete({
          where: { id: receiptId },
        });

        // Cari hareketi sil
        if (receipt.currentMovementId) {
          await prisma.currentMovement.delete({
            where: { id: receipt.currentMovementId },
          });
        }

        // OrderPrepareWarehouse kaydını bul ve sil
        const orderWarehouse = await prisma.orderPrepareWarehouse.findFirst({
          where: { currentMovementId: receipt.currentMovementId },
        });

        if (orderWarehouse) {
          return await prisma.orderPrepareWarehouse.delete({
            where: { id: orderWarehouse.id },
          });
        }

        return { success: true, message: "Sipariş başarıyla silindi" };
      });

      return result;
    } catch (error) {
      logger.error("Error deleting order warehouse by receipt id", error);
      throw error;
    }
  }

  async updateOrderWarehouseByReceiptId(
    receiptId: string,
    data: OrderWarehouseType,
    bearerToken: string
  ): Promise<any> {
    try {
      await this.deleteOrderWarehouseByReceiptId(receiptId);
      const orderWarehouse = await this.createOrderWarehouse(data, bearerToken);
      return orderWarehouse;
    } catch (error) {
      logger.error("Error updating order warehouse", error);
      throw error;
    }
  }

  async convertOrderWarehouseToInvoice(ids: string[]): Promise<any> {
    try {
    } catch (error) {}
  }
}

export default WarehouseService;
