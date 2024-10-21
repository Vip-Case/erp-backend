import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const StockCardBarcodePlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    stockCardId: t.String({ additionalProperties: true }),
    barcode: t.String({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const StockCardBarcodeRelations = t.Object(
  {
    stockCard: t.Object(
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
    StockCardVariation: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          stockCardId: t.String({ additionalProperties: true }),
          productCode: t.String({ additionalProperties: true }),
          productName: t.String({ additionalProperties: true }),
          invoiceName: __nullable__(t.String({ additionalProperties: true })),
          shortDescription: __nullable__(
            t.String({ additionalProperties: true }),
          ),
          description: __nullable__(t.String({ additionalProperties: true })),
          riskQuantities: t.Number({ additionalProperties: true }),
          hasExpirationDate: t.Boolean({ additionalProperties: true }),
          allowNegativeStock: t.Boolean({ additionalProperties: true }),
          price: t.Number({ additionalProperties: true }),
        },
        { additionalProperties: true },
      ),
    ),
  },
  { additionalProperties: true },
);

export const StockCardBarcodePlainInputCreate = t.Object(
  { barcode: t.String({ additionalProperties: true }) },
  { additionalProperties: true },
);

export const StockCardBarcodePlainInputUpdate = t.Object(
  { barcode: t.String({ additionalProperties: true }) },
  { additionalProperties: true },
);

export const StockCardBarcodeRelationsInputCreate = t.Object(
  {
    stockCard: t.Object(
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
    StockCardVariation: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: true }),
              },
              { additionalProperties: true },
            ),
          ),
        },
        { additionalProperties: true },
      ),
    ),
  },
  { additionalProperties: true },
);

export const StockCardBarcodeRelationsInputUpdate = t.Partial(
  t.Object(
    {
      stockCard: t.Object(
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
      StockCardVariation: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: true }),
                },
                { additionalProperties: true },
              ),
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: true }),
                },
                { additionalProperties: true },
              ),
            ),
          },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardBarcodeWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        stockCardId: t.String(),
        barcode: t.String(),
      }),
    { $id: "StockCardBarcode" },
  ),
  { additionalProperties: true },
);

export const StockCardBarcodeWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(t.Object({ id: t.String(), barcode: t.String() })),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({ barcode: t.String() }),
      ]),
      t.Partial(
        t.Object({
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
        }),
      ),
      t.Partial(
        t.Object(
          { id: t.String(), stockCardId: t.String(), barcode: t.String() },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "StockCardBarcode" },
);

export const StockCardBarcodeSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      stockCardId: t.Boolean(),
      barcode: t.Boolean(),
      stockCard: t.Boolean(),
      StockCardVariation: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardBarcodeInclude = t.Partial(
  t.Object(
    {
      stockCard: t.Boolean(),
      StockCardVariation: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardBarcodeOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      stockCardId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      barcode: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardBarcode = t.Composite(
  [StockCardBarcodePlain, StockCardBarcodeRelations],
  { additionalProperties: true },
);

export const StockCardBarcodeInputCreate = t.Composite(
  [StockCardBarcodePlainInputCreate, StockCardBarcodeRelationsInputCreate],
  { additionalProperties: true },
);

export const StockCardBarcodeInputUpdate = t.Composite(
  [StockCardBarcodePlainInputUpdate, StockCardBarcodeRelationsInputUpdate],
  { additionalProperties: true },
);
