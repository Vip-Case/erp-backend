import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const ReceiptDetailPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    receiptId: t.String({ additionalProperties: true }),
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

export const ReceiptDetailRelations = t.Object(
  {
    Receipt: t.Object(
      {
        id: t.String({ additionalProperties: true }),
        receiptType: t.Union(
          [
            t.Literal("Devir"),
            t.Literal("Sayim"),
            t.Literal("Nakil"),
            t.Literal("Giris"),
            t.Literal("Cikis"),
            t.Literal("Fire"),
          ],
          { additionalProperties: true },
        ),
        receiptDate: t.Date({ additionalProperties: true }),
        documentNo: t.String({ additionalProperties: true }),
        branchCode: t.String({ additionalProperties: true }),
        warehouseCode: t.String({ additionalProperties: true }),
        description: __nullable__(t.String({ additionalProperties: true })),
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

export const ReceiptDetailPlainInputCreate = t.Object(
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

export const ReceiptDetailPlainInputUpdate = t.Object(
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

export const ReceiptDetailRelationsInputCreate = t.Object(
  {
    Receipt: t.Object(
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

export const ReceiptDetailRelationsInputUpdate = t.Partial(
  t.Object(
    {
      Receipt: t.Object(
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

export const ReceiptDetailWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        receiptId: t.String(),
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
    { $id: "ReceiptDetail" },
  ),
  { additionalProperties: true },
);

export const ReceiptDetailWhereUnique = t.Recursive(
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
            receiptId: t.String(),
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
  { $id: "ReceiptDetail" },
);

export const ReceiptDetailSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      receiptId: t.Boolean(),
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
      Receipt: t.Boolean(),
      StockCard: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const ReceiptDetailInclude = t.Partial(
  t.Object(
    { Receipt: t.Boolean(), StockCard: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const ReceiptDetailOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      receiptId: t.Union([t.Literal("asc"), t.Literal("desc")]),
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

export const ReceiptDetail = t.Composite(
  [ReceiptDetailPlain, ReceiptDetailRelations],
  { additionalProperties: true },
);

export const ReceiptDetailInputCreate = t.Composite(
  [ReceiptDetailPlainInputCreate, ReceiptDetailRelationsInputCreate],
  { additionalProperties: true },
);

export const ReceiptDetailInputUpdate = t.Composite(
  [ReceiptDetailPlainInputUpdate, ReceiptDetailRelationsInputUpdate],
  { additionalProperties: true },
);
