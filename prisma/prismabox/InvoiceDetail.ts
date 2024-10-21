import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const InvoiceDetailPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    invoiceId: t.String({ additionalProperties: true }),
    productCode: t.String({ additionalProperties: true }),
    quantity: t.Number({ additionalProperties: true }),
    unitPrice: t.Number({ additionalProperties: true }),
    totalPrice: t.Number({ additionalProperties: true }),
    vatRate: t.Number({ additionalProperties: true }),
    discount: t.Number({ additionalProperties: true }),
    netPrice: t.Number({ additionalProperties: true }),
    createdAt: t.Date({ additionalProperties: true }),
    updatedAt: t.Date({ additionalProperties: true }),
    createdBy: __nullable__(t.String({ additionalProperties: true })),
    updatedBy: __nullable__(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const InvoiceDetailRelations = t.Object(
  {
    Invoice: t.Object(
      {
        id: t.String({ additionalProperties: true }),
        invoiceNo: t.String({ additionalProperties: true }),
        gibInvoiceNo: __nullable__(t.String({ additionalProperties: true })),
        invoiceDate: __nullable__(t.Date({ additionalProperties: true })),
        invoiceType: __nullable__(
          t.Union(
            [
              t.Literal("Purchase"),
              t.Literal("Sales"),
              t.Literal("Return"),
              t.Literal("Cancel"),
              t.Literal("Other"),
            ],
            { additionalProperties: true },
          ),
        ),
        documentType: __nullable__(
          t.Union(
            [
              t.Literal("Invoice"),
              t.Literal("Order"),
              t.Literal("Waybill"),
              t.Literal("Other"),
            ],
            { additionalProperties: true },
          ),
        ),
        currentCode: __nullable__(t.String({ additionalProperties: true })),
        companyCode: __nullable__(t.String({ additionalProperties: true })),
        branchCode: t.String({ additionalProperties: true }),
        outBranchCode: __nullable__(t.String({ additionalProperties: true })),
        warehouseCode: t.String({ additionalProperties: true }),
        description: __nullable__(t.String({ additionalProperties: true })),
        genelIskontoTutar: __nullable__(
          t.Number({ additionalProperties: true }),
        ),
        genelIskontoOran: __nullable__(
          t.Number({ additionalProperties: true }),
        ),
        paymentDate: __nullable__(t.Date({ additionalProperties: true })),
        paymentDay: __nullable__(t.Integer({ additionalProperties: true })),
        priceListId: __nullable__(t.String({ additionalProperties: true })),
        totalAmount: __nullable__(t.Number({ additionalProperties: true })),
        totalVat: __nullable__(t.Number({ additionalProperties: true })),
        totalDiscount: __nullable__(t.Number({ additionalProperties: true })),
        totalNet: __nullable__(t.Number({ additionalProperties: true })),
        totalPaid: __nullable__(t.Number({ additionalProperties: true })),
        totalDebt: __nullable__(t.Number({ additionalProperties: true })),
        totalBalance: __nullable__(t.Number({ additionalProperties: true })),
        createdAt: t.Date({ additionalProperties: true }),
        updatedAt: t.Date({ additionalProperties: true }),
        canceledAt: __nullable__(t.Date({ additionalProperties: true })),
        createdBy: __nullable__(t.String({ additionalProperties: true })),
        updatedBy: __nullable__(t.String({ additionalProperties: true })),
      },
      { additionalProperties: true },
    ),
    StockCard: t.Object(
      {
        id: t.String({ additionalProperties: true }),
        productCode: t.String({ additionalProperties: true }),
        productName: t.String({ additionalProperties: true }),
        invoiceName: __nullable__(t.String({ additionalProperties: true })),
        shortDescription: __nullable__(
          t.String({ additionalProperties: true }),
        ),
        description: __nullable__(t.String({ additionalProperties: true })),
        manufacturerCode: __nullable__(
          t.String({ additionalProperties: true }),
        ),
        companyCode: __nullable__(t.String({ additionalProperties: true })),
        branchCode: __nullable__(t.String({ additionalProperties: true })),
        brand: __nullable__(t.String({ additionalProperties: true })),
        unitOfMeasure: __nullable__(t.String({ additionalProperties: true })),
        productType: t.String({ additionalProperties: true }),
        marketNames: __nullable__(t.String({ additionalProperties: true })),
        riskQuantities: __nullable__(t.Number({ additionalProperties: true })),
        stockStatus: t.Boolean({ additionalProperties: true }),
        hasExpirationDate: t.Boolean({ additionalProperties: true }),
        allowNegativeStock: t.Boolean({ additionalProperties: true }),
        createdAt: t.Date({ additionalProperties: true }),
        updatedAt: t.Date({ additionalProperties: true }),
        createdBy: __nullable__(t.String({ additionalProperties: true })),
        updatedBy: __nullable__(t.String({ additionalProperties: true })),
      },
      { additionalProperties: true },
    ),
  },
  { additionalProperties: true },
);

export const InvoiceDetailPlainInputCreate = t.Object(
  {
    productCode: t.String({ additionalProperties: true }),
    quantity: t.Number({ additionalProperties: true }),
    unitPrice: t.Number({ additionalProperties: true }),
    totalPrice: t.Number({ additionalProperties: true }),
    vatRate: t.Number({ additionalProperties: true }),
    discount: t.Number({ additionalProperties: true }),
    netPrice: t.Number({ additionalProperties: true }),
    createdBy: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    updatedBy: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
  },
  { additionalProperties: true },
);

export const InvoiceDetailPlainInputUpdate = t.Object(
  {
    productCode: t.String({ additionalProperties: true }),
    quantity: t.Number({ additionalProperties: true }),
    unitPrice: t.Number({ additionalProperties: true }),
    totalPrice: t.Number({ additionalProperties: true }),
    vatRate: t.Number({ additionalProperties: true }),
    discount: t.Number({ additionalProperties: true }),
    netPrice: t.Number({ additionalProperties: true }),
    createdBy: __nullable__(t.String({ additionalProperties: true })),
    updatedBy: __nullable__(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const InvoiceDetailRelationsInputCreate = t.Object(
  {
    Invoice: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: true }),
          },
          { additionalProperties: true },
        ),
      },
      { additionalProperties: true },
    ),
    StockCard: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: true }),
          },
          { additionalProperties: true },
        ),
      },
      { additionalProperties: true },
    ),
  },
  { additionalProperties: true },
);

export const InvoiceDetailRelationsInputUpdate = t.Partial(
  t.Object(
    {
      Invoice: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: true }),
            },
            { additionalProperties: true },
          ),
        },
        { additionalProperties: true },
      ),
      StockCard: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: true }),
            },
            { additionalProperties: true },
          ),
        },
        { additionalProperties: true },
      ),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const InvoiceDetailWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        invoiceId: t.String(),
        productCode: t.String(),
        quantity: t.Number(),
        unitPrice: t.Number(),
        totalPrice: t.Number(),
        vatRate: t.Number(),
        discount: t.Number(),
        netPrice: t.Number(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
        createdBy: t.String(),
        updatedBy: t.String(),
      }),
    { $id: "InvoiceDetail" },
  ),
  { additionalProperties: true },
);

export const InvoiceDetailWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(t.Object({ id: t.String() })),
      t.Union([t.Object({ id: t.String() })]),
      t.Partial(
        t.Object({
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
        }),
      ),
      t.Partial(
        t.Object(
          {
            id: t.String(),
            invoiceId: t.String(),
            productCode: t.String(),
            quantity: t.Number(),
            unitPrice: t.Number(),
            totalPrice: t.Number(),
            vatRate: t.Number(),
            discount: t.Number(),
            netPrice: t.Number(),
            createdAt: t.Date(),
            updatedAt: t.Date(),
            createdBy: t.String(),
            updatedBy: t.String(),
          },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "InvoiceDetail" },
);

export const InvoiceDetailSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      invoiceId: t.Boolean(),
      productCode: t.Boolean(),
      quantity: t.Boolean(),
      unitPrice: t.Boolean(),
      totalPrice: t.Boolean(),
      vatRate: t.Boolean(),
      discount: t.Boolean(),
      netPrice: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      createdBy: t.Boolean(),
      updatedBy: t.Boolean(),
      Invoice: t.Boolean(),
      StockCard: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const InvoiceDetailInclude = t.Partial(
  t.Object(
    { Invoice: t.Boolean(), StockCard: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const InvoiceDetailOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      invoiceId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      productCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")]),
      unitPrice: t.Union([t.Literal("asc"), t.Literal("desc")]),
      totalPrice: t.Union([t.Literal("asc"), t.Literal("desc")]),
      vatRate: t.Union([t.Literal("asc"), t.Literal("desc")]),
      discount: t.Union([t.Literal("asc"), t.Literal("desc")]),
      netPrice: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const InvoiceDetail = t.Composite(
  [InvoiceDetailPlain, InvoiceDetailRelations],
  { additionalProperties: true },
);

export const InvoiceDetailInputCreate = t.Composite(
  [InvoiceDetailPlainInputCreate, InvoiceDetailRelationsInputCreate],
  { additionalProperties: true },
);

export const InvoiceDetailInputUpdate = t.Composite(
  [InvoiceDetailPlainInputUpdate, InvoiceDetailRelationsInputUpdate],
  { additionalProperties: true },
);
