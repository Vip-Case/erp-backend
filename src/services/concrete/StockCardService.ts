import {
  Prisma,
  StockCard,
  StockCardBarcode,
  StockCardCategoryItem,
  StockCardPriceListItems,
  StockCardTaxRate,
  StockCardWarehouse,
  StockCardManufacturer,
  StockCardAttributeItems,
  StockCardEFatura,
  StockCardMarketNames,
  ProductType,
  StockUnits,
} from "@prisma/client";
import prisma from "../../config/prisma";
import logger from "../../utils/logger";
import { asyncHandler } from "../../utils/asyncHandler";
import { extractUsernameFromToken } from "./extractUsernameService";

interface SearchCriteria {
  query?: string; // Genel bir arama için
  productCode?: string;
  productName?: string;
  barcodes?: string;
  marketNames?: string;
  priceListBarcode?: string;
}

interface BulkPriceUpdateInput {
  priceListId: string;
  stockCardIds: string[];
  updateType: "PERCENTAGE" | "FIXED_AMOUNT" | "NEW_PRICE";
  value: number;
  roundingDecimal?: number;
  updateVatRate?: boolean;
  newVatRate?: number;
}

interface BulkPriceUpdateResult {
  success: boolean;
  updatedCount: number;
  failedCount: number;
  errors: Array<{ stockCardId: string; error: string }>;
}

interface StockBalanceReportFilter {
  startDate?: Date;
  endDate?: Date;
  productCode?: string;
}

interface StockBalanceReportResult {
  productCode: string;
  productName: string;
  warehouseName: string;
  inQuantity: number;
  outQuantity: number;
  currentStock: number;
  criticalStock: number | null;
}

interface MobileStockCardInput {
  productCode: string;
  productName: string;
  unit: StockUnits;
  productType: ProductType;
  barcodes: string[];
  maliyet: number;
  maliyetDoviz: string;
  priceListItems: Array<{
    priceListId: string;
    price: number;
    vatRate?: number;
  }>;
}

interface StockTurnoverReport {
  productCode: string;
  productName: string;
  currentStock: number;
  last90DaysOutQuantity: number;
  last30DaysOutQuantity: number;
  last7DaysOutQuantity: number;
  averageDailyOutQuantity: number;
  turnoverRate: number;
  isBelowCriticalLevel: boolean;
  criticalLevel: number | null;
  warehouseDetails: {
    warehouseName: string;
    currentStock: number;
    last30DaysOutQuantity: number;
  }[];
  movementAnalysis: {
    trend: "active" | "inactive";
    velocityChange: number;
    stockSufficiency: number;
  };
  periodComparison: {
    previousPeriodOut: number;
    changePercentage: number;
  };
}

interface StockTurnoverReportParams {
  startDate?: Date;
  endDate?: Date;
  warehouseId?: string;
  productCode?: string; // Stok kodu ile arama
  productName?: string; // Stok adı ile arama
  searchQuery?: string; // Genel arama (hem kod hem ad için)
  sortBy?: "turnoverRate" | "currentStock" | "last30DaysOutQuantity";
  sortDirection?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

interface UpdateCriticalStockAnalysisResult {
  stockCardId: string;
  productCode: string;
  productName: string;
  oldCriticalLevel: number | null;
  newCriticalLevel: number;
  reason: string;
  status: "updated" | "skipped" | "failed";
  message?: string;
}

interface UpdateCriticalStockSummary {
  totalAnalyzed: number;
  totalUpdated: number;
  totalSkipped: number;
  totalFailed: number;
  details: UpdateCriticalStockAnalysisResult[];
}

export class StockCardService {
  async createStockCard(
    stockCard: StockCard,
    warehouseIds: string[] | undefined,
    bearerToken: string
  ): Promise<StockCard> {
    try {
      if ((warehouseIds = undefined)) {
        const username = extractUsernameFromToken(bearerToken);
        const resultWithoutWarehouse = await prisma.stockCard.create({
          data: {
            ...stockCard,
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

            company: stockCard.companyCode
              ? {
                  connect: { companyCode: stockCard.companyCode },
                }
              : undefined,

            branch: stockCard.branchCode
              ? {
                  connect: { branchCode: stockCard.branchCode },
                }
              : undefined,

            brand: stockCard.brandId
              ? {
                  connect: { id: stockCard.brandId },
                }
              : undefined,
          } as Prisma.StockCardCreateInput,
        });
        return resultWithoutWarehouse;
      } else {
        const username = extractUsernameFromToken(bearerToken);
        const resultWithWarehouse = await prisma.stockCard.create({
          data: {
            ...stockCard,
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

            company: stockCard.companyCode
              ? {
                  connect: { companyCode: stockCard.companyCode },
                }
              : undefined,

            branch: stockCard.branchCode
              ? {
                  connect: { branchCode: stockCard.branchCode },
                }
              : undefined,

            brand: stockCard.brandId
              ? {
                  connect: { id: stockCard.brandId },
                }
              : undefined,

            // StockCardWarehouse Many-to-Many relation
            StockCardWarehouse:
              (warehouseIds ?? []).length > 0
                ? {
                    create: (warehouseIds ?? []).map((warehouseId) => ({
                      warehouse: { connect: { id: warehouseId } },
                    })),
                  }
                : undefined,
          } as Prisma.StockCardCreateInput,
        });
        return resultWithWarehouse;
      }
    } catch (error) {
      console.error("Error creating StockCard:", error);
      logger.error("Error creating StockCard:", error);
      throw new Error("Could not create StockCard");
    }
  }

  async updateStockCard(
    id: string,
    stockCard: Partial<StockCard>,
    bearerToken: string,
    warehouseIds?: string[]
  ): Promise<StockCard> {
    try {
      const username = extractUsernameFromToken(bearerToken);
      return await prisma.stockCard.update({
        where: { id },
        data: {
          ...stockCard,
          updatedByUser: {
            connect: {
              username: username,
            },
          },

          company: stockCard.companyCode
            ? {
                connect: { companyCode: stockCard.companyCode },
              }
            : undefined,

          branch: stockCard.branchCode
            ? {
                connect: { branchCode: stockCard.branchCode },
              }
            : undefined,

          brand: stockCard.brandId
            ? {
                connect: { brand: stockCard.brandId },
              }
            : undefined,

          // StockCardWarehouse Many-to-Many relation
          StockCardWarehouse:
            (warehouseIds ?? []).length > 0
              ? {
                  create: (warehouseIds ?? []).map((warehouseId) => ({
                    warehouse: { connect: { id: warehouseId } },
                  })),
                }
              : undefined,
        } as Prisma.StockCardUpdateInput,
      });
    } catch (error) {
      logger.error("Error updating StockCard:", error);
      throw new Error("Could not update StockCard");
    }
  }

  async deleteStockCard(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      await prisma.stockCard.delete({
        where: { id },
      });
      return { success: true, message: "StockCard successfully deleted" };
    } catch (error) {
      logger.error("Error deleting StockCard:", error);
      return { success: false, message: "Could not delete StockCard" };
    }
  }

  async getStockCardById(id: string): Promise<StockCard | null> {
    try {
      return await prisma.stockCard.findUnique({
        where: { id },
        include: {
          brand: true,
          branch: true,
          company: true,
        },
      });
    } catch (error) {
      logger.error("Error finding StockCard by ID:", error);
      throw new Error("Could not find StockCard by ID");
    }
  }

  async getAllStockCards(): Promise<StockCard[]> {
    try {
      return await prisma.stockCard.findMany({
        include: {
          brand: true,
          branch: true,
          company: true,
        },
      });
    } catch (error) {
      logger.error("Error finding all StockCards:", error);
      throw new Error("Could not find all StockCards");
    }
  }

  async getStockCardsWithFilters(
    filters: Partial<StockCard>
  ): Promise<StockCard[] | null> {
    try {
      return await prisma.stockCard.findMany({
        where: filters,
        include: {
          brand: true,
          branch: true,
          company: true,
        },
      });
    } catch (error) {
      logger.error("Error finding StockCards with filters:", error);
      throw new Error("Could not find StockCards with filters");
    }
  }

  createStockCardsWithRelations = asyncHandler(
    async (
      data: {
        stockCard: StockCard;
        attributes?: StockCardAttributeItems[];
        barcodes?: StockCardBarcode[];
        categoryItem?: StockCardCategoryItem[];
        priceListItems?: StockCardPriceListItems[];
        taxRates?: StockCardTaxRate[];
        stockCardWarehouse?: StockCardWarehouse[];
        eFatura?: StockCardEFatura[];
        manufacturers?: StockCardManufacturer[];
        marketNames?: StockCardMarketNames[];
      },
      bearerToken: string
    ) => {
      const result = await prisma.$transaction(
        async (prisma) => {
          const username = extractUsernameFromToken(bearerToken);
          console.log(data);

          const stockCard = await prisma.stockCard.create({
            data: {
              productCode: data.stockCard?.productCode,
              productName: data.stockCard?.productName,
              unit: data.stockCard?.unit,
              shortDescription: data.stockCard?.shortDescription,
              description: data.stockCard?.description,
              productType: data.stockCard?.productType,
              kdv: data.stockCard?.kdv,
              gtip: data.stockCard?.gtip,
              pluCode: data.stockCard?.pluCode,
              desi: data.stockCard?.desi,
              adetBoleni: data.stockCard?.adetBoleni,
              siraNo: data.stockCard?.siraNo,
              raf: data.stockCard?.raf,
              karMarji: data.stockCard?.karMarji,
              riskQuantities: data.stockCard?.riskQuantities,
              stockStatus: data.stockCard?.stockStatus,
              hasExpirationDate: data.stockCard?.hasExpirationDate,
              allowNegativeStock: data.stockCard?.allowNegativeStock,
              maliyet: data.stockCard?.maliyet,
              maliyetDoviz: data.stockCard?.maliyetDoviz,
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

              company: data.stockCard.companyCode
                ? {
                    connect: { companyCode: data.stockCard.companyCode },
                  }
                : undefined,

              branch: data.stockCard.branchCode
                ? {
                    connect: { branchCode: data.stockCard.branchCode },
                  }
                : undefined,

              brand: data.stockCard.brandId
                ? {
                    connect: { id: data.stockCard.brandId },
                  }
                : undefined,
            } as Prisma.StockCardCreateInput,
          });

          const stockCardId = stockCard.id;

          if (data.barcodes) {
            await Promise.all(
              data.barcodes.map((barcode) =>
                prisma.stockCardBarcode.create({
                  data: {
                    barcode: barcode.barcode,
                    stockCard: { connect: { id: stockCardId } },
                  },
                })
              )
            );
          }

          if (data.attributes) {
            await Promise.all(
              data.attributes.map((attribute) =>
                prisma.stockCardAttributeItems.create({
                  data: {
                    attribute: {
                      connect: { id: attribute.attributeId },
                    },
                    stockCard: { connect: { id: stockCardId } },
                  },
                })
              )
            );
          }

          if (data.categoryItem) {
            await Promise.all(
              data.categoryItem.map((categoryItem) =>
                prisma.stockCardCategoryItem.create({
                  data: {
                    stockCardCategory: {
                      connect: { id: categoryItem.categoryId },
                    },
                    stockCard: { connect: { id: stockCardId } },
                  },
                })
              )
            );
          }

          if (data.priceListItems) {
            await Promise.all(
              data.priceListItems.map((priceListItem) =>
                prisma.stockCardPriceListItems.create({
                  data: {
                    priceList: {
                      connect: { id: priceListItem.priceListId },
                    },
                    stockCard: { connect: { id: stockCardId } },
                    price: priceListItem.price ?? 0,
                    vatRate: priceListItem.vatRate ?? 0,
                    barcode: priceListItem.barcode,
                  },
                })
              )
            );
          }

          if (data.taxRates) {
            await Promise.all(
              data.taxRates.map((taxRate) =>
                prisma.stockCardTaxRate.create({
                  data: {
                    taxName: taxRate.taxName ?? "defaultTaxName", // Add this line
                    taxRate: taxRate.taxRate,
                    stockCard: { connect: { id: stockCardId } },
                  },
                })
              )
            );
          }

          if (data.eFatura && data.eFatura.length > 0) {
            const eFatura = data.eFatura[0]; // Artık sadece ilk elemanı alıyoruz çünkü one-to-one ilişki var
            await prisma.stockCardEFatura.create({
              data: {
                productCode: eFatura.productCode,
                productName: eFatura.productName,
                stockCard: { connect: { id: stockCardId } },
              },
            });
          }

          if (data.manufacturers) {
            await Promise.all(
              data.manufacturers.map((manufacturer) =>
                prisma.stockCardManufacturer.create({
                  data: {
                    productCode: manufacturer.productCode,
                    productName: manufacturer.productName,
                    barcode: manufacturer.barcode,
                    brandId: manufacturer.brandId,
                    currentId: manufacturer.currentId,
                    stockCardId: stockCardId,
                  },
                })
              )
            );
          }

          if (data.marketNames) {
            await Promise.all(
              data.marketNames.map((marketName) =>
                prisma.stockCardMarketNames.create({
                  data: {
                    marketName: marketName.marketName,
                    stockCardId: stockCardId,
                  },
                })
              )
            );
          }

          if (data.stockCardWarehouse) {
            await Promise.all(
              data.stockCardWarehouse.map((warehouse) =>
                prisma.stockCardWarehouse.create({
                  data: {
                    stockCard: { connect: { id: stockCardId } },
                    warehouse: { connect: { id: warehouse.warehouseId } },
                    quantity: warehouse?.quantity,
                  },
                })
              )
            );
          }
          const id = stockCard.id;
          return prisma.stockCard.findUnique({
            where: { id },
            include: {
              branch: true,
              company: true,
              barcodes: true,
              brand: true,
              stockCardAttributeItems: {
                include: {
                  attribute: true,
                },
              },
              stockCardEFatura: true,
              stockCardManufacturer: true,
              stockCardMarketNames: true,
              stockCardPriceLists: {
                include: {
                  priceList: true,
                },
              },
              stockCardWarehouse: {
                include: {
                  warehouse: true,
                },
              },
              taxRates: true,
              stockCardCategoryItem: {
                include: {
                  stockCardCategory: true,
                },
              },
            },
          });
        },
        { timeout: 30000 }
      );

      return result;
    }
  );

  updateStockCardsWithRelations = asyncHandler(
    async (
      _id: string,
      data: {
        stockCard: StockCard;
        attributes?: StockCardAttributeItems[];
        barcodes?: StockCardBarcode[];
        categoryItem?: StockCardCategoryItem[];
        priceListItems?: StockCardPriceListItems[];
        taxRates?: StockCardTaxRate[];
        stockCardWarehouse?: StockCardWarehouse[];
        eFatura?: StockCardEFatura[];
        manufacturers?: StockCardManufacturer[];
        marketNames?: StockCardMarketNames[];
      },
      bearerToken: string
    ) => {
      const result = await prisma.$transaction(async (prisma) => {
        const username = extractUsernameFromToken(bearerToken);
        // 1. StockCard'ı güncelle
        const updatedStockCard = await prisma.stockCard.update({
          where: { id: _id },
          data: {
            productName: data.stockCard.productName,
            unit: data.stockCard.unit,
            shortDescription: data.stockCard.shortDescription,
            description: data.stockCard.description,
            productType: data.stockCard.productType,
            kdv: data.stockCard.kdv,
            gtip: data.stockCard.gtip,
            pluCode: data.stockCard.pluCode,
            desi: data.stockCard.desi,
            adetBoleni: data.stockCard.adetBoleni,
            siraNo: data.stockCard.siraNo,
            raf: data.stockCard.raf,
            karMarji: data.stockCard.karMarji,
            riskQuantities: data.stockCard.riskQuantities,
            stockStatus: data.stockCard.stockStatus,
            hasExpirationDate: data.stockCard.hasExpirationDate,
            allowNegativeStock: data.stockCard.allowNegativeStock,
            maliyet: data.stockCard?.maliyet,
            maliyetDoviz: data.stockCard?.maliyetDoviz,
            updatedByUser: {
              connect: {
                username: username,
              },
            },
            brand: data.stockCard.brandId
              ? {
                  connect: { id: data.stockCard.brandId },
                }
              : undefined,
          } as Prisma.StockCardUpdateInput,
        });

        // 2. İlişkili verileri sil ve yeniden ekle

        // 2.1. Attributes (StockCardAttributeItems)
        await prisma.stockCardAttributeItems.deleteMany({
          where: { stockCardId: _id },
        });

        if (data.attributes && data.attributes.length > 0) {
          await prisma.stockCardAttributeItems.createMany({
            data: data.attributes.map((attr) => ({
              stockCardId: _id,
              attributeId: attr.attributeId,
            })),
          });
        }

        // 2.2. Barcodes (StockCardBarcode)
        await prisma.stockCardBarcode.deleteMany({
          where: { stockCardId: _id },
        });

        if (data.barcodes && data.barcodes.length > 0) {
          await prisma.stockCardBarcode.createMany({
            data: data.barcodes.map((barcode) => ({
              stockCardId: _id,
              barcode: barcode.barcode,
            })),
          });
        }

        // 2.3. Category Items (StockCardCategoryItem)
        await prisma.stockCardCategoryItem.deleteMany({
          where: { stockCardId: _id },
        });

        if (data.categoryItem && data.categoryItem.length > 0) {
          await prisma.stockCardCategoryItem.createMany({
            data: data.categoryItem.map((category) => ({
              stockCardId: _id,
              categoryId: category.categoryId,
            })),
          });
        }

        // 2.4. Market Names (StockCardMarketNames)
        await prisma.stockCardMarketNames.deleteMany({
          where: { stockCardId: _id },
        });

        if (data.marketNames && data.marketNames.length > 0) {
          await prisma.stockCardMarketNames.createMany({
            data: data.marketNames.map((marketName) => ({
              stockCardId: _id,
              marketName: marketName.marketName,
            })),
          });
        }

        // 3. İlişkili verileri `id` ile güncelle

        // 3.1. Price List Items (StockCardPriceListItems)
        if (data.priceListItems && data.priceListItems.length > 0) {
          const existingItems = await prisma.stockCardPriceListItems.findMany({
            where: { stockCardId: _id },
          });

          const existingItemIds = existingItems.map((item) => item.id);
          const incomingItemIds = data.priceListItems.map((item) => item.id);

          for (const item of data.priceListItems) {
            if (item.id) {
              await prisma.stockCardPriceListItems.upsert({
                where: { id: item.id },
                update: {
                  priceListId: item.priceListId,
                  price: item.price,
                  vatRate: item.vatRate,
                  barcode: item.barcode,
                },
                create: {
                  stockCardId: _id,
                  priceListId: item.priceListId,
                  price: item.price,
                  vatRate: item.vatRate,
                  barcode: item.barcode,
                },
              });
            } else {
              await prisma.stockCardPriceListItems.create({
                data: {
                  stockCardId: _id,
                  priceListId: item.priceListId,
                  price: item.price,
                  vatRate: item.vatRate,
                  barcode: item.barcode,
                },
              });
            }
          }

          // Delete items that are not in the incoming data
          const itemsToDelete = existingItemIds.filter(
            (id) => !incomingItemIds.includes(id)
          );
          await prisma.stockCardPriceListItems.deleteMany({
            where: { id: { in: itemsToDelete } },
          });
        }

        // 3.2. StockCardWarehouse
        if (data.stockCardWarehouse && data.stockCardWarehouse.length > 0) {
          for (const warehouseItem of data.stockCardWarehouse) {
            await prisma.stockCardWarehouse.upsert({
              where: {
                stockCardId_warehouseId: {
                  stockCardId: _id,
                  warehouseId: warehouseItem.warehouseId,
                },
              },
              update: {
                quantity: warehouseItem.quantity,
              },
              create: {
                stockCardId: _id,
                warehouseId: warehouseItem.warehouseId,
                quantity: warehouseItem.quantity,
              },
            });
          }
        }

        // 3.3. eFatura (StockCardEFatura)
        if (data.eFatura && data.eFatura.length > 0) {
          const eFatura = data.eFatura[0]; // Artık sadece ilk elemanı alıyoruz
          await prisma.stockCardEFatura.upsert({
            where: {
              stockCardId: _id,
            },
            update: {
              productCode: eFatura.productCode,
              productName: eFatura.productName,
            },
            create: {
              productCode: eFatura.productCode,
              productName: eFatura.productName,
              stockCard: { connect: { id: _id } },
            },
          });
        }

        // 3.4. Manufacturers (StockCardManufacturer)
        if (data.manufacturers && data.manufacturers.length > 0) {
          for (const manufacturer of data.manufacturers) {
            await prisma.stockCardManufacturer.upsert({
              where: { id: manufacturer.id },
              update: {
                productCode: manufacturer.productCode,
                productName: manufacturer.productName,
                barcode: manufacturer.barcode,
                brandId: manufacturer.brandId,
                currentId: manufacturer.currentId,
              },
              create: {
                stockCardId: _id,
                productCode: manufacturer.productCode,
                productName: manufacturer.productName,
                barcode: manufacturer.barcode,
                brandId: manufacturer.brandId,
                currentId: manufacturer.currentId,
              },
            });
          }
        }

        // 4. Güncellenmiş veriyi döndür
        return prisma.stockCard.findUnique({
          where: { id: _id },
          include: {
            branch: true,
            company: true,
            barcodes: true,
            brand: true,
            stockCardAttributeItems: {
              include: {
                attribute: true,
              },
            },
            stockCardEFatura: true,
            stockCardManufacturer: true,
            stockCardMarketNames: true,
            stockCardPriceLists: {
              include: {
                priceList: true,
              },
            },
            stockCardWarehouse: {
              include: {
                warehouse: true,
              },
            },
            taxRates: true,
            stockCardCategoryItem: {
              include: {
                stockCardCategory: true,
              },
            },
          },
        });
      });

      return result;
    }
  );

  async deleteStockCardsWithRelations(id: string): Promise<boolean> {
    try {
      return await prisma.$transaction(async (prisma) => {
        await prisma.stockCardBarcode.deleteMany({
          where: { stockCardId: id },
        });

        await prisma.stockCardAttributeItems.deleteMany({
          where: { stockCardId: id },
        });

        await prisma.stockCardCategoryItem.deleteMany({
          where: { stockCardId: id },
        });

        await prisma.stockCardPriceListItems.deleteMany({
          where: { stockCardId: id },
        });

        await prisma.stockCardTaxRate.deleteMany({
          where: { stockCardId: id },
        });

        await prisma.stockCardWarehouse.deleteMany({
          where: { stockCardId: id },
        });

        await prisma.stockCardEFatura.deleteMany({
          where: { stockCardId: id },
        });

        await prisma.stockCardManufacturer.deleteMany({
          where: { stockCardId: id },
        });

        await prisma.stockCardMarketNames.deleteMany({
          where: { stockCardId: id },
        });

        await prisma.stockCard.delete({
          where: { id },
        });

        return true;
      });
    } catch (error) {
      logger.error("Error deleting StockCard with relations:", error);
      throw new Error("Could not delete StockCard with relations");
    }
  }

  async deleteManyStockCardsWithRelations(ids: any[]): Promise<boolean> {
    try {
      const idList = ids.map((item) => item.id);
      console.log(idList);
      return await prisma.$transaction(
        async (prisma) => {
          await prisma.stockCardBarcode.deleteMany({
            where: { stockCardId: { in: idList } },
          });

          await prisma.stockCardAttributeItems.deleteMany({
            where: { stockCardId: { in: idList } },
          });

          await prisma.stockCardCategoryItem.deleteMany({
            where: { stockCardId: { in: idList } },
          });

          await prisma.stockCardPriceListItems.deleteMany({
            where: { stockCardId: { in: idList } },
          });

          await prisma.stockCardTaxRate.deleteMany({
            where: { stockCardId: { in: idList } },
          });

          await prisma.stockCardWarehouse.deleteMany({
            where: { stockCardId: { in: idList } },
          });

          await prisma.stockCardEFatura.deleteMany({
            where: { stockCardId: { in: idList } },
          });

          await prisma.stockCardManufacturer.deleteMany({
            where: { stockCardId: { in: idList } },
          });

          await prisma.stockCardMarketNames.deleteMany({
            where: { stockCardId: { in: idList } },
          });

          await prisma.stockCard.deleteMany({
            where: { id: { in: idList } },
          });

          return true;
        },
        { timeout: 3000 }
      );
    } catch (error) {
      logger.error("Error deleting many StockCards with relations:", error);
      throw new Error("Could not delete many StockCards with relations");
    }
  }

  async getStockCardsWithRelationsById(id: string): Promise<StockCard | null> {
    try {
      return await prisma.stockCard.findUnique({
        where: { id },
        include: {
          branch: true,
          company: true,
          barcodes: true,
          brand: true,
          stockCardAttributeItems: {
            include: {
              attribute: true,
            },
          },
          stockCardEFatura: true,
          stockCardManufacturer: true,
          stockCardMarketNames: true,
          stockCardPriceLists: {
            include: {
              priceList: true,
            },
          },
          stockCardWarehouse: {
            include: {
              warehouse: true,
            },
          },
          taxRates: true,
          stockCardCategoryItem: {
            include: {
              stockCardCategory: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error("Error finding StockCard with relations by ID:", error);
      throw new Error("Could not find StockCard with relations by ID");
    }
  }

  async getParentCategories(
    categoryId: string,
    categories: any[] = []
  ): Promise<any[]> {
    const category = await prisma.stockCardCategory.findUnique({
      where: { id: categoryId },
      include: { parentCategory: true },
    });

    if (!category) return categories;

    categories.push(category as any);

    if (category.parentCategoryId) {
      return this.getParentCategories(category.parentCategoryId, categories);
    } else {
      return categories;
    }
  }

  getAllStockCardsWithRelations = asyncHandler(
    async (): Promise<StockCard[]> => {
      const stockCards = await prisma.stockCard.findMany({
        orderBy: {
          productCode: "asc",
        },
        include: {
          barcodes: true,
          brand: true,
          stockCardAttributeItems: {
            include: {
              attribute: true,
            },
          },
          stockCardEFatura: true,
          stockCardManufacturer: {
            include: {
              brand: true,
              current: true,
            },
          },
          stockCardMarketNames: true,
          stockCardPriceLists: {
            include: {
              priceList: true,
            },
          },
          stockCardWarehouse: {
            include: {
              warehouse: true,
            },
          },
          taxRates: true,
          stockCardCategoryItem: {
            include: {
              stockCardCategory: true,
            },
          },
        },
      });

      for (const stockCard of stockCards) {
        for (const categoryItem of stockCard.stockCardCategoryItem) {
          (categoryItem as any).parentCategories =
            await this.getParentCategories(categoryItem.categoryId);
        }
      }

      return stockCards;
    }
  );

  searchStockCards = asyncHandler(async (criteria: SearchCriteria) => {
    const where: Prisma.StockCardWhereInput = {
      OR: [],
    };

    if (!where.OR) {
      where.OR = [];
    }

    // Eğer belirli kriterler sağlanmışsa, bunları ekle
    if (criteria.productCode) {
      where.OR.push({
        productCode: { contains: criteria.productCode, mode: "insensitive" },
      });
    }

    if (criteria.productName) {
      where.OR.push({
        productName: { contains: criteria.productName, mode: "insensitive" },
      });
    }

    if (criteria.barcodes) {
      where.OR.push({
        barcodes: {
          some: {
            barcode: { contains: criteria.barcodes, mode: "insensitive" },
          },
        },
      });
    }

    if (criteria.marketNames) {
      where.OR.push({
        stockCardMarketNames: {
          some: {
            marketName: { contains: criteria.marketNames, mode: "insensitive" },
          },
        },
      });
    }

    if (criteria.priceListBarcode) {
      where.OR.push({
        stockCardPriceLists: {
          some: {
            barcode: {
              contains: criteria.priceListBarcode,
              mode: "insensitive",
            },
          },
        },
      });
    }

    // Eğer hiçbir kriter belirtilmemişse, genel query'yi tüm alanlarda ara
    if (where.OR.length === 0 && criteria.query) {
      where.OR.push(
        { productCode: { contains: criteria.query, mode: "insensitive" } },
        { productName: { contains: criteria.query, mode: "insensitive" } },
        {
          barcodes: {
            some: {
              barcode: { contains: criteria.query, mode: "insensitive" },
            },
          },
        },
        {
          stockCardMarketNames: {
            some: {
              marketName: { contains: criteria.query, mode: "insensitive" },
            },
          },
        },
        {
          stockCardPriceLists: {
            some: {
              barcode: { contains: criteria.query, mode: "insensitive" },
            },
          },
        }
      );
    }

    // Eğer hem spesifik kriterler hem genel bir query yoksa, hata döndür
    if (where.OR.length === 0) {
      throw new Error(
        "En az bir arama kriteri veya genel bir sorgu belirtmelisiniz."
      );
    }

    const stockCards = await prisma.stockCard.findMany({
      where,
      include: {
        barcodes: true,
        brand: true,
        stockCardAttributeItems: {
          include: {
            attribute: true,
          },
        },
        stockCardEFatura: true,
        stockCardManufacturer: {
          include: {
            brand: true,
            current: true,
          },
        },
        stockCardMarketNames: true,
        stockCardPriceLists: {
          include: {
            priceList: true,
          },
        },
        stockCardWarehouse: {
          include: {
            warehouse: true,
          },
        },
        taxRates: true,
        stockCardCategoryItem: {
          include: {
            stockCardCategory: true,
          },
        },
      },
      orderBy: {
        productCode: "asc",
      },
    });

    return stockCards;
  });

  getStockCardsByWarehouseId = asyncHandler(async (warehouseId: string) => {
    const stockCards = await prisma.stockCard.findMany({
      where: {
        stockCardWarehouse: {
          some: {
            warehouseId,
          },
        },
      },
      include: {
        barcodes: true,
        brand: true,
        stockCardAttributeItems: {
          include: {
            attribute: true,
          },
        },
        stockCardEFatura: true,
        stockCardManufacturer: {
          include: {
            brand: true,
            current: true,
          },
        },
        stockCardMarketNames: true,
        stockCardPriceLists: {
          include: {
            priceList: true,
          },
        },
        stockCardWarehouse: {
          include: {
            warehouse: true,
          },
        },
        taxRates: true,
        stockCardCategoryItem: {
          include: {
            stockCardCategory: true,
          },
        },
      },
    });

    return stockCards;
  });

  searchStockCardsByWarehouseId = asyncHandler(
    async (warehouseId: string, criteria: SearchCriteria) => {
      const where: Prisma.StockCardWhereInput = {
        OR: [],
        stockCardWarehouse: {
          some: {
            warehouseId,
          },
        },
      };

      if (!where.OR) {
        where.OR = [];
      }

      // Eğer belirli kriterler sağlanmışsa, bunları ekle
      if (criteria.productCode) {
        where.OR.push({
          productCode: { contains: criteria.productCode, mode: "insensitive" },
        });
      }

      if (criteria.productName) {
        where.OR.push({
          productName: { contains: criteria.productName, mode: "insensitive" },
        });
      }

      if (criteria.barcodes) {
        where.OR.push({
          barcodes: {
            some: {
              barcode: { contains: criteria.barcodes, mode: "insensitive" },
            },
          },
        });
      }

      if (criteria.marketNames) {
        where.OR.push({
          stockCardMarketNames: {
            some: {
              marketName: {
                contains: criteria.marketNames,
                mode: "insensitive",
              },
            },
          },
        });
      }

      if (criteria.priceListBarcode) {
        where.OR.push({
          stockCardPriceLists: {
            some: {
              barcode: {
                contains: criteria.priceListBarcode,
                mode: "insensitive",
              },
            },
          },
        });
      }

      // Eğer hiçbir kriter belirtilmemişse, genel query'yi tüm alanlarda ara
      if (where.OR.length === 0 && criteria.query) {
        where.OR.push(
          { productCode: { contains: criteria.query, mode: "insensitive" } },
          { productName: { contains: criteria.query, mode: "insensitive" } },
          {
            barcodes: {
              some: {
                barcode: { contains: criteria.query, mode: "insensitive" },
              },
            },
          },
          {
            stockCardMarketNames: {
              some: {
                marketName: { contains: criteria.query, mode: "insensitive" },
              },
            },
          },
          {
            stockCardPriceLists: {
              some: {
                barcode: { contains: criteria.query, mode: "insensitive" },
              },
            },
          }
        );
      }

      // Eğer hem spesifik kriterler hem genel bir query yoksa, hata döndür
      if (where.OR.length === 0) {
        throw new Error(
          "En az bir arama kriteri veya genel bir sorgu belirtmelisiniz."
        );
      }

      const stockCards = await prisma.stockCard.findMany({
        where,
        include: {
          barcodes: true,
          brand: true,
          stockCardAttributeItems: {
            include: {
              attribute: true,
            },
          },
          stockCardEFatura: true,
          stockCardManufacturer: {
            include: {
              brand: true,
              current: true,
            },
          },
          stockCardMarketNames: true,
          stockCardPriceLists: {
            include: {
              priceList: true,
            },
          },
          stockCardWarehouse: {
            include: {
              warehouse: true,
            },
          },
          taxRates: true,
          stockCardCategoryItem: {
            include: {
              stockCardCategory: true,
            },
          },
        },
      });

      return stockCards;
    }
  );

  updateStockCardBarcodes = asyncHandler(
    async (data: { stockCardId: string; barcodes: string[] }) => {
      try {
        // Mevcut barkodları getir
        const existingBarcodes = await prisma.stockCardBarcode.findMany({
          where: { stockCardId: data.stockCardId },
        });

        const existingBarcodeValues = existingBarcodes.map((b) => b.barcode);
        const incomingBarcodes = data.barcodes;

        // Silinecek barkodları bul (mevcut olup gelen listede olmayanlar)
        const barcodesToDelete = existingBarcodeValues.filter(
          (barcode) => !incomingBarcodes.includes(barcode)
        );

        // Eklenecek barkodları bul (gelen listede olup mevcut olmayanlar)
        const barcodesToAdd = incomingBarcodes.filter(
          (barcode) => !existingBarcodeValues.includes(barcode)
        );

        // Transaction içinde işlemleri gerçekleştir
        return await prisma.$transaction(async (prisma) => {
          // Silinecek barkodları sil
          if (barcodesToDelete.length > 0) {
            await prisma.stockCardBarcode.deleteMany({
              where: {
                AND: [
                  { stockCardId: data.stockCardId },
                  { barcode: { in: barcodesToDelete } },
                ],
              },
            });
          }

          // Yeni barkodları ekle
          if (barcodesToAdd.length > 0) {
            await prisma.stockCardBarcode.createMany({
              data: barcodesToAdd.map((barcode) => ({
                stockCardId: data.stockCardId,
                barcode: barcode,
              })),
            });
          }

          // Güncellenmiş barkod listesini döndür
          return await prisma.stockCardBarcode.findMany({
            where: { stockCardId: data.stockCardId },
          });
        });
      } catch (error) {
        logger.error("Error updating StockCard barcodes:", error);
        throw new Error("Barkod güncellemesi sırasında bir hata oluştu");
      }
    }
  );

  getStockCardBarcodesBySearch = asyncHandler(async (searchTerm: string) => {
    try {
      // Önce stok kartını bul (productCode veya barkod ile)
      const stockCard = await prisma.stockCard.findFirst({
        where: {
          OR: [
            { productCode: searchTerm },
            { barcodes: { some: { barcode: searchTerm } } },
          ],
        },
        include: {
          barcodes: true,
        },
      });

      if (!stockCard) {
        throw new Error("Stok kartı bulunamadı");
      }

      // Barkodlar ve stok kartı bilgilerini birleştir
      return {
        stockCardId: stockCard.id,
        productCode: stockCard.productCode,
        productName: stockCard.productName,
        barcodes: stockCard.barcodes,
      };
    } catch (error) {
      logger.error("Error fetching StockCard barcodes:", error);
      throw new Error("Barkodlar getirilirken bir hata oluştu");
    }
  });

  bulkUpdatePrices = asyncHandler(
    async (
      data: BulkPriceUpdateInput,
      bearerToken: string
    ): Promise<BulkPriceUpdateResult> => {
      try {
        const username = extractUsernameFromToken(bearerToken);

        // Fiyat listesinin varlığını kontrol et
        const priceList = await prisma.stockCardPriceList.findUnique({
          where: { id: data.priceListId },
        });

        if (!priceList) {
          throw new Error("Fiyat listesi bulunamadı");
        }

        // Transaction içinde güncelleme işlemini gerçekleştir
        const result = await prisma.$transaction(async (prisma) => {
          const errors: Array<{ stockCardId: string; error: string }> = [];
          let updatedCount = 0;
          let failedCount = 0;

          // Mevcut fiyatları getir
          const existingPrices = await prisma.stockCardPriceListItems.findMany({
            where: {
              priceListId: data.priceListId,
              stockCardId: { in: data.stockCardIds },
            },
          });

          // Her bir stok kartı için işlem yap
          for (const stockCardId of data.stockCardIds) {
            try {
              const existingPrice = existingPrices.find(
                (p) => p.stockCardId === stockCardId
              );
              let newPrice = 0;

              if (existingPrice) {
                // Yeni fiyatı hesapla
                switch (data.updateType) {
                  case "PERCENTAGE":
                    newPrice =
                      Number(existingPrice.price) * (1 + data.value / 100);
                    break;
                  case "FIXED_AMOUNT":
                    newPrice = Number(existingPrice.price) + data.value;
                    break;
                  case "NEW_PRICE":
                    newPrice = data.value;
                    break;
                }

                // Yuvarlama işlemi
                if (data.roundingDecimal !== undefined) {
                  const multiplier = Math.pow(10, data.roundingDecimal);
                  newPrice = Math.round(newPrice * multiplier) / multiplier;
                }

                // Negatif fiyat kontrolü
                if (newPrice < 0) {
                  throw new Error("Fiyat negatif olamaz");
                }

                // Fiyat güncelleme
                await prisma.stockCardPriceListItems.update({
                  where: { id: existingPrice.id },
                  data: {
                    price: newPrice,
                    vatRate: data.updateVatRate ? data.newVatRate : undefined,
                  },
                });

                updatedCount++;
              } else {
                // Yeni fiyat kaydı oluştur
                await prisma.stockCardPriceListItems.create({
                  data: {
                    stockCardId,
                    priceListId: data.priceListId,
                    price: data.updateType === "NEW_PRICE" ? data.value : 0,
                    vatRate: data.updateVatRate ? data.newVatRate : null,
                  },
                });
                updatedCount++;
              }
            } catch (error: any) {
              errors.push({
                stockCardId,
                error: error.message || "Bilinmeyen hata",
              });
              failedCount++;
              logger.error(
                `Error updating price for stock card ${stockCardId}:`,
                error
              );
            }
          }

          return {
            success: failedCount === 0,
            updatedCount,
            failedCount,
            errors,
          };
        });

        return result;
      } catch (error: any) {
        logger.error("Error in bulk price update:", error);
        throw new Error(
          `Toplu fiyat güncellemesi sırasında hata oluştu: ${error.message}`
        );
      }
    }
  );

  getStockBalanceReport = asyncHandler(
    async (
      filter: StockBalanceReportFilter
    ): Promise<StockBalanceReportResult[]> => {
      try {
        // Stok kartlarını getir
        const stockCardsQuery = filter.productCode
          ? prisma.stockCard.findMany({
              where: { productCode: filter.productCode },
              orderBy: { productCode: "asc" },
              include: {
                stockCardWarehouse: {
                  include: {
                    warehouse: true,
                  },
                },
              },
            })
          : prisma.stockCard.findMany({
              orderBy: { productCode: "asc" },
              include: {
                stockCardWarehouse: {
                  include: {
                    warehouse: true,
                  },
                },
              },
            });

        const stockCards = await stockCardsQuery;

        // Stok hareketlerini getir
        const movementsQuery = {
          where: {
            ...(filter.productCode && { productCode: filter.productCode }),
            ...(filter.startDate && { createdAt: { gte: filter.startDate } }),
            ...(filter.endDate && { createdAt: { lte: filter.endDate } }),
          },
        };

        const movements = await prisma.stockMovement.findMany(movementsQuery);

        // Sonuçları hazırla
        const results: StockBalanceReportResult[] = [];

        for (const stockCard of stockCards) {
          // Her depo için ayrı kayıt oluştur
          for (const stockWarehouse of stockCard.stockCardWarehouse) {
            // Depo bazında giriş/çıkış miktarlarını hesapla
            const warehouseMovements = movements.filter(
              (m) =>
                m.productCode === stockCard.productCode &&
                m.warehouseCode === stockWarehouse.warehouse.warehouseCode
            );

            const inQuantity = warehouseMovements
              .filter((m) => m.gcCode === "Giris")
              .reduce((sum, m) => sum + (m.quantity?.toNumber() || 0), 0);

            const outQuantity = warehouseMovements
              .filter((m) => m.gcCode === "Cikis")
              .reduce((sum, m) => sum + (m.quantity?.toNumber() || 0), 0);

            results.push({
              productCode: stockCard.productCode,
              productName: stockCard.productName,
              warehouseName: stockWarehouse.warehouse.warehouseName,
              inQuantity: inQuantity,
              outQuantity: outQuantity,
              currentStock: stockWarehouse.quantity.toNumber(),
              criticalStock: stockCard.riskQuantities?.toNumber() || null,
            });
          }
        }

        return results;
      } catch (error) {
        logger.error("Error generating stock balance report:", error);
        throw new Error("Stok bakiye raporu oluşturulurken bir hata oluştu");
      }
    }
  );

  async updateCriticalStock(
    stockCardId: string,
    criticalStock: number
  ): Promise<StockCard> {
    try {
      return await prisma.stockCard.update({
        where: { id: stockCardId },
        data: {
          riskQuantities: criticalStock,
        },
      });
    } catch (error) {
      logger.error("Kritik stok seviyesi güncellenirken hata oluştu:", error);
      throw new Error("Kritik stok seviyesi güncellenemedi");
    }
  }

  async updateCriticalStockForAnalyze(
    productCode: string,
    criticalStock: number
  ): Promise<StockCard> {
    try {
      return await prisma.stockCard.update({
        where: { productCode: productCode },
        data: {
          riskQuantities: criticalStock,
        },
      });
    } catch (error) {
      logger.error("Kritik stok seviyesi güncellenirken hata oluştu:", error);
      throw new Error("Kritik stok seviyesi güncellenemedi");
    }
  }

  async createStockCardFromMobile(
    data: MobileStockCardInput,
    bearerToken: string
  ): Promise<StockCard> {
    try {
      const username = extractUsernameFromToken(bearerToken);

      const result = await prisma.$transaction(async (prisma) => {
        // 1. Ana stok kartını oluştur
        const stockCard = await prisma.stockCard.create({
          data: {
            productCode: data.productCode,
            productName: data.productName,
            unit: data.unit,
            productType: data.productType,
            maliyet: data.maliyet,
            maliyetDoviz: data.maliyetDoviz,
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
          },
        });

        // 2. Barkodları ekle
        if (data.barcodes && data.barcodes.length > 0) {
          await prisma.stockCardBarcode.createMany({
            data: data.barcodes.map((barcode) => ({
              stockCardId: stockCard.id,
              barcode: barcode,
            })),
          });
        }

        // 3. Fiyat listesi kalemlerini ekle
        if (data.priceListItems && data.priceListItems.length > 0) {
          await prisma.stockCardPriceListItems.createMany({
            data: data.priceListItems.map((item) => ({
              stockCardId: stockCard.id,
              priceListId: item.priceListId,
              price: item.price,
              vatRate: item.vatRate ?? null,
            })),
          });
        }

        // 4. Oluşturulan stok kartını tüm ilişkileriyle birlikte getir
        const result = await prisma.stockCard.findUnique({
          where: { id: stockCard.id },
          include: {
            barcodes: true,
            stockCardPriceLists: {
              include: {
                priceList: true,
              },
            },
          },
        });

        if (!result) {
          throw new Error("Stok kartı oluşturuldu fakat getirilemedi");
        }

        return result;
      });

      return result;
    } catch (error) {
      logger.error("Mobil uygulamadan stok kartı oluşturulurken hata:", error);
      throw new Error("Stok kartı oluşturulamadı");
    }
  }

  async getStockTurnoverReport(
    params?: StockTurnoverReportParams
  ): Promise<StockTurnoverReport[]> {
    try {
      // Tarih aralıklarını hesapla
      const endDate = params?.endDate || new Date();

      // Son 90, 30 ve 7 gün için tarihleri hesapla
      const last90Days = new Date(endDate);
      last90Days.setDate(last90Days.getDate() - 90);

      const last30Days = new Date(endDate);
      last30Days.setDate(last30Days.getDate() - 30);

      const last7Days = new Date(endDate);
      last7Days.setDate(last7Days.getDate() - 7);

      // Önceki dönem için tarih
      const previousPeriodStart = new Date(
        last90Days.getTime() - 90 * 24 * 60 * 60 * 1000
      );

      // Arama koşullarını oluştur
      const searchConditions: Prisma.StockCardWhereInput = {
        AND: [
          // Stok kodu araması
          ...(params?.productCode
            ? [
                {
                  productCode: {
                    contains: params.productCode,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ]
            : []),
          // Stok adı araması
          ...(params?.productName
            ? [
                {
                  productName: {
                    contains: params.productName,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ]
            : []),
          // Genel arama (hem kod hem ad için)
          ...(params?.searchQuery
            ? [
                {
                  OR: [
                    {
                      productCode: {
                        contains: params.searchQuery,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                    {
                      productName: {
                        contains: params.searchQuery,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  ],
                },
              ]
            : []),
        ],
      };

      // Stok kartlarını ve ilişkili verileri getir
      const stockCards = await prisma.stockCard.findMany({
        where: searchConditions,
        include: {
          stockCardWarehouse: {
            include: {
              warehouse: true,
            },
          },
          stockMovement: {
            where: {
              AND: [
                { gcCode: "Cikis" },
                {
                  createdAt: {
                    gte: previousPeriodStart,
                    lte: endDate,
                  },
                },
                ...(params?.warehouseId
                  ? [{ warehouseCode: params.warehouseId }]
                  : []),
              ],
            },
          },
        },
      });

      // Rapor verilerini hazırla
      let report: StockTurnoverReport[] = await Promise.all(
        stockCards.map(async (card) => {
          // Toplam mevcut stok
          const currentStock = card.stockCardWarehouse.reduce(
            (sum, warehouse) => sum + Number(warehouse.quantity),
            0
          );

          // Çıkış miktarlarını hesapla
          const last90DaysOut = card.stockMovement
            .filter(
              (mov) => mov.createdAt >= last90Days && mov.createdAt <= endDate
            )
            .reduce((sum, mov) => sum + Number(mov.quantity || 0), 0);

          const last30DaysOut = card.stockMovement
            .filter(
              (mov) => mov.createdAt >= last30Days && mov.createdAt <= endDate
            )
            .reduce((sum, mov) => sum + Number(mov.quantity || 0), 0);

          const last7DaysOut = card.stockMovement
            .filter(
              (mov) => mov.createdAt >= last7Days && mov.createdAt <= endDate
            )
            .reduce((sum, mov) => sum + Number(mov.quantity || 0), 0);

          // Önceki dönem hareketlerini hesapla
          const previousPeriodOut = card.stockMovement
            .filter(
              (mov) =>
                mov.createdAt >= previousPeriodStart &&
                mov.createdAt < last90Days
            )
            .reduce((sum, mov) => sum + Number(mov.quantity || 0), 0);

          // Günlük ortalama çıkış hesapla (son 30 gün baz alınarak)
          const averageDailyOutQuantity = last30DaysOut / 30;

          // Stok devir hızı hesapla (30 günlük çıkış / Ortalama stok)
          const turnoverRate =
            currentStock > 0 ? last30DaysOut / currentStock : 0;

          // Kritik seviye kontrolü
          const criticalLevel = card.riskQuantities
            ? Number(card.riskQuantities)
            : null;
          const isBelowCriticalLevel =
            criticalLevel !== null && currentStock < criticalLevel;

          // Depo detaylarını hazırla
          const warehouseDetails = card.stockCardWarehouse.map((warehouse) => {
            const warehouseMovements = card.stockMovement.filter(
              (mov) =>
                mov.warehouseCode === warehouse.warehouse.warehouseCode &&
                mov.createdAt >= last30Days &&
                mov.createdAt <= endDate
            );

            const warehouseLast30DaysOut = warehouseMovements.reduce(
              (sum, mov) => sum + Number(mov.quantity || 0),
              0
            );

            return {
              warehouseName: warehouse.warehouse.warehouseName,
              currentStock: Number(warehouse.quantity),
              last30DaysOutQuantity: warehouseLast30DaysOut,
            };
          });

          // Hareket analizi
          const movementAnalysis = {
            trend:
              last7DaysOut > 0 ? ("active" as const) : ("inactive" as const),
            velocityChange: last7DaysOut / 7 - last30DaysOut / 30,
            stockSufficiency:
              averageDailyOutQuantity > 0
                ? currentStock / averageDailyOutQuantity
                : 0,
          };

          // Dönemsel karşılaştırma
          const periodComparison = {
            previousPeriodOut,
            changePercentage:
              previousPeriodOut > 0
                ? ((last90DaysOut - previousPeriodOut) / previousPeriodOut) *
                  100
                : 0,
          };

          return {
            productCode: card.productCode,
            productName: card.productName,
            currentStock,
            last90DaysOutQuantity: last90DaysOut,
            last30DaysOutQuantity: last30DaysOut,
            last7DaysOutQuantity: last7DaysOut,
            averageDailyOutQuantity,
            turnoverRate,
            isBelowCriticalLevel,
            criticalLevel,
            warehouseDetails,
            movementAnalysis,
            periodComparison,
          };
        })
      );

      // Sıralama işlemini uygula
      if (params?.sortBy) {
        report.sort((a, b) => {
          let valueA: number;
          let valueB: number;

          switch (params.sortBy) {
            case "turnoverRate":
              valueA = a.turnoverRate;
              valueB = b.turnoverRate;
              break;
            case "currentStock":
              valueA = a.currentStock;
              valueB = b.currentStock;
              break;
            case "last30DaysOutQuantity":
              valueA = a.last30DaysOutQuantity;
              valueB = b.last30DaysOutQuantity;
              break;
            default:
              valueA = 0;
              valueB = 0;
          }

          return params.sortDirection === "desc"
            ? valueB - valueA
            : valueA - valueB;
        });
      }

      // Sayfalama uygula
      if (params?.page && params?.pageSize) {
        const start = (params.page - 1) * params.pageSize;
        const end = start + params.pageSize;
        report = report.slice(start, end);
      }

      return report;
    } catch (error) {
      logger.error("Stok devir raporu oluşturulurken hata:", error);
      throw new Error("Stok devir raporu oluşturulamadı");
    }
  }

  async analyzeCriticalStockLevels(params: {
    minDays: number;
    maxDays: number;
    updateThreshold: number;
  }): Promise<UpdateCriticalStockSummary> {
    try {
      // Stok devir raporunu al
      const stockTurnoverReport = await this.getStockTurnoverReport();
      const results: UpdateCriticalStockAnalysisResult[] = [];

      for (const item of stockTurnoverReport) {
        try {
          // Hareket hızını kategorize et
          const movementCategory = this.categorizeMovement(item.turnoverRate);

          // Güvenlik gün sayısını belirle
          const securityDays = this.calculateSecurityDays(
            movementCategory,
            params.minDays,
            params.maxDays
          );

          // Trend faktörünü hesapla
          const trendFactor = this.calculateTrendFactor(
            item.movementAnalysis.velocityChange,
            item.periodComparison.changePercentage
          );

          // Yeni kritik stok seviyesini hesapla
          const newCriticalLevel = Math.ceil(
            item.averageDailyOutQuantity * securityDays * (1 + trendFactor)
          );

          // Mevcut kritik seviye ile karşılaştır
          const currentCriticalLevel = item.criticalLevel;
          const changePercentage = currentCriticalLevel
            ? Math.abs(
                ((newCriticalLevel - currentCriticalLevel) /
                  currentCriticalLevel) *
                  100
              )
            : 100;

          // Değişim yeterince büyükse güncelle
          if (changePercentage >= params.updateThreshold) {
            try {
              await this.updateCriticalStockForAnalyze(
                item.productCode,
                newCriticalLevel
              );

              results.push({
                stockCardId: item.productCode,
                productCode: item.productCode,
                productName: item.productName,
                oldCriticalLevel: currentCriticalLevel,
                newCriticalLevel,
                reason: `${movementCategory} hareket, ${
                  trendFactor > 0 ? "artan" : "azalan"
                } trend`,
                status: "updated",
                message: `Kritik stok seviyesi ${currentCriticalLevel} -> ${newCriticalLevel} olarak güncellendi`,
              });
            } catch (error) {
              results.push({
                stockCardId: item.productCode,
                productCode: item.productCode,
                productName: item.productName,
                oldCriticalLevel: currentCriticalLevel,
                newCriticalLevel,
                reason: `Güncelleme hatası`,
                status: "failed",
                message:
                  error instanceof Error ? error.message : "Bilinmeyen hata",
              });
            }
          } else {
            results.push({
              stockCardId: item.productCode,
              productCode: item.productCode,
              productName: item.productName,
              oldCriticalLevel: currentCriticalLevel,
              newCriticalLevel,
              reason: "Değişim eşik değerinin altında",
              status: "skipped",
              message: `Değişim oranı (${changePercentage.toFixed(
                2
              )}%) eşik değerinin (${params.updateThreshold}%) altında`,
            });
          }
        } catch (error) {
          results.push({
            stockCardId: item.productCode,
            productCode: item.productCode,
            productName: item.productName,
            oldCriticalLevel: item.criticalLevel,
            newCriticalLevel: 0,
            reason: "Analiz hatası",
            status: "failed",
            message: error instanceof Error ? error.message : "Bilinmeyen hata",
          });
        }
      }

      // Sonuçları özetle
      const summary: UpdateCriticalStockSummary = {
        totalAnalyzed: results.length,
        totalUpdated: results.filter((r) => r.status === "updated").length,
        totalSkipped: results.filter((r) => r.status === "skipped").length,
        totalFailed: results.filter((r) => r.status === "failed").length,
        details: results,
      };

      return summary;
    } catch (error) {
      logger.error("Kritik stok seviyesi analizi sırasında hata:", error);
      throw new Error("Kritik stok seviyesi analizi yapılamadı");
    }
  }

  private categorizeMovement(turnoverRate: number): "hızlı" | "orta" | "yavaş" {
    if (turnoverRate >= 1.5) return "hızlı";
    if (turnoverRate >= 0.5) return "orta";
    return "yavaş";
  }

  private calculateSecurityDays(
    movementCategory: "hızlı" | "orta" | "yavaş",
    minDays: number,
    maxDays: number
  ): number {
    switch (movementCategory) {
      case "hızlı":
        return Math.max(minDays, Math.min(14, maxDays));
      case "orta":
        return Math.max(minDays, Math.min(30, maxDays));
      case "yavaş":
        return Math.max(minDays, Math.min(45, maxDays));
    }
  }

  private calculateTrendFactor(
    velocityChange: number,
    periodChangePercentage: number
  ): number {
    // Hem hız değişimi hem de dönemsel değişimi değerlendir
    const trendScore =
      (velocityChange > 0 ? 1 : -1) + (periodChangePercentage > 0 ? 1 : -1);

    if (trendScore > 0) return 0.2; // Artan trend
    if (trendScore === 0) return 0.1; // Sabit trend
    return 0.05; // Azalan trend
  }
}

export default StockCardService;
