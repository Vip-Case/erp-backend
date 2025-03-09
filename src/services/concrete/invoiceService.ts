import {
  Invoice,
  InvoiceDetail,
  InvoiceType,
  Prisma,
  DocumentType,
} from "@prisma/client";
import prisma from "../../config/prisma";
import logger from "../../utils/logger";
import { BaseRepository } from "../../repositories/baseRepository";
import { time } from "console";
import { extractUsernameFromToken } from "./extractUsernameService";

export const InvoiceRelations = {
  invoiceDetail: true,
};

export interface InvoiceDetailResponse {
  // Temel Fatura Bilgileri
  id: string;
  invoiceNo: string;
  gibInvoiceNo: string;
  invoiceDate: string;
  paymentDate: string;
  paymentTerm: number;
  branchCode: string;
  warehouseId: string;
  description: string;
  invoiceType: InvoiceType;
  documentType: "Invoice" | "Order" | "Waybill";

  // Cari Bilgileri
  current: {
    id: string;
    currentCode: string;
    currentName: string;
    address?: string; // Adres alanı
    city?: string; // Şehir
    district?: string; // İlçe
    postcode?: string; // Posta Kodu
    country?: string; // Ülke
    email?: string; // E-posta
    phone?: string;
    priceList?: {
      id: string;
      priceListName: string;
      currency: string;
      isVatIncluded: boolean;
    };
  };

  // Ürün Detayları
  items: Array<{
    id: string;
    stockId: string | null;
    stockCode: string | null;
    stockName: string | null;
    quantity: number;
    unit: string;
    unitPrice: number;
    vatRate: number;
    vatAmount: number;
    totalAmount: number;
    priceListId: string | null;
    currency: string | null;
    isVatIncluded: boolean | undefined;
  }>;

  expenses: Array<{
    id: string;
    costCode: string;
    costName: string;
    price: number;
    currency: string;
  }>;

  // Ödeme Bilgileri
  payments: Array<{
    id: string;
    method: "cash" | "card" | "bank" | "openAccount";
    amount: number;
    accountId: string;
    currency: string;
    description?: string;
  }>;

  billingAddress?: {
    address: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
    fullName: string;
    email: string;
  };

  shippingAddress?: {
    address: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
    fullName: string;
    email: string;
  };

  // Toplam Değerler
  subtotal: number;
  totalVat: number;
  totalDiscount: number;
  total: number;
  totalPaid: number;
  totalDebt: number;

  // Diğer Bilgiler
  status: "draft" | "approved" | "cancelled";
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface QuickSaleResponse {
  id: string;
  date: string;
  subtotal: number;
  totalDiscount: number;
  totalVat: number;
  total: number;
  status: string;
  branchCode: string;
  warehouseId: string;
  customer: {
    id: string;
    name: string;
    code: string;
    taxNumber: string;
    taxOffice: string;
  };
  items: Array<{
    productId: string;
    name: string;
    code: string;
    barcode: string;
    quantity: number;
    unitPrice: number;
    discountRate: number;
    discountAmount: number;
    vatRate: number;
    vatAmount: number;
    totalAmount: number;
    unit: string;
    currency: string;
  }>;
  payments: Array<{
    method: string;
    amount: number;
    currency: string;
    accountId: string;
  }>;
}

export interface InvoiceInfo {
  id: string | null;
  invoiceNo: string;
  gibInvoiceNo: string | null;
  invoiceDate: Date;
  paymentDate: Date;
  paymentDay: number;
  branchCode: string;
  warehouseId: string;
  warehouseCode: string;
  description: string;
  currentCode: string;
  priceListId: string;
  totalAmount: number;
  totalVat: number;
  totalPaid: number;
  totalDebt: number;
  expenses: Expenses[] | null;
  items: InvoiceItems[] | null;
  payments: InvoicePayments[];
}

export interface InvoiceInfoForCancel {
  id: string;
  invoiceNo: string;
  gibInvoiceNo: string | null;
  invoiceDate: Date;
  paymentDate: Date;
  paymentDay: number;
  branchCode: string;
  warehouseId: string;
  warehouseCode: string;
  description: string;
  currentCode: string;
  priceListId: string;
  totalAmount: number;
  totalVat: number;
  totalPaid: number;
  totalDebt: number;
  expenses: Expenses[] | null;
  items: InvoiceItems[] | null;
  payments: InvoicePayments[];
}

export interface Expenses {
  id: string;
  costCode: string;
  costName: string;
  price: number;
  currency: string;
}

export interface InvoiceItems {
  stockCardId: string;
  costCode: string | null;
  costName: string | null;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  priceListId: string;
  currency: string | null;
}

export interface InvoicePayments {
  id: string; // Eklendi
  method: "cash" | "card" | "bank" | "openAccount";
  accountId: string;
  amount: number;
  currency: string;
  description?: string;
}

export class InvoiceService {
  private invoiceRepository = new BaseRepository<Invoice>(prisma.invoice);
  private invoiceDetailRepository = new BaseRepository<InvoiceDetail>(
    prisma.invoiceDetail
  );

  handleSerialToggle = async (checked: boolean) => {
    if (checked) {
      try {
        const lastInvoiceNo = await this.getLastInvoiceNoByType("Sales");

        // Extract components from the last invoice number
        const unitCode = "QRS";
        const currentYear = new Date().getFullYear().toString();
        const sequentialNumber = lastInvoiceNo.slice(-9)
          ? parseInt(lastInvoiceNo.slice(-9)) + 1
          : "000000001";

        // Generate new invoice number
        const newInvoiceNo = `${unitCode}${currentYear}${sequentialNumber
          .toString()
          .padStart(9, "0")}`;
        return newInvoiceNo;
      } catch (error) {
        logger.error("Error fetching last invoice number:", error);
        throw error;
      }
    }
  };

  async getAllInvoices(params?: {
    page?: number;
    limit?: number;
    orderBy?: {
      field: string;
      direction: "asc" | "desc";
    };
    filter?: {
      invoiceType?: InvoiceType | null;
      documentType?: DocumentType | null;
      startDate?: Date;
      endDate?: Date;
      currentCode?: string;
      currentName?: string;
      branchCode?: string;
    };
  }): Promise<{
    data: Invoice[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      orderBy = { field: "createdAt", direction: "desc" },
      filter,
    } = params || {};

    const where: Prisma.InvoiceWhereInput = {};

    // Filtreleri ekle
    if (filter) {
      if (filter.invoiceType) where.invoiceType = filter.invoiceType;
      if (filter.documentType) where.documentType = filter.documentType;
      if (filter.currentCode) where.currentCode = filter.currentCode;
      if (filter.branchCode) where.branchCode = filter.branchCode;
      if (filter.currentName) {
        where.current = {
          currentName: {
            contains: filter.currentName,
            mode: "insensitive",
          },
        };
      }
      if (filter.startDate || filter.endDate) {
        where.invoiceDate = {
          gte: filter.startDate,
          lte: filter.endDate,
        };
      }
    }

    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          current: {
            select: {
              currentCode: true,
              currentName: true,
            },
          },
          branch: {
            select: {
              branchCode: true,
              branchName: true,
            },
          },
          warehouse: {
            select: {
              warehouseCode: true,
              warehouseName: true,
            },
          },
          createdByUser: {
            select: {
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          [orderBy.field]: orderBy.direction,
        },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return {
      data: invoices,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    return this.invoiceRepository.findById(id);
  }

  async createPurchaseInvoiceWithRelations(
    data: InvoiceInfo,
    bearerToken: string
  ): Promise<any> {
    const username = extractUsernameFromToken(bearerToken);
    if (!data.invoiceNo || data.invoiceNo.trim() === "") {
      throw new Error("InvoiceNo is required and cannot be empty.");
    }
    const _companyCode = await prisma.company.findFirst({
      select: { companyCode: true },
    });

    const _warehouseCode = await prisma.warehouse.findUnique({
      where: { id: data.warehouseId },
      select: { warehouseCode: true },
    });
    try {
      const result = await prisma.$transaction(async (prisma) => {
        // 1. Ana fatura oluşturuluyor
        const newInvoice = await prisma.invoice.create({
          data: {
            invoiceNo: data.invoiceNo,
            gibInvoiceNo: data.gibInvoiceNo,
            invoiceDate: data.invoiceDate,
            invoiceType: "Purchase",
            documentType: "Invoice",
            current: { connect: { currentCode: data.currentCode } },
            company: _companyCode?.companyCode
              ? { connect: { companyCode: _companyCode.companyCode } }
              : undefined,
            branch: { connect: { branchCode: data.branchCode } },
            warehouse: {
              connect: { warehouseCode: _warehouseCode?.warehouseCode },
            },
            description: data.description,
            paymentDate: data.paymentDate,
            paymentDay: data.paymentDay,
            priceList: { connect: { id: data.priceListId } },
            totalAmount: data.totalAmount,
            totalVat: data.totalVat,
            totalPaid: data.totalPaid,
            totalDebt: data.totalDebt,
            totalBalance: data.totalAmount - data.totalPaid,
            totalDiscount: 0,
            totalNet: data.totalAmount - data.totalVat,
            createdByUser: { connect: { username: username } },
            updatedByUser: { connect: { username: username } },
          },
        });

        // 2. İlgili fatura detaylarını ve stok işlemlerini ekleme
        // Fatura detaylarını ekleme
        if (data.items) {
          for (const detail of data.items) {
            const _productCode = await prisma.stockCard.findUnique({
              where: { id: detail.stockCardId },
              select: { productCode: true },
            });
            await prisma.invoiceDetail.create({
              data: {
                invoiceId: newInvoice.id,
                productCode: _productCode?.productCode || "",
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
                vatRate: detail.vatRate,
                netPrice: detail.totalAmount - detail.vatAmount,
                totalPrice: detail.totalAmount,
                discount: 0,
              },
            });
          }
        }

        // 3. Masrafların fatura detaylarını ekleme
        if (data.expenses) {
          for (const detail of data.expenses) {
            await prisma.invoiceDetail.create({
              data: {
                invoiceId: newInvoice.id,
                costCode: detail.costCode,
                costName: detail.costName,
                currency: detail.currency,
                quantity: 1,
                totalPrice: detail.price,
                discount: 0,
              },
            });
          }
        }

        // 4. Alış işlemleri
        if (data.items) {
          for (const detail of data.items) {
            const stockCard = await prisma.stockCard.findUnique({
              where: { id: detail.stockCardId },
            });

            if (!stockCard) {
              throw new Error(
                `StockCard with ID '${detail.stockCardId}' does not exist.`
              );
            }

            const warehouse = await prisma.warehouse.findUnique({
              where: { id: data.warehouseId },
            });

            if (!warehouse) {
              throw new Error(
                `Warehouse with ID '${data.warehouseId}' does not exist.`
              );
            }

            const stockCardWarehouse =
              await prisma.stockCardWarehouse.findUnique({
                where: {
                  stockCardId_warehouseId: {
                    stockCardId: detail.stockCardId,
                    warehouseId: data.warehouseId,
                  },
                },
              });

            const productCode = stockCard.productCode;
            const quantity = detail.quantity;

            // Stok miktarını güncelleme

            if (stockCardWarehouse) {
              await prisma.stockCardWarehouse.update({
                where: { id: stockCardWarehouse.id },
                data: {
                  quantity: stockCardWarehouse.quantity.plus(quantity),
                },
              });
            } else {
              await prisma.stockCardWarehouse.create({
                data: {
                  stockCardId: stockCard.id,
                  warehouseId: warehouse.id,
                  quantity,
                },
              });
            }

            // StockMovement oluşturma
            await prisma.stockMovement.create({
              data: {
                productCode: productCode,
                warehouseCode: warehouse.warehouseCode,
                branchCode: data.branchCode,
                currentCode: data.currentCode,
                documentType: "Invoice",
                invoiceType: "Purchase",
                movementType: "AlisFaturasi",
                documentNo: newInvoice.invoiceNo,
                gcCode: "Giris",
                description: `${newInvoice.invoiceNo} no'lu alış faturası için stok hareketi`,
                quantity: quantity,
                unitPrice: detail.unitPrice,
                totalPrice: detail.totalAmount,
                unitOfMeasure: stockCard.unit,
                priceListId: detail.priceListId,
                createdBy: username,
                updatedBy: username,
              },
            });
          }
        }
        for (const payment of data.payments) {
          if (payment.method == "cash") {
            await prisma.vaultMovement.create({
              data: {
                invoiceId: newInvoice.id,
                vaultId: payment.accountId,
                description: `${newInvoice.invoiceNo} no'lu alış faturası için kasa hareketi`,
                entering: 0,
                emerging: payment.amount,
                vaultDirection: "Exit",
                vaultType: "PurchaseInvoicePayment",
                vaultDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.vault.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: payment.amount,
                },
              },
            });
          } else if (payment.method == "bank") {
            await prisma.bankMovement.create({
              data: {
                invoiceId: newInvoice.id,
                bankId: payment.accountId,
                description: `${newInvoice.invoiceNo} no'lu alış faturası için banka hareketi`,
                entering: 0,
                emerging: payment.amount,
                bankDirection: "Exit",
                bankType: "PurchaseInvoicePayment",
                bankDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.bank.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: payment.amount,
                },
              },
            });
          } else if (payment.method == "card") {
            await prisma.posMovement.create({
              data: {
                invoiceId: newInvoice.id,
                posId: payment.accountId,
                description: `${newInvoice.invoiceNo} no'lu alış faturası için pos hareketi`,
                entering: 0,
                emerging: payment.amount,
                posDirection: "Exit",
                posType: "PurchaseInvoicePayment",
                posDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.pos.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: payment.amount,
                },
              },
            });
          }
        }
        // data.paymensts içindeki tüm amount'ları topla
        const totalAmount = data.payments.reduce((sum, p) => sum + p.amount, 0);
        // data.paymensts içinden methodu openAccount olmayanları al ve amount'larını topla
        const totalPaid = data.payments
          .filter((p) => p.method !== "openAccount")
          .reduce((sum, p) => sum + p.amount, 0);
        await prisma.currentMovement.create({
          data: {
            currentCode: data.currentCode,
            dueDate: data.paymentDate,
            description: `${newInvoice.invoiceNo} no'lu alış faturası için cari hareket`,
            debtAmount: totalAmount,
            creditAmount: 0,
            movementType: "Borc",
            priceListId: data.priceListId,
            documentType: "Fatura",
            paymentType: "CokluOdeme",
            documentNo: newInvoice.invoiceNo,
            companyCode: _companyCode?.companyCode || "",
            branchCode: data.branchCode,
            createdBy: username,
            updatedBy: username,
          },
        });

        if (totalPaid > 0) {
          await prisma.currentMovement.create({
            data: {
              currentCode: data.currentCode,
              dueDate: data.paymentDate,
              description: `${newInvoice.invoiceNo} no'lu alış faturası için cari hareket`,
              debtAmount: 0,
              creditAmount: totalPaid,
              movementType: "Alacak",
              priceListId: data.priceListId,
              documentType: "Fatura",
              paymentType: "CokluOdeme",
              documentNo: newInvoice.invoiceNo,
              companyCode: _companyCode?.companyCode || "",
              branchCode: data.branchCode,
              createdBy: username,
              updatedBy: username,
            },
          });
        }
      });
      return result;
    } catch (error) {
      logger.error("Error creating purchase invoice with relations:", error);
      throw error;
    }
  }

  async createSalesInvoiceWithRelations(
    data: InvoiceInfo,
    bearerToken: string
  ): Promise<any> {
    const username = extractUsernameFromToken(bearerToken);
    if (!data.invoiceNo || data.invoiceNo.trim() === "") {
      throw new Error("InvoiceNo is required and cannot be empty.");
    }
    const _companyCode = await prisma.company.findFirst({
      select: { companyCode: true },
    });

    const _warehouseCode = await prisma.warehouse.findUnique({
      where: { id: data.warehouseId },
      select: { warehouseCode: true },
    });
    try {
      const result = await prisma.$transaction(async (prisma) => {
        // 1. Ana fatura oluşturuluyor
        const newInvoice = await prisma.invoice.create({
          data: {
            invoiceNo: data.invoiceNo,
            gibInvoiceNo: data.gibInvoiceNo,
            invoiceDate: data.invoiceDate,
            invoiceType: "Sales",
            documentType: "Invoice",
            current: { connect: { currentCode: data.currentCode } },
            company: _companyCode?.companyCode
              ? { connect: { companyCode: _companyCode.companyCode } }
              : undefined,
            branch: { connect: { branchCode: data.branchCode } },
            warehouse: {
              connect: { warehouseCode: _warehouseCode?.warehouseCode },
            },
            description: data.description,
            paymentDate: data.paymentDate,
            paymentDay: data.paymentDay,
            priceList: { connect: { id: data.priceListId } },
            totalAmount: data.totalAmount,
            totalVat: data.totalVat,
            totalPaid: data.totalPaid,
            totalDebt: data.totalDebt,
            totalBalance: data.totalAmount - data.totalPaid,
            totalDiscount: 0,
            totalNet: data.totalAmount - data.totalVat,
            createdByUser: { connect: { username: username } },
            updatedByUser: { connect: { username: username } },
          },
        });

        // 2. İlgili fatura detaylarını ve stok işlemlerini ekleme
        // Fatura detaylarını ekleme
        if (data.items) {
          for (const detail of data.items) {
            const _productCode = await prisma.stockCard.findUnique({
              where: { id: detail.stockCardId },
              select: { productCode: true },
            });
            await prisma.invoiceDetail.create({
              data: {
                invoiceId: newInvoice.id,
                productCode: _productCode?.productCode || "",
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
                vatRate: detail.vatRate,
                netPrice: detail.totalAmount - detail.vatAmount,
                totalPrice: detail.totalAmount,
                discount: 0,
              },
            });
          }
        }

        // 3. Masrafların fatura detaylarını ekleme
        if (data.expenses) {
          for (const detail of data.expenses) {
            await prisma.invoiceDetail.create({
              data: {
                invoiceId: newInvoice.id,
                costCode: detail.costCode,
                costName: detail.costName,
                currency: detail.currency,
                quantity: 1,
                totalPrice: detail.price,
                discount: 0,
              },
            });
          }
        }

        // 4. Satış işlemleri
        if (data.items) {
          for (const detail of data.items) {
            const stockCard = await prisma.stockCard.findUnique({
              where: { id: detail.stockCardId },
            });

            if (!stockCard) {
              throw new Error(
                `StockCard with ID '${detail.stockCardId}' does not exist.`
              );
            }

            const warehouse = await prisma.warehouse.findUnique({
              where: { id: data.warehouseId },
            });

            if (!warehouse) {
              throw new Error(
                `Warehouse with ID '${data.warehouseId}' does not exist.`
              );
            }

            const stockCardWarehouse =
              await prisma.stockCardWarehouse.findUnique({
                where: {
                  stockCardId_warehouseId: {
                    stockCardId: detail.stockCardId,
                    warehouseId: data.warehouseId,
                  },
                },
              });

            const productCode = stockCard.productCode;
            const quantity = detail.quantity;

            // Stok miktarını güncelleme

            if (stockCardWarehouse) {
              await prisma.stockCardWarehouse.update({
                where: { id: stockCardWarehouse.id },
                data: {
                  quantity: stockCardWarehouse.quantity.minus(quantity),
                },
              });
            } else {
              console.error(
                "Ürün'ün stoğu bulunamadı. Stoğu olmayan ürünün satışı yapılamaz."
              );
            }

            if (!_warehouseCode) {
              throw new Error("Warehouse code not found");
            }
            // Ensure warehouseCode exists before creating stockMovement
            const warehouseExists = await prisma.warehouse.findUnique({
              where: { warehouseCode: _warehouseCode.warehouseCode },
            });

            if (!warehouseExists) {
              throw new Error(
                `Warehouse with code ${_warehouseCode.warehouseCode} does not exist.`
              );
            }

            // StockMovement oluşturma
            await prisma.stockMovement.create({
              data: {
                productCode: productCode,
                warehouseCode: warehouse.warehouseCode,
                branchCode: data.branchCode,
                currentCode: data.currentCode,
                documentType: "Invoice",
                invoiceType: "Sales",
                movementType: "SatisFaturasi",
                documentNo: newInvoice.invoiceNo,
                gcCode: "Cikis",
                description: `${newInvoice.invoiceNo} no'lu satış faturası için stok hareketi`,
                quantity: quantity,
                unitPrice: detail.unitPrice,
                totalPrice: detail.totalAmount,
                unitOfMeasure: stockCard.unit, // Birim
                priceListId: detail.priceListId,
                createdBy: username,
                updatedBy: username,
              },
            });
          }
        }
        for (const payment of data.payments) {
          if (payment.method == "cash") {
            await prisma.vaultMovement.create({
              data: {
                invoiceId: newInvoice.id,
                vaultId: payment.accountId,
                description: `${newInvoice.invoiceNo} no'lu satış faturası için kasa hareketi`,
                entering: payment.amount,
                emerging: 0,
                vaultDirection: "Introduction",
                vaultType: "SalesInvoicePayment",
                vaultDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.vault.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: payment.amount,
                },
              },
            });
          } else if (payment.method == "bank") {
            await prisma.bankMovement.create({
              data: {
                invoiceId: newInvoice.id,
                bankId: payment.accountId,
                description: `${newInvoice.invoiceNo} no'lu satış faturası için banka hareketi`,
                entering: payment.amount,
                emerging: 0,
                bankDirection: "Introduction",
                bankType: "SalesInvoicePayment",
                bankDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.bank.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: payment.amount,
                },
              },
            });
          } else if (payment.method == "card") {
            await prisma.posMovement.create({
              data: {
                invoiceId: newInvoice.id,
                posId: payment.accountId,
                description: `${newInvoice.invoiceNo} no'lu satış faturası için pos hareketi`,
                entering: payment.amount,
                emerging: 0,
                posDirection: "Introduction",
                posType: "SalesInvoicePayment",
                posDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.pos.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: payment.amount,
                },
              },
            });
          }
        }
        // data.paymensts içindeki tüm amount'ları topla
        const totalAmount = data.payments.reduce((sum, p) => sum + p.amount, 0);
        // data.paymensts içinden methodu openAccount olmayanları al ve amount'larını topla
        const totalPaid = data.payments
          .filter((p) => p.method !== "openAccount")
          .reduce((sum, p) => sum + p.amount, 0);
        await prisma.currentMovement.create({
          data: {
            currentCode: data.currentCode,
            dueDate: data.paymentDate,
            description: `${newInvoice.invoiceNo} no'lu satış faturası için cari hareket`,
            debtAmount: totalAmount,
            creditAmount: 0,
            movementType: "Borc",
            priceListId: data.priceListId,
            documentType: "Fatura",
            paymentType: "CokluOdeme",
            documentNo: newInvoice.invoiceNo,
            companyCode: _companyCode?.companyCode || "",
            branchCode: data.branchCode,
            createdBy: username,
            updatedBy: username,
          },
        });

        if (totalPaid > 0) {
          await prisma.currentMovement.create({
            data: {
              currentCode: data.currentCode,
              dueDate: data.paymentDate,
              description: `${newInvoice.invoiceNo} no'lu satış faturası için cari hareket`,
              debtAmount: 0,
              creditAmount: totalPaid,
              movementType: "Alacak",
              priceListId: data.priceListId,
              documentType: "Fatura",
              paymentType: "CokluOdeme",
              documentNo: newInvoice.invoiceNo,
              companyCode: _companyCode?.companyCode || "",
              branchCode: data.branchCode,
              createdBy: username,
              updatedBy: username,
            },
          });
        }
      });
      return result;
    } catch (error) {
      logger.error("Error creating purchase invoice with relations:", error);
      throw error;
    }
  }

  async createQuickSaleInvoiceWithRelations(
    data: QuickSaleResponse,
    bearerToken: string
  ): Promise<any> {
    try {
      const username = extractUsernameFromToken(bearerToken);
      const result = await prisma.$transaction(async (prisma) => {
        let totalAmountt = data.payments.reduce((sum, p) => sum + p.amount, 0);
        // data.paymensts içinden methodu openAccount olmayanları al ve amount'larını topla
        let totalPaidd = data.payments
          .filter((p) => p.method !== "openAccount")
          .reduce((sum, p) => sum + p.amount, 0);
        totalAmountt = totalAmountt - totalPaidd;
        const _invoiceNo = await this.handleSerialToggle(true);
        // 1. Ana fatura oluşturuluyor
        const newInvoice = await prisma.invoice.create({
          data: {
            invoiceNo: _invoiceNo ?? data.id,
            invoiceDate: data.date,
            branch: { connect: { branchCode: data.branchCode } },
            warehouse: { connect: { id: data.warehouseId } },
            invoiceType: "Sales",
            documentType: "Order",
            current: { connect: { currentCode: data.customer.code } },
            totalAmount: data.total,
            totalVat: data.totalVat,
            totalDiscount: 0,
            totalNet: data.subtotal,
            totalPaid: totalPaidd,
            totalDebt: totalAmountt,
            description: `${_invoiceNo} no'lu hızlı satış faturası`,
            createdByUser: { connect: { username: username } },
            updatedByUser: { connect: { username: username } },
          },
        });

        // 2. İlgili fatura detaylarını ve stok işlemlerini ekleme
        // Fatura detaylarını ekleme
        for (const detail of data.items) {
          const _productCode = await prisma.stockCard.findUnique({
            where: { id: detail.productId },
            select: { productCode: true },
          });
          await prisma.invoiceDetail.create({
            data: {
              quantity: detail.quantity,
              unitPrice: detail.unitPrice,
              vatRate: parseFloat(detail.vatRate.toString()),
              netPrice: detail.totalAmount - detail.vatAmount,
              totalPrice: detail.totalAmount,
              discount: 0,
              invoice: { connect: { id: newInvoice.id } },
              stockCard: {
                connect: { productCode: _productCode?.productCode },
              },
            },
          });
        }

        // Satış işlemleri
        for (const detail of data.items) {
          const stockCard = await prisma.stockCard.findUnique({
            where: { id: detail.productId },
          });

          if (!stockCard) {
            throw new Error(
              `StockCard with ID '${detail.productId}' does not exist.`
            );
          }

          const stockCardWarehouse = await prisma.stockCardWarehouse.findUnique(
            {
              where: {
                stockCardId_warehouseId: {
                  stockCardId: detail.productId,
                  warehouseId: data.warehouseId,
                },
              },
            }
          );

          const _productCode = stockCard.productCode;
          const quantity = detail.quantity;

          // Stok miktarını güncelleme

          const stockWarehouse = await prisma.stockCardWarehouse.update({
            where: { id: stockCardWarehouse!.id },
            data: {
              quantity: stockCardWarehouse!.quantity.minus(quantity),
            },
          });

          // Ensure warehouseCode exists before creating stockMovement
          const warehouseExists = await prisma.warehouse.findUnique({
            where: { id: data.warehouseId },
          });

          if (!warehouseExists) {
            throw new Error(
              `Warehouse with code ${data.warehouseId} does not exist.`
            );
          }

          // StockMovement oluşturma
          await prisma.stockMovement.create({
            data: {
              productCode: _productCode,
              warehouseCode: warehouseExists.warehouseCode,
              branchCode: data.branchCode,
              currentCode: data.customer.code,
              documentType: "Order",
              invoiceType: "Sales",
              movementType: "HizliSatis",
              documentNo: newInvoice.invoiceNo,
              gcCode: "Cikis",
              description: `${newInvoice.invoiceNo} no'lu hızlı satış için stok hareketi`,
              quantity: quantity,
              unitPrice: detail.unitPrice,
              totalPrice: detail.totalAmount,
              unitOfMeasure: stockCard.unit, // Birim
              createdBy: username,
              updatedBy: username,
            },
          });
        }
        for (const payment of data.payments) {
          if (payment.method == "cash") {
            await prisma.vaultMovement.create({
              data: {
                invoiceId: newInvoice.id,
                vaultId: payment.accountId,
                description: `${newInvoice.invoiceNo} no'lu hızlı satış için kasa hareketi`,
                entering: payment.amount,
                emerging: 0,
                vaultDirection: "Introduction",
                vaultType: "SalesInvoicePayment",
                vaultDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.vault.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: payment.amount,
                },
              },
            });
          } else if (payment.method == "bank") {
            await prisma.bankMovement.create({
              data: {
                invoiceId: newInvoice.id,
                bankId: payment.accountId,
                description: `${newInvoice.invoiceNo} no'lu hızlı satış için banka hareketi`,
                entering: payment.amount,
                emerging: 0,
                bankDirection: "Introduction",
                bankType: "SalesInvoicePayment",
                bankDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.bank.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: payment.amount,
                },
              },
            });
          } else if (payment.method == "card") {
            await prisma.posMovement.create({
              data: {
                invoiceId: newInvoice.id,
                posId: payment.accountId,
                description: `${newInvoice.invoiceNo} no'lu hızlı satış için pos hareketi`,
                entering: payment.amount,
                emerging: 0,
                posDirection: "Introduction",
                posType: "SalesInvoicePayment",
                posDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.pos.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: payment.amount,
                },
              },
            });
          }
        }

        const _companyCode = await prisma.company.findFirst({
          select: { companyCode: true },
        });
        // data.paymensts içindeki tüm amount'ları topla
        const totalAmount = data.payments.reduce(
          (sum, p) => sum + (p.amount || 0),
          0
        );
        // data.paymensts içinden methodu openAccount olmayanları al ve amount'larını topla
        const totalPaid = data.payments
          .filter((p) => p.method !== "openAccount")
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        await prisma.currentMovement.create({
          data: {
            currentCode: data.customer.code,
            dueDate: new Date(),
            description: `${newInvoice.invoiceNo} no'lu satış faturası için cari hareket`,
            debtAmount: totalAmount,
            creditAmount: 0,
            movementType: "Borc",
            documentType: "Fatura",
            paymentType: "CokluOdeme",
            documentNo: newInvoice.invoiceNo,
            companyCode: _companyCode?.companyCode || "",
            branchCode: data.branchCode,
            createdBy: username,
            updatedBy: username,
          },
        });
        if (totalPaid > 0) {
          await prisma.currentMovement.create({
            data: {
              currentCode: data.customer.code,
              dueDate: new Date(),
              description: `${newInvoice.invoiceNo} no'lu satış faturası için cari hareket`,
              debtAmount: 0,
              creditAmount: totalPaid,
              movementType: "Alacak",
              documentType: "Fatura",
              paymentType: "CokluOdeme",
              documentNo: newInvoice.invoiceNo,
              companyCode: _companyCode?.companyCode || "",
              branchCode: data.branchCode,
              createdBy: username,
              updatedBy: username,
            },
          });
        }
      });
      return result;
    } catch (error) {
      logger.error("Error creating quick sale invoice with relations:", error);
      throw error;
    }
  }

  async getAllInvoicesWithRelations(): Promise<Invoice[]> {
    return await prisma.invoice.findMany({
      include: {
        invoiceDetail: true, // İlişkili detayları dahil et
      },
    });
  }

  // Belirli bir invoice'ı ID ile ilişkili detaylarla birlikte getirme
  async getInvoiceWithRelationsById(id: string): Promise<Invoice | null> {
    return await prisma.invoice.findUnique({
      where: { id },
      include: {
        invoiceDetail: true, // İlişkili detayları dahil et
      },
    });
  }

  async getLastInvoiceNoByType(invoiceType: string): Promise<string> {
    const lastInvoice = await prisma.invoice.findFirst({
      where: { invoiceType: invoiceType as Invoice["invoiceType"] },
      orderBy: { invoiceNo: "desc" },
    });

    if (lastInvoice) {
      return lastInvoice.invoiceNo;
    }

    return "";
  }

  async getInvoiceInfoById(id: string): Promise<InvoiceDetailResponse | null> {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        invoiceDetail: true,
        currentMovement: true,
        vaultMovement: true,
        BankMovement: true,
        PosMovement: true,
        current: true,
        priceList: true,
        warehouse: true,
        branch: true,
      },
    });

    if (!invoice) return null;

    const items = await Promise.all(
      invoice.invoiceDetail
        .filter((detail) => detail.productCode !== null)
        .map(async (detail) => {
          const stockCard = await prisma.stockCard.findUnique({
            where: { productCode: detail.productCode ?? "" },
          });
          return {
            id: detail.id,
            stockId: stockCard?.id ?? null,
            stockCode: stockCard?.productCode ?? null,
            stockName: stockCard?.productName ?? null,
            quantity: detail.quantity?.toNumber() ?? 0,
            unit: stockCard?.unit ?? "Adet", // Assuming unit is 'Adet', adjust as necessary
            unitPrice: detail.unitPrice?.toNumber() ?? 0,
            vatRate: detail.vatRate?.toNumber() ?? 0,
            vatAmount:
              (detail.totalPrice?.toNumber() ?? 0) -
              (detail.netPrice?.toNumber() ?? 0),
            totalAmount: detail.totalPrice?.toNumber() ?? 0,
            priceListId: invoice.priceListId ?? null,
            currency: invoice.priceList?.currency ?? null,
            isVatIncluded: invoice.priceList?.isVatIncluded,
          };
        })
    );

    const expenses = invoice.invoiceDetail.filter(
      (detail) => detail.costCode !== null
    );
    const expenseItems = expenses.map((detail) => ({
      id: detail.id,
      costCode: detail.costCode ?? "",
      costName: detail.costName ?? "",
      quantity: 1,
      price: detail.totalPrice?.toNumber() ?? 0,
      currency: detail.currency ?? "",
    }));

    const payments: InvoicePayments[] = [];

    if (invoice.vaultMovement) {
      payments.push(
        ...invoice.vaultMovement.map((payment) => ({
          id: payment.id,
          method: "cash" as const,
          accountId: payment.vaultId,
          amount:
            payment.entering.toNumber() === 0
              ? payment.emerging.toNumber()
              : payment.entering.toNumber(),
          currency: invoice.priceList?.currency ?? "",
          description: payment.description,
        }))
      );
    }

    if (invoice.BankMovement) {
      payments.push(
        ...invoice.BankMovement.map((payment) => ({
          id: payment.id,
          method: "bank" as const,
          accountId: payment.bankId,
          amount:
            payment.entering.toNumber() === 0
              ? payment.emerging.toNumber()
              : payment.entering.toNumber(),
          currency: invoice.priceList?.currency ?? "",
          description: payment.description,
        }))
      );
    }

    if (invoice.PosMovement) {
      payments.push(
        ...invoice.PosMovement.map((payment) => ({
          id: payment.id,
          method: "card" as const,
          accountId: payment.posId,
          amount:
            payment.entering.toNumber() === 0
              ? payment.emerging.toNumber()
              : payment.entering.toNumber(),
          currency: invoice.priceList?.currency ?? "",
          description: payment.description,
        }))
      );
    }

    if (invoice.currentMovement) {
      const debtAmount = invoice.currentMovement
        .filter((movement) => movement.movementType === "Borc")
        .reduce(
          (sum, movement) => sum + (movement.debtAmount?.toNumber() ?? 0),
          0
        );

      const creditAmount = invoice.currentMovement
        .filter((movement) => movement.movementType === "Alacak")
        .reduce(
          (sum, movement) => sum + (movement.creditAmount?.toNumber() ?? 0),
          0
        );

      if (debtAmount - creditAmount > 0) {
        payments.push({
          id: "",
          method: "openAccount",
          accountId: "",
          amount: debtAmount - creditAmount,
          currency: invoice.priceList?.currency ?? "",
          description: "",
        });
      }
    }

    const invoiceDetailResponse: InvoiceDetailResponse = {
      id: invoice.id,
      invoiceNo: invoice.invoiceNo,
      gibInvoiceNo: invoice.gibInvoiceNo ?? "",
      invoiceDate: invoice.invoiceDate?.toISOString() ?? "",
      paymentDate: invoice.paymentDate?.toISOString() ?? "",
      paymentTerm: invoice.paymentDay ?? 0,
      branchCode: invoice.branch?.branchCode ?? "",
      warehouseId: invoice.warehouse?.id ?? "",
      description: invoice.description ?? "",
      invoiceType: invoice.invoiceType ?? "Sales",
      documentType: "Invoice", // Assuming document type is 'Invoice', adjust as necessary
      subtotal: invoice.totalNet?.toNumber() ?? 0,
      totalVat: invoice.totalVat?.toNumber() ?? 0,
      totalDiscount: invoice.totalDiscount?.toNumber() ?? 0,
      total: invoice.totalAmount?.toNumber() ?? 0,
      totalPaid: invoice.totalPaid?.toNumber() ?? 0,
      totalDebt: invoice.totalDebt?.toNumber() ?? 0,
      status: invoice.canceledAt ? "cancelled" : "approved",
      createdAt: invoice.createdAt?.toISOString() ?? "",
      updatedAt: invoice.updatedAt?.toISOString() ?? "",
      current: {
        id: invoice.current?.id ?? "",
        currentCode: invoice.current?.currentCode ?? "",
        currentName: invoice.current?.currentName ?? "",
        priceList: invoice.priceList
          ? {
              id: invoice.priceList.id,
              priceListName: invoice.priceList.priceListName,
              currency: invoice.priceList.currency,
              isVatIncluded: invoice.priceList.isVatIncluded,
            }
          : undefined,
      },
      items,
      payments,
      expenses: expenseItems,
    };

    return invoiceDetailResponse;
  }

  async deleteSalesInvoiceWithRelationsAndRecreate(
    invoiceId: string,
    data: InvoiceInfo,
    bearerToken: string
  ): Promise<any> {
    if (!data.invoiceNo || data.invoiceNo.trim() === "") {
      throw new Error("InvoiceNo is required and cannot be empty.");
    }
    const _companyCode = await prisma.company.findFirst({
      select: { companyCode: true },
    });

    const _warehouseCode = await prisma.warehouse.findUnique({
      where: { id: data.warehouseId },
      select: { warehouseCode: true },
    });
    const username = extractUsernameFromToken(bearerToken);
    try {
      const result = await prisma.$transaction(async (prisma) => {
        await prisma.currentMovement.deleteMany({
          where: { documentNo: data.invoiceNo },
        });
        await prisma.stockMovement.deleteMany({
          where: { documentNo: data.invoiceNo },
        });
        for (const payment of data.payments) {
          if (payment.method == "cash") {
            await prisma.vaultMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.vault.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: payment.amount,
                },
              },
            });
          } else if (payment.method == "bank") {
            await prisma.bankMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.bank.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: payment.amount,
                },
              },
            });
          } else if (payment.method == "card") {
            await prisma.posMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.pos.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: payment.amount,
                },
              },
            });
          }
        }
        const oldInvoiceDetails = await prisma.invoiceDetail.findMany({
          where: { invoiceId: invoiceId },
        });
        for (const detail of oldInvoiceDetails) {
          if (!detail.productCode) {
            continue;
          }
          const stockCard = await prisma.stockCard.findUnique({
            where: { productCode: detail.productCode },
          });

          if (!stockCard) {
            throw new Error(
              `StockCard with ID '${detail.productCode}' does not exist.`
            );
          }

          const warehouse = await prisma.warehouse.findUnique({
            where: { id: data.warehouseId },
          });

          if (!warehouse) {
            throw new Error(
              `Warehouse with ID '${data.warehouseId}' does not exist.`
            );
          }

          const stockCardWarehouse = await prisma.stockCardWarehouse.findUnique(
            {
              where: {
                stockCardId_warehouseId: {
                  stockCardId: stockCard.id,
                  warehouseId: data.warehouseId,
                },
              },
            }
          );

          const productCode = stockCard.productCode;
          const quantity = detail.quantity;

          // Stok miktarını güncelleme

          if (stockCardWarehouse) {
            await prisma.stockCardWarehouse.update({
              where: { id: stockCardWarehouse.id },
              data: {
                quantity: {
                  increment: quantity ?? 0,
                },
              },
            });
          } else {
            await prisma.stockCardWarehouse.create({
              data: {
                stockCardId: stockCard.id,
                warehouseId: warehouse.id,
                quantity: new Prisma.Decimal(quantity ?? 0),
              },
            });
          }
        }
        await prisma.invoiceDetail.deleteMany({
          where: { invoiceId: invoiceId },
        });
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            invoiceNo: data.invoiceNo,
            gibInvoiceNo: data.gibInvoiceNo,
            invoiceDate: data.invoiceDate,
            invoiceType: "Sales",
            documentType: "Invoice",
            current: { connect: { currentCode: data.currentCode } },
            company: _companyCode?.companyCode
              ? { connect: { companyCode: _companyCode.companyCode } }
              : undefined,
            branch: data.branchCode
              ? { connect: { branchCode: data.branchCode } }
              : undefined,
            warehouse: _warehouseCode
              ? { connect: { warehouseCode: _warehouseCode.warehouseCode } }
              : undefined,
            description: data.description,
            paymentDate: data.paymentDate,
            paymentDay: data.paymentDay,
            priceList: { connect: { id: data.priceListId } },
            totalAmount: data.totalAmount,
            totalVat: data.totalVat,
            totalPaid: data.totalPaid,
            totalDebt: data.totalDebt,
            totalBalance: data.totalAmount - data.totalPaid,
            totalDiscount: 0,
            totalNet: data.totalAmount - data.totalVat,
            updatedByUser: { connect: { username: username } },
          },
        });
        // Fatura detaylarını ekleme
        if (data.items) {
          for (const detail of data.items) {
            const _productCode = await prisma.stockCard.findUnique({
              where: { id: detail.stockCardId },
              select: { productCode: true },
            });
            await prisma.invoiceDetail.create({
              data: {
                invoiceId: invoiceId,
                productCode: _productCode?.productCode || "",
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
                vatRate: detail.vatRate,
                netPrice: detail.totalAmount - detail.vatAmount,
                totalPrice: detail.totalAmount,
                discount: 0,
              },
            });
          }
        }

        if (data.expenses) {
          for (const detail of data.expenses) {
            await prisma.invoiceDetail.create({
              data: {
                invoiceId: invoiceId,
                costCode: detail.costCode,
                costName: detail.costName,
                currency: detail.currency,
                quantity: 1,
                totalPrice: detail.price,
                discount: 0,
              },
            });
          }
        }

        // Satış işlemleri
        if (data.items) {
          for (const detail of data.items) {
            const stockCard = await prisma.stockCard.findUnique({
              where: { id: detail.stockCardId },
            });

            if (!stockCard) {
              throw new Error(
                `StockCard with ID '${detail.stockCardId}' does not exist.`
              );
            }

            const warehouse = await prisma.warehouse.findUnique({
              where: { id: data.warehouseId },
            });

            if (!warehouse) {
              throw new Error(
                `Warehouse with ID '${data.warehouseId}' does not exist.`
              );
            }

            const stockCardWarehouse =
              await prisma.stockCardWarehouse.findUnique({
                where: {
                  stockCardId_warehouseId: {
                    stockCardId: stockCard.id,
                    warehouseId: data.warehouseId,
                  },
                },
              });

            const productCode = stockCard.productCode;
            const quantity = detail.quantity;

            // Stok miktarını güncelleme

            if (stockCardWarehouse) {
              await prisma.stockCardWarehouse.update({
                where: { id: stockCardWarehouse.id },
                data: {
                  quantity: {
                    decrement: quantity ?? 0,
                  },
                },
              });
            } else {
              console.error(
                "Ürün'ün stoğu bulunamadı. Stoğu olmayan ürünün satışı yapılamaz."
              );
            }

            if (!warehouse) {
              throw new Error(
                `Warehouse with ID '${data.warehouseId}' does not exist.`
              );
            }

            // Ensure warehouseCode exists before creating stockMovement
            const warehouseExists = await prisma.warehouse.findUnique({
              where: { warehouseCode: warehouse.warehouseCode },
            });

            if (!warehouseExists) {
              throw new Error(
                `Warehouse with code ${warehouse.warehouseCode} does not exist.`
              );
            }

            // StockMovement oluşturma
            await prisma.stockMovement.create({
              data: {
                productCode: productCode,
                warehouseCode: warehouse.warehouseCode,
                branchCode: data.branchCode,
                currentCode: data.currentCode,
                documentType: "Invoice",
                invoiceType: "Sales",
                movementType: "SatisFaturasi",
                documentNo: data.invoiceNo,
                gcCode: "Cikis",
                description: `${data.invoiceNo} no'lu satış faturası için stok hareketi`,
                quantity: quantity,
                unitPrice: detail.unitPrice,
                totalPrice: detail.totalAmount,
                unitOfMeasure: stockCard.unit, // Birim
                priceListId: detail.priceListId,
                createdBy: username,
                updatedBy: username,
              },
            });
          }
        }
        for (const payment of data.payments) {
          if (payment.method == "cash") {
            await prisma.vaultMovement.create({
              data: {
                invoiceId: invoiceId,
                vaultId: payment.accountId,
                description: `${data.invoiceNo} no'lu satış faturası için kasa hareketi`,
                entering: payment.amount,
                emerging: 0,
                vaultDirection: "Introduction",
                vaultType: "SalesInvoicePayment",
                vaultDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.vault.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: payment.amount,
                },
              },
            });
          } else if (payment.method == "bank") {
            await prisma.bankMovement.create({
              data: {
                invoiceId: invoiceId,
                bankId: payment.accountId,
                description: `${data.invoiceNo} no'lu satış faturası için banka hareketi`,
                entering: payment.amount,
                emerging: 0,
                bankDirection: "Introduction",
                bankType: "SalesInvoicePayment",
                bankDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.bank.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: payment.amount,
                },
              },
            });
          } else if (payment.method == "card") {
            await prisma.posMovement.create({
              data: {
                invoiceId: invoiceId,
                posId: payment.accountId,
                description: `${data.invoiceNo} no'lu satış faturası için pos hareketi`,
                entering: payment.amount,
                emerging: 0,
                posDirection: "Introduction",
                posType: "SalesInvoicePayment",
                posDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.pos.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: payment.amount,
                },
              },
            });
          }
        }
        // data.paymensts içindeki tüm amount'ları topla
        const totalAmount = data.payments.reduce((sum, p) => sum + p.amount, 0);
        // data.paymensts içinden methodu openAccount olmayanları al ve amount'larını topla
        const totalPaid = data.payments
          .filter((p) => p.method !== "openAccount")
          .reduce((sum, p) => sum + p.amount, 0);
        await prisma.currentMovement.create({
          data: {
            currentCode: data.currentCode,
            dueDate: data.paymentDate,
            description: `${data.invoiceNo} no'lu satış faturası için cari hareket`,
            debtAmount: totalAmount,
            creditAmount: 0,
            movementType: "Borc",
            priceListId: data.priceListId,
            documentType: "Fatura",
            paymentType: "CokluOdeme",
            documentNo: data.invoiceNo,
            companyCode: _companyCode?.companyCode || "",
            branchCode: data.branchCode,
            createdBy: username,
            updatedBy: username,
          },
        });

        if (totalPaid > 0) {
          await prisma.currentMovement.create({
            data: {
              currentCode: data.currentCode,
              dueDate: data.paymentDate,
              description: `${data.invoiceNo} no'lu satış faturası için cari hareket`,
              debtAmount: 0,
              creditAmount: totalPaid,
              movementType: "Alacak",
              priceListId: data.priceListId,
              documentType: "Fatura",
              paymentType: "CokluOdeme",
              documentNo: data.invoiceNo,
              companyCode: _companyCode?.companyCode || "",
              branchCode: data.branchCode,
              createdBy: username,
              updatedBy: username,
            },
          });
        }
      });
      return result;
    } catch (error) {
      console.error(error);
      logger.error(error);
      throw error;
    }
  }

  async deletePurchaseInvoiceWithRelationsAndRecreate(
    invoiceId: string,
    data: InvoiceInfo,
    bearerToken: string
  ): Promise<any> {
    const username = extractUsernameFromToken(bearerToken);
    if (!data.invoiceNo || data.invoiceNo.trim() === "") {
      throw new Error("InvoiceNo is required and cannot be empty.");
    }
    const _companyCode = await prisma.company.findFirst({
      select: { companyCode: true },
    });

    const _warehouseCode = await prisma.warehouse.findUnique({
      where: { id: data.warehouseId },
      select: { warehouseCode: true },
    });
    try {
      const result = await prisma.$transaction(async (prisma) => {
        await prisma.currentMovement.deleteMany({
          where: { documentNo: data.invoiceNo },
        });
        await prisma.stockMovement.deleteMany({
          where: { documentNo: data.invoiceNo },
        });
        for (const payment of data.payments) {
          if (payment.method == "cash") {
            await prisma.vaultMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.vault.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: payment.amount,
                },
              },
            });
          } else if (payment.method == "bank") {
            await prisma.bankMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.bank.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: payment.amount,
                },
              },
            });
          } else if (payment.method == "card") {
            await prisma.posMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.pos.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: payment.amount,
                },
              },
            });
          }
        }
        const oldInvoiceDetails = await prisma.invoiceDetail.findMany({
          where: { invoiceId: invoiceId },
        });
        for (const detail of oldInvoiceDetails) {
          if (!detail.productCode) {
            continue;
          }
          const stockCard = await prisma.stockCard.findUnique({
            where: { productCode: detail.productCode },
          });

          if (!stockCard) {
            throw new Error(
              `StockCard with ID '${detail.productCode}' does not exist.`
            );
          }

          const warehouse = await prisma.warehouse.findUnique({
            where: { id: data.warehouseId },
          });

          if (!warehouse) {
            throw new Error(
              `Warehouse with ID '${data.warehouseId}' does not exist.`
            );
          }

          const stockCardWarehouse = await prisma.stockCardWarehouse.findUnique(
            {
              where: {
                stockCardId_warehouseId: {
                  stockCardId: stockCard.id,
                  warehouseId: data.warehouseId,
                },
              },
            }
          );

          const productCode = stockCard.productCode;
          const quantity = detail.quantity;

          // Stok miktarını güncelleme
          if (stockCardWarehouse) {
            await prisma.stockCardWarehouse.update({
              where: { id: stockCardWarehouse.id },
              data: {
                quantity: {
                  decrement: quantity ?? 0,
                },
              },
            });
          } else {
            console.error("Ürün'ün stoğu bulunamadı.");
          }
        }
        await prisma.invoiceDetail.deleteMany({
          where: { invoiceId: invoiceId },
        });
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            invoiceNo: data.invoiceNo,
            gibInvoiceNo: data.gibInvoiceNo,
            invoiceDate: data.invoiceDate,
            invoiceType: "Purchase",
            documentType: "Invoice",
            current: { connect: { currentCode: data.currentCode } },
            company: _companyCode?.companyCode
              ? { connect: { companyCode: _companyCode.companyCode } }
              : undefined,
            branch: data.branchCode
              ? { connect: { branchCode: data.branchCode } }
              : undefined,
            warehouse: _warehouseCode
              ? { connect: { warehouseCode: _warehouseCode.warehouseCode } }
              : undefined,
            description: data.description,
            paymentDate: data.paymentDate,
            paymentDay: data.paymentDay,
            priceList: { connect: { id: data.priceListId } },
            totalAmount: data.totalAmount,
            totalVat: data.totalVat,
            totalPaid: data.totalPaid,
            totalDebt: data.totalDebt,
            totalBalance: data.totalAmount - data.totalPaid,
            totalDiscount: 0,
            totalNet: data.totalAmount - data.totalVat,
            updatedByUser: { connect: { username: username } },
          },
        });
        // Fatura detaylarını ekleme
        if (data.items) {
          for (const detail of data.items) {
            const _productCode = await prisma.stockCard.findUnique({
              where: { id: detail.stockCardId },
              select: { productCode: true },
            });
            await prisma.invoiceDetail.create({
              data: {
                invoiceId: invoiceId,
                productCode: _productCode?.productCode || "",
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
                vatRate: detail.vatRate,
                netPrice: detail.totalAmount - detail.vatAmount,
                totalPrice: detail.totalAmount,
                discount: 0,
              },
            });
          }
        }

        // Masrafların fatura detaylarını ekleme
        if (data.expenses) {
          for (const detail of data.expenses) {
            await prisma.invoiceDetail.create({
              data: {
                invoiceId: invoiceId,
                costCode: detail.costCode,
                costName: detail.costName,
                currency: detail.currency,
                quantity: 1,
                totalPrice: detail.price,
                discount: 0,
              },
            });
          }
        }

        // Alış işlemleri
        if (data.items) {
          for (const detail of data.items) {
            const stockCard = await prisma.stockCard.findUnique({
              where: { id: detail.stockCardId },
            });

            if (!stockCard) {
              throw new Error(
                `StockCard with ID '${detail.stockCardId}' does not exist.`
              );
            }

            const warehouse = await prisma.warehouse.findUnique({
              where: { id: data.warehouseId },
            });

            if (!warehouse) {
              throw new Error(
                `Warehouse with ID '${data.warehouseId}' does not exist.`
              );
            }

            const stockCardWarehouse =
              await prisma.stockCardWarehouse.findUnique({
                where: {
                  stockCardId_warehouseId: {
                    stockCardId: stockCard.id,
                    warehouseId: data.warehouseId,
                  },
                },
              });

            const productCode = stockCard.productCode;
            const quantity = detail.quantity;

            // Stok miktarını güncelleme
            if (stockCardWarehouse) {
              await prisma.stockCardWarehouse.update({
                where: { id: stockCardWarehouse.id },
                data: {
                  quantity: {
                    increment: quantity ?? 0,
                  },
                },
              });
            } else {
              await prisma.stockCardWarehouse.create({
                data: {
                  stockCardId: stockCard.id,
                  warehouseId: warehouse.id,
                  quantity: new Prisma.Decimal(quantity ?? 0),
                },
              });
            }

            // Ensure warehouseCode exists before creating stockMovement
            const warehouseExists = await prisma.warehouse.findUnique({
              where: { warehouseCode: warehouse.warehouseCode },
            });

            if (!warehouseExists) {
              throw new Error(
                `Warehouse with code ${warehouse.warehouseCode} does not exist.`
              );
            }

            // StockMovement oluşturma
            await prisma.stockMovement.create({
              data: {
                productCode: productCode,
                warehouseCode: warehouse.warehouseCode,
                branchCode: data.branchCode,
                currentCode: data.currentCode,
                documentType: "Invoice",
                invoiceType: "Purchase",
                movementType: "AlisFaturasi",
                documentNo: data.invoiceNo,
                gcCode: "Giris",
                description: `${data.invoiceNo} no'lu alış faturası için stok hareketi`,
                quantity: quantity,
                unitPrice: detail.unitPrice,
                totalPrice: detail.totalAmount,
                unitOfMeasure: stockCard.unit,
                priceListId: detail.priceListId,
                createdBy: username,
                updatedBy: username,
              },
            });
          }
        }
        for (const payment of data.payments) {
          if (payment.method == "cash") {
            await prisma.vaultMovement.create({
              data: {
                invoiceId: invoiceId,
                vaultId: payment.accountId,
                description: `${data.invoiceNo} no'lu alış faturası için kasa hareketi`,
                entering: 0,
                emerging: payment.amount,
                vaultDirection: "Exit",
                vaultType: "PurchaseInvoicePayment",
                vaultDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.vault.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: payment.amount,
                },
              },
            });
          } else if (payment.method == "bank") {
            await prisma.bankMovement.create({
              data: {
                invoiceId: invoiceId,
                bankId: payment.accountId,
                description: `${data.invoiceNo} no'lu alış faturası için banka hareketi`,
                entering: 0,
                emerging: payment.amount,
                bankDirection: "Exit",
                bankType: "PurchaseInvoicePayment",
                bankDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.bank.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: payment.amount,
                },
              },
            });
          } else if (payment.method == "card") {
            await prisma.posMovement.create({
              data: {
                invoiceId: invoiceId,
                posId: payment.accountId,
                description: `${data.invoiceNo} no'lu alış faturası için pos hareketi`,
                entering: 0,
                emerging: payment.amount,
                posDirection: "Exit",
                posType: "PurchaseInvoicePayment",
                posDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.pos.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: payment.amount,
                },
              },
            });
          }
        }
        // data.paymensts içindeki tüm amount'ları topla
        const totalAmount = data.payments.reduce((sum, p) => sum + p.amount, 0);
        // data.paymensts içinden methodu openAccount olmayanları al ve amount'larını topla
        const totalPaid = data.payments
          .filter((p) => p.method !== "openAccount")
          .reduce((sum, p) => sum + p.amount, 0);
        await prisma.currentMovement.create({
          data: {
            currentCode: data.currentCode,
            dueDate: data.paymentDate,
            description: `${data.invoiceNo} no'lu alış faturası için cari hareket`,
            debtAmount: totalAmount,
            creditAmount: 0,
            movementType: "Borc",
            priceListId: data.priceListId,
            documentType: "Fatura",
            paymentType: "CokluOdeme",
            documentNo: data.invoiceNo,
            companyCode: _companyCode?.companyCode || "",
            branchCode: data.branchCode,
            createdBy: username,
            updatedBy: username,
          },
        });

        if (totalPaid > 0) {
          await prisma.currentMovement.create({
            data: {
              currentCode: data.currentCode,
              dueDate: data.paymentDate,
              description: `${data.invoiceNo} no'lu alış faturası için cari hareket`,
              debtAmount: 0,
              creditAmount: totalPaid,
              movementType: "Alacak",
              priceListId: data.priceListId,
              documentType: "Fatura",
              paymentType: "CokluOdeme",
              documentNo: data.invoiceNo,
              companyCode: _companyCode?.companyCode || "",
              branchCode: data.branchCode,
              createdBy: username,
              updatedBy: username,
            },
          });
        }
      });
      return result;
    } catch (error) {
      logger.error(
        "Error deleting and recreating purchase invoice with relations:",
        error
      );
      throw error;
    }
  }

  async deleteSalesInvoiceWithRelations(
    invoiceId: string,
    data: InvoiceInfo
  ): Promise<any> {
    if (!data.invoiceNo || data.invoiceNo.trim() === "") {
      throw new Error("InvoiceNo is required and cannot be empty.");
    }
    const _companyCode = await prisma.company.findFirst({
      select: { companyCode: true },
    });

    const _warehouseCode = await prisma.warehouse.findUnique({
      where: { id: data.warehouseId },
      select: { warehouseCode: true },
    });
    try {
      const result = await prisma.$transaction(async (prisma) => {
        await prisma.currentMovement.deleteMany({
          where: { documentNo: data.invoiceNo },
        });
        await prisma.stockMovement.deleteMany({
          where: { documentNo: data.invoiceNo },
        });
        for (const payment of data.payments) {
          if (payment.method == "cash") {
            await prisma.vaultMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.vault.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: payment.amount,
                },
              },
            });
          } else if (payment.method == "bank") {
            await prisma.bankMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.bank.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: payment.amount,
                },
              },
            });
          } else if (payment.method == "card") {
            await prisma.posMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.pos.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: payment.amount,
                },
              },
            });
          }
        }
        const oldInvoiceDetails = await prisma.invoiceDetail.findMany({
          where: { invoiceId: invoiceId },
        });
        for (const detail of oldInvoiceDetails) {
          if (!detail.productCode) {
            continue;
          }
          const stockCard = await prisma.stockCard.findUnique({
            where: { productCode: detail.productCode },
          });

          if (!stockCard) {
            continue;
          }

          const warehouse = await prisma.warehouse.findUnique({
            where: { id: data.warehouseId },
          });

          if (!warehouse) {
            throw new Error(
              `Warehouse with ID '${data.warehouseId}' does not exist.`
            );
          }

          const stockCardWarehouse = await prisma.stockCardWarehouse.findUnique(
            {
              where: {
                stockCardId_warehouseId: {
                  stockCardId: stockCard.id,
                  warehouseId: data.warehouseId,
                },
              },
            }
          );

          const productCode = stockCard.productCode;
          const quantity = detail.quantity;

          // Stok miktarını güncelleme

          if (stockCardWarehouse) {
            await prisma.stockCardWarehouse.update({
              where: { id: stockCardWarehouse.id },
              data: {
                quantity: {
                  increment: quantity ?? 0,
                },
              },
            });
          } else {
            await prisma.stockCardWarehouse.create({
              data: {
                stockCardId: stockCard.id,
                warehouseId: warehouse.id,
                quantity: new Prisma.Decimal(quantity ?? 0),
              },
            });
          }
        }
        await prisma.invoiceDetail.deleteMany({
          where: { invoiceId: invoiceId },
        });
        await prisma.invoice.delete({ where: { id: invoiceId } });
      });
      return result;
    } catch (error) {
      logger.error("Error deleting invoice with relations:", error);
      throw new Error("Failed to delete invoice and its related records.");
    }
  }

  async deletePurchaseInvoiceWithRelations(
    invoiceId: string,
    data: InvoiceInfo
  ): Promise<any> {
    if (!data.invoiceNo || data.invoiceNo.trim() === "") {
      throw new Error("InvoiceNo is required and cannot be empty.");
    }
    const _companyCode = await prisma.company.findFirst({
      select: { companyCode: true },
    });

    const _warehouseCode = await prisma.warehouse.findUnique({
      where: { id: data.warehouseId },
      select: { warehouseCode: true },
    });
    try {
      const result = await prisma.$transaction(async (prisma) => {
        await prisma.currentMovement.deleteMany({
          where: { documentNo: data.invoiceNo },
        });
        await prisma.stockMovement.deleteMany({
          where: { documentNo: data.invoiceNo },
        });
        for (const payment of data.payments) {
          if (payment.method == "cash") {
            await prisma.vaultMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.vault.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: payment.amount,
                },
              },
            });
          } else if (payment.method == "bank") {
            await prisma.bankMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.bank.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: payment.amount,
                },
              },
            });
          } else if (payment.method == "card") {
            await prisma.posMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.pos.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: payment.amount,
                },
              },
            });
          }
        }
        const oldInvoiceDetails = await prisma.invoiceDetail.findMany({
          where: { invoiceId: invoiceId },
        });
        for (const detail of oldInvoiceDetails) {
          if (!detail.productCode) {
            continue;
          }
          const stockCard = await prisma.stockCard.findUnique({
            where: { productCode: detail.productCode },
          });

          if (!stockCard) {
            continue;
          }

          const warehouse = await prisma.warehouse.findUnique({
            where: { id: data.warehouseId },
          });

          if (!warehouse) {
            throw new Error(
              `Warehouse with ID '${data.warehouseId}' does not exist.`
            );
          }

          const stockCardWarehouse = await prisma.stockCardWarehouse.findUnique(
            {
              where: {
                stockCardId_warehouseId: {
                  stockCardId: stockCard.id,
                  warehouseId: data.warehouseId,
                },
              },
            }
          );

          const productCode = stockCard.productCode;
          const quantity = detail.quantity;

          // Stok miktarını güncelleme
          if (stockCardWarehouse) {
            await prisma.stockCardWarehouse.update({
              where: { id: stockCardWarehouse.id },
              data: {
                quantity: {
                  decrement: quantity ?? 0,
                },
              },
            });
          } else {
            console.error("Ürün'ün stoğu bulunamadı.");
          }
        }
        await prisma.invoiceDetail.deleteMany({
          where: { invoiceId: invoiceId },
        });
        await prisma.invoice.delete({ where: { id: invoiceId } });
      });
    } catch (error) {
      logger.error("Error deleting purchase invoice with relations:", error);
      throw error;
    }
  }

  async cancelPurchaseInvoiceWithRelations(
    datas: InvoiceInfoForCancel[]
  ): Promise<any> {
    try {
      for (const data of datas) {
        if (!data.invoiceNo || data.invoiceNo.trim() === "") {
          throw new Error("InvoiceNo is required and cannot be empty.");
        }
        const result = await prisma.$transaction(async (prisma) => {
          const invoiceId = data.id;
          const invoiceDetail = await this.getInvoiceInfoById(data.id);
          const _companyCode = await prisma.company.findFirst({
            select: { companyCode: true },
          });
          if (!invoiceDetail) {
            throw new Error("Invoice not found");
          } else {
            for (const payment of invoiceDetail.payments) {
              if (payment.method == "cash") {
                await prisma.vaultMovement.deleteMany({
                  where: { invoiceId: invoiceId },
                });
                await prisma.vault.update({
                  where: { id: payment.accountId },
                  data: {
                    balance: {
                      increment: payment.amount,
                    },
                  },
                });
              } else if (payment.method == "bank") {
                await prisma.bankMovement.deleteMany({
                  where: { invoiceId: invoiceId },
                });
                await prisma.bank.update({
                  where: { id: payment.accountId },
                  data: {
                    balance: {
                      increment: payment.amount,
                    },
                  },
                });
              } else if (payment.method == "card") {
                await prisma.posMovement.deleteMany({
                  where: { invoiceId: invoiceId },
                });
                await prisma.pos.update({
                  where: { id: payment.accountId },
                  data: {
                    balance: {
                      increment: payment.amount,
                    },
                  },
                });
              }
            }
          }
          await prisma.currentMovement.deleteMany({
            where: { documentNo: data.invoiceNo },
          });
          await prisma.stockMovement.deleteMany({
            where: { documentNo: data.invoiceNo },
          });
          const oldInvoiceDetails = await prisma.invoiceDetail.findMany({
            where: { invoiceId: invoiceId },
          });
          for (const detail of oldInvoiceDetails) {
            const stockCard = await prisma.stockCard.findUnique({
              where: { productCode: detail.productCode ?? undefined },
            });

            if (!stockCard) {
              throw new Error(
                `StockCard with ID '${detail.productCode}' does not exist.`
              );
            }

            const warehouse = await prisma.warehouse.findUnique({
              where: { warehouseCode: data.warehouseCode },
            });

            if (!warehouse) {
              throw new Error(
                `Warehouse with ID '${data.warehouseId}' does not exist.`
              );
            }

            const stockCardWarehouse =
              await prisma.stockCardWarehouse.findUnique({
                where: {
                  stockCardId_warehouseId: {
                    stockCardId: stockCard.id,
                    warehouseId: invoiceDetail.warehouseId,
                  },
                },
              });

            const productCode = stockCard.productCode;
            const quantity = detail.quantity;

            // Stok miktarını güncelleme
            if (stockCardWarehouse) {
              await prisma.stockCardWarehouse.update({
                where: { id: stockCardWarehouse.id },
                data: {
                  quantity: {
                    decrement: quantity ?? 0,
                  },
                },
              });
            } else {
              console.error("Ürün'ün stoğu bulunamadı.");
            }
          }
          await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
              invoiceNo: data.invoiceNo,
              gibInvoiceNo: data.gibInvoiceNo,
              invoiceDate: data.invoiceDate,
              invoiceType: "Cancel",
              documentType: "Invoice",
              current: { connect: { currentCode: data.currentCode } },
              company: _companyCode?.companyCode
                ? { connect: { companyCode: _companyCode.companyCode } }
                : undefined,
              branch: data.branchCode
                ? { connect: { branchCode: data.branchCode } }
                : undefined,
              warehouse: data.warehouseCode
                ? { connect: { warehouseCode: data.warehouseCode } }
                : undefined,
              description: data.description,
              paymentDate: data.paymentDate,
              paymentDay: data.paymentDay,
              priceList: { connect: { id: data.priceListId } },
              totalAmount: data.totalAmount,
              totalVat: data.totalVat,
              totalPaid: data.totalPaid,
              totalDebt: data.totalDebt,
              totalBalance: data.totalAmount - data.totalPaid,
              totalDiscount: 0,
              totalNet: data.totalAmount - data.totalVat,
            },
          });
        });
        return result;
      }
    } catch (error) {
      logger.error("Error deleting purchase invoice with relations:", error);
      throw error;
    }
  }

  async cancelSalesInvoiceWithRelations(
    datas: InvoiceInfoForCancel[]
  ): Promise<any> {
    try {
      for (const data of datas) {
        if (!data.invoiceNo || data.invoiceNo.trim() === "") {
          throw new Error("InvoiceNo is required and cannot be empty.");
        }
        const result = await prisma.$transaction(async (prisma) => {
          const invoiceId = data.id;
          const invoiceDetail = await this.getInvoiceInfoById(data.id);
          const _companyCode = await prisma.company.findFirst({
            select: { companyCode: true },
          });
          if (!invoiceDetail) {
            throw new Error("Invoice not found");
          } else {
            for (const payment of invoiceDetail.payments) {
              if (payment.method == "cash") {
                await prisma.vaultMovement.deleteMany({
                  where: { invoiceId: invoiceId },
                });
                await prisma.vault.update({
                  where: { id: payment.accountId },
                  data: {
                    balance: {
                      decrement: payment.amount,
                    },
                  },
                });
              } else if (payment.method == "bank") {
                await prisma.bankMovement.deleteMany({
                  where: { invoiceId: invoiceId },
                });
                await prisma.bank.update({
                  where: { id: payment.accountId },
                  data: {
                    balance: {
                      decrement: payment.amount,
                    },
                  },
                });
              } else if (payment.method == "card") {
                await prisma.posMovement.deleteMany({
                  where: { invoiceId: invoiceId },
                });
                await prisma.pos.update({
                  where: { id: payment.accountId },
                  data: {
                    balance: {
                      decrement: payment.amount,
                    },
                  },
                });
              }
            }
          }
          await prisma.currentMovement.deleteMany({
            where: { documentNo: data.invoiceNo },
          });
          await prisma.stockMovement.deleteMany({
            where: { documentNo: data.invoiceNo },
          });
          const oldInvoiceDetails = await prisma.invoiceDetail.findMany({
            where: { invoiceId: invoiceId },
          });
          for (const detail of oldInvoiceDetails) {
            const stockCard = await prisma.stockCard.findUnique({
              where: { productCode: detail.productCode ?? undefined },
            });

            if (!stockCard) {
              throw new Error(
                `StockCard with ID '${detail.productCode}' does not exist.`
              );
            }

            const warehouse = await prisma.warehouse.findUnique({
              where: { warehouseCode: data.warehouseCode },
            });

            if (!warehouse) {
              throw new Error(
                `Warehouse with ID '${data.warehouseId}' does not exist.`
              );
            }

            const stockCardWarehouse =
              await prisma.stockCardWarehouse.findUnique({
                where: {
                  stockCardId_warehouseId: {
                    stockCardId: stockCard.id,
                    warehouseId: invoiceDetail.warehouseId,
                  },
                },
              });

            const productCode = stockCard.productCode;
            const quantity = detail.quantity;

            // Stok miktarını güncelleme
            if (stockCardWarehouse) {
              await prisma.stockCardWarehouse.update({
                where: { id: stockCardWarehouse.id },
                data: {
                  quantity: {
                    increment: quantity ?? 0,
                  },
                },
              });
            } else {
              await prisma.stockCardWarehouse.create({
                data: {
                  stockCardId: stockCard.id,
                  warehouseId: warehouse.id,
                  quantity: quantity ?? 0,
                },
              });
            }
          }
          await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
              invoiceNo: data.invoiceNo,
              gibInvoiceNo: data.gibInvoiceNo,
              invoiceDate: data.invoiceDate,
              invoiceType: "Cancel",
              documentType: "Invoice",
              current: { connect: { currentCode: data.currentCode } },
              company: _companyCode?.companyCode
                ? { connect: { companyCode: _companyCode.companyCode } }
                : undefined,
              branch: data.branchCode
                ? { connect: { branchCode: data.branchCode } }
                : undefined,
              warehouse: data.warehouseCode
                ? { connect: { warehouseCode: data.warehouseCode } }
                : undefined,
              description: data.description,
              paymentDate: data.paymentDate,
              paymentDay: data.paymentDay,
              priceList: { connect: { id: data.priceListId } },
              totalAmount: data.totalAmount,
              totalVat: data.totalVat,
              totalPaid: data.totalPaid,
              totalDebt: data.totalDebt,
              totalBalance: data.totalAmount - data.totalPaid,
              totalDiscount: 0,
              totalNet: data.totalAmount - data.totalVat,
            },
          });
        });
        return result;
      }
    } catch (error) {
      logger.error("Error deleting invoice with relations:", error);
      throw error;
    }
  }

  async deleteQuickSaleInvoiceWithRelationsAndRecreate(
    invoiceId: string,
    data: QuickSaleResponse,
    bearerToken: string
  ): Promise<any> {
    const username = extractUsernameFromToken(bearerToken);
    if (
      !data.id ||
      !data.branchCode ||
      !data.warehouseId ||
      !data.customer.code
    ) {
      throw new Error("Required fields are missing");
    }

    try {
      const result = await prisma.$transaction(async (prisma) => {
        await prisma.currentMovement.deleteMany({
          where: { documentNo: data.id },
        });
        await prisma.stockMovement.deleteMany({
          where: { documentNo: data.id },
        });
        for (const payment of data.payments) {
          if (!payment.accountId || !payment.amount) continue;

          if (payment.method == "cash") {
            await prisma.vaultMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.vault.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: new Prisma.Decimal(payment.amount),
                },
              },
            });
          } else if (payment.method == "bank") {
            await prisma.bankMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.bank.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: new Prisma.Decimal(payment.amount),
                },
              },
            });
          } else if (payment.method == "card") {
            await prisma.posMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.pos.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: new Prisma.Decimal(payment.amount),
                },
              },
            });
          }
        }
        const oldInvoiceDetails = await prisma.invoiceDetail.findMany({
          where: { invoiceId: invoiceId },
        });
        for (const detail of oldInvoiceDetails) {
          if (!detail.quantity) continue;

          const stockCard = await prisma.stockCard.findUnique({
            where: { productCode: detail.productCode ?? undefined },
          });

          if (!stockCard) {
            throw new Error(
              `StockCard with ID '${detail.productCode}' does not exist.1`
            );
          }

          const warehouse = await prisma.warehouse.findUnique({
            where: { id: data.warehouseId },
          });

          if (!warehouse) {
            throw new Error(
              `Warehouse with ID '${data.warehouseId}' does not exist.`
            );
          }

          const stockCardWarehouse = await prisma.stockCardWarehouse.findUnique(
            {
              where: {
                stockCardId_warehouseId: {
                  stockCardId: stockCard.id,
                  warehouseId: data.warehouseId,
                },
              },
            }
          );

          const productCode = stockCard.productCode;
          const quantity = detail.quantity;

          // Stok miktarını güncelleme
          if (stockCardWarehouse) {
            await prisma.stockCardWarehouse.update({
              where: { id: stockCardWarehouse.id },
              data: {
                quantity: {
                  increment: quantity ?? 0,
                },
              },
            });
          } else {
            await prisma.stockCardWarehouse.create({
              data: {
                stockCardId: stockCard.id,
                warehouseId: warehouse.id,
                quantity: quantity ?? 0,
              },
            });
          }
        }
        await prisma.invoiceDetail.deleteMany({
          where: { invoiceId: invoiceId },
        });

        const _invoiceNo = await this.handleSerialToggle(true);
        // 1. Ana fatura oluşturuluyor
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            invoiceNo: _invoiceNo ?? data.id,
            invoiceDate: new Date(data.date),
            branch: { connect: { branchCode: data.branchCode } },
            warehouse: { connect: { id: data.warehouseId } },
            invoiceType: "Sales",
            documentType: "Order",
            current: { connect: { currentCode: data.customer.code } },
            totalAmount: new Prisma.Decimal(data.total),
            totalVat: new Prisma.Decimal(data.totalVat),
            totalDiscount: new Prisma.Decimal(0),
            totalNet: new Prisma.Decimal(data.subtotal),
            totalPaid: new Prisma.Decimal(
              data.payments.reduce((sum, p) => sum + (p.amount || 0), 0)
            ),
            totalDebt: new Prisma.Decimal(
              data.payments
                .filter((p) => p.method === "openAccount")
                .reduce((sum, p) => sum + (p.amount || 0), 0)
            ),
            description: `${_invoiceNo} no'lu hızlı satış faturası`,
            updatedByUser: { connect: { username: username } },
          },
        });

        // 2. İlgili fatura detaylarını ve stok işlemlerini ekleme
        // Fatura detaylarını ekleme
        for (const detail of data.items) {
          const _productCode = await prisma.stockCard.findUnique({
            where: { productCode: detail.productId },
            select: { productCode: true },
          });

          if (!_productCode) {
            throw new Error(
              `StockCard with ID '${detail.productId}' does not exist.3`
            );
          }

          await prisma.invoiceDetail.create({
            data: {
              quantity: new Prisma.Decimal(detail.quantity),
              unitPrice: new Prisma.Decimal(detail.unitPrice),
              vatRate: new Prisma.Decimal(detail.vatRate),
              netPrice: new Prisma.Decimal(
                detail.totalAmount - detail.vatAmount
              ),
              totalPrice: new Prisma.Decimal(detail.totalAmount),
              discount: new Prisma.Decimal(0),
              invoice: { connect: { id: invoiceId } },
              stockCard: { connect: { productCode: _productCode.productCode } },
            },
          });
        }

        // Satış işlemleri
        for (const detail of data.items) {
          const stockCard = await prisma.stockCard.findUnique({
            where: { productCode: detail.productId },
          });

          if (!stockCard) {
            throw new Error(
              `StockCard with ID '${detail.productId}' does not exist.2`
            );
          }

          const stockCardWarehouse = await prisma.stockCardWarehouse.findUnique(
            {
              where: {
                stockCardId_warehouseId: {
                  stockCardId: detail.productId,
                  warehouseId: data.warehouseId,
                },
              },
            }
          );

          const _productCode = stockCard.productCode;
          const quantity = detail.quantity;

          // Stok miktarını güncelleme
          if (stockCardWarehouse) {
            await prisma.stockCardWarehouse.update({
              where: { id: stockCardWarehouse.id },
              data: {
                quantity: {
                  decrement: quantity ?? 0,
                },
              },
            });
          } else {
            console.error(
              "Ürün'ün stoğu bulunamadı. Stoğu olmayan ürünün satışı yapılamaz."
            );
          }

          // Ensure warehouseCode exists before creating stockMovement
          const warehouseExists = await prisma.warehouse.findUnique({
            where: { id: data.warehouseId },
          });

          if (!warehouseExists) {
            throw new Error(
              `Warehouse with code ${data.warehouseId} does not exist.`
            );
          }

          // StockMovement oluşturma
          await prisma.stockMovement.create({
            data: {
              productCode: _productCode,
              warehouseCode: warehouseExists.warehouseCode,
              branchCode: data.branchCode,
              currentCode: data.customer.code,
              documentType: "Order",
              invoiceType: "Sales",
              movementType: "HizliSatis",
              documentNo: _invoiceNo ?? data.id,
              gcCode: "Cikis",
              description: `${_invoiceNo} no'lu hızlı satış için stok hareketi`,
              quantity: new Prisma.Decimal(quantity),
              unitPrice: new Prisma.Decimal(detail.unitPrice),
              totalPrice: new Prisma.Decimal(detail.totalAmount),
              unitOfMeasure: stockCard.unit,
              createdBy: username,
              updatedBy: username,
            },
          });
        }

        for (const payment of data.payments) {
          if (payment.method == "cash") {
            await prisma.vaultMovement.create({
              data: {
                invoiceId: invoiceId,
                vaultId: payment.accountId,
                description: `${_invoiceNo} no'lu hızlı satış için kasa hareketi`,
                entering: new Prisma.Decimal(payment.amount),
                emerging: new Prisma.Decimal(0),
                vaultDirection: "Introduction",
                vaultType: "SalesInvoicePayment",
                vaultDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.vault.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: new Prisma.Decimal(payment.amount),
                },
              },
            });
          } else if (payment.method == "bank") {
            await prisma.bankMovement.create({
              data: {
                invoiceId: invoiceId,
                bankId: payment.accountId,
                description: `${_invoiceNo} no'lu hızlı satış için banka hareketi`,
                entering: new Prisma.Decimal(payment.amount),
                emerging: new Prisma.Decimal(0),
                bankDirection: "Introduction",
                bankType: "SalesInvoicePayment",
                bankDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.bank.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: new Prisma.Decimal(payment.amount),
                },
              },
            });
          } else if (payment.method == "card") {
            await prisma.posMovement.create({
              data: {
                invoiceId: invoiceId,
                posId: payment.accountId,
                description: `${_invoiceNo} no'lu hızlı satış için pos hareketi`,
                entering: new Prisma.Decimal(payment.amount),
                emerging: new Prisma.Decimal(0),
                posDirection: "Introduction",
                posType: "SalesInvoicePayment",
                posDocumentType: "General",
                createdBy: username,
                updatedBy: username,
              },
            });
            await prisma.pos.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  increment: new Prisma.Decimal(payment.amount),
                },
              },
            });
          }
        }

        const _companyCode = await prisma.company.findFirst({
          select: { companyCode: true },
        });

        // data.paymensts içindeki tüm amount'ları topla
        const totalAmount = data.payments.reduce(
          (sum, p) => sum + (p.amount || 0),
          0
        );
        // data.paymensts içinden methodu openAccount olmayanları al ve amount'larını topla
        const totalPaid = data.payments
          .filter((p) => p.method !== "openAccount")
          .reduce((sum, p) => sum + (p.amount || 0), 0);

        await prisma.currentMovement.create({
          data: {
            currentCode: data.customer.code,
            dueDate: new Date(),
            description: `${_invoiceNo} no'lu satış faturası için cari hareket`,
            debtAmount: new Prisma.Decimal(totalAmount),
            creditAmount: new Prisma.Decimal(0),
            movementType: "Borc",
            documentType: "Fatura",
            paymentType: "CokluOdeme",
            documentNo: _invoiceNo ?? data.id,
            companyCode: _companyCode?.companyCode || "",
            branchCode: data.branchCode,
            createdBy: username,
            updatedBy: username,
          },
        });

        if (totalPaid > 0) {
          await prisma.currentMovement.create({
            data: {
              currentCode: data.customer.code,
              dueDate: new Date(),
              description: `${_invoiceNo} no'lu satış faturası için cari hareket`,
              debtAmount: new Prisma.Decimal(0),
              creditAmount: new Prisma.Decimal(totalPaid),
              movementType: "Alacak",
              documentType: "Fatura",
              paymentType: "CokluOdeme",
              documentNo: _invoiceNo ?? data.id,
              companyCode: _companyCode?.companyCode || "",
              branchCode: data.branchCode,
              createdBy: username,
              updatedBy: username,
            },
          });
        }
      });
      return result;
    } catch (error) {
      logger.error(
        "Error deleting and recreating quick sale invoice with relations:",
        error
      );
      throw error;
    }
  }

  async deleteQuickSaleInvoiceWithRelations(invoiceId: string): Promise<any> {
    try {
      const data = await this.getInvoiceInfoById(invoiceId);
      const result = await prisma.$transaction(async (prisma) => {
        await prisma.currentMovement.deleteMany({
          where: { documentNo: data?.id },
        });
        await prisma.stockMovement.deleteMany({
          where: { documentNo: data?.id },
        });
        if (!data) {
          throw new Error("Invoice data is required");
        }
        for (const payment of data.payments) {
          if (payment.method == "cash") {
            await prisma.vaultMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.vault.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: payment.amount,
                },
              },
            });
          } else if (payment.method == "bank") {
            await prisma.bankMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.bank.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: payment.amount,
                },
              },
            });
          } else if (payment.method == "card") {
            await prisma.posMovement.deleteMany({
              where: { invoiceId: invoiceId },
            });
            await prisma.pos.update({
              where: { id: payment.accountId },
              data: {
                balance: {
                  decrement: payment.amount,
                },
              },
            });
          }
        }
        const oldInvoiceDetails = await prisma.invoiceDetail.findMany({
          where: { invoiceId: invoiceId },
        });
        for (const detail of oldInvoiceDetails) {
          const stockCard = await prisma.stockCard.findUnique({
            where: { productCode: detail.productCode ?? undefined },
          });

          if (!stockCard) {
            throw new Error(
              `StockCard with ID '${detail.productCode}' does not exist.`
            );
          }

          const warehouse = await prisma.warehouse.findUnique({
            where: { id: data.warehouseId },
          });

          if (!warehouse) {
            throw new Error(
              `Warehouse with ID '${data.warehouseId}' does not exist.`
            );
          }

          const stockCardWarehouse = await prisma.stockCardWarehouse.findUnique(
            {
              where: {
                stockCardId_warehouseId: {
                  stockCardId: stockCard.id,
                  warehouseId: data.warehouseId,
                },
              },
            }
          );

          const productCode = stockCard.productCode;
          const quantity = detail.quantity;

          // Stok miktarını güncelleme
          if (stockCardWarehouse) {
            await prisma.stockCardWarehouse.update({
              where: { id: stockCardWarehouse.id },
              data: {
                quantity: {
                  increment: quantity ?? 0,
                },
              },
            });
          } else {
            await prisma.stockCardWarehouse.create({
              data: {
                stockCardId: stockCard.id,
                warehouseId: warehouse.id,
                quantity: quantity ?? 0,
              },
            });
          }
        }
        await prisma.invoiceDetail.deleteMany({
          where: { invoiceId: invoiceId },
        });
        await prisma.invoice.delete({ where: { id: invoiceId } });
      });
      return result;
    } catch (error) {
      logger.error("Error deleting quick sale invoice with relations:", error);
      throw error;
    }
  }
}

export default InvoiceService;
