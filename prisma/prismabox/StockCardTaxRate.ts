import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const StockCardTaxRatePlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    stockCardId: __nullable__(t.String({ additionalProperties: true })),
    taxName: t.String({ additionalProperties: true }),
    taxRate: t.Number({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const StockCardTaxRateRelations = t.Object(
  {
    stockCard: __nullable__(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          productCode: t.String({ additionalProperties: true }),
          productName: t.String({ additionalProperties: true }),
          invoiceName: __nullable__(t.String({ additionalProperties: true })),
          shortDescription: __nullable__(
            t.String({ additionalProperties: true }),
          ),
          description: __nullable__(t.String({ additionalProperties: true })),
          warehouseCode: __nullable__(t.String({ additionalProperties: true })),
          manufacturerCode: __nullable__(
            t.String({ additionalProperties: true }),
          ),
          companyCode: __nullable__(t.String({ additionalProperties: true })),
          branchCode: __nullable__(t.String({ additionalProperties: true })),
          brand: __nullable__(t.String({ additionalProperties: true })),
          unitOfMeasure: __nullable__(t.String({ additionalProperties: true })),
          productType: t.String({ additionalProperties: true }),
          riskQuantities: __nullable__(
            t.Number({ additionalProperties: true }),
          ),
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
    ),
  },
  { additionalProperties: true },
);

export const StockCardTaxRatePlainInputCreate = t.Object(
  {
    taxName: t.String({ additionalProperties: true }),
    taxRate: t.Number({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const StockCardTaxRatePlainInputUpdate = t.Object(
  {
    taxName: t.String({ additionalProperties: true }),
    taxRate: t.Number({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const StockCardTaxRateRelationsInputCreate = t.Object(
  {
    stockCard: t.Optional(
      t.Object(
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
    ),
  },
  { additionalProperties: true },
);

export const StockCardTaxRateRelationsInputUpdate = t.Partial(
  t.Object(
    {
      stockCard: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: true }),
              },
              { additionalProperties: true },
            ),
            disconnect: t.Boolean(),
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

export const StockCardTaxRateWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        stockCardId: t.String(),
        taxName: t.String(),
        taxRate: t.Number(),
      }),
    { $id: "StockCardTaxRate" },
  ),
  { additionalProperties: true },
);

export const StockCardTaxRateWhereUnique = t.Recursive(
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
            stockCardId: t.String(),
            taxName: t.String(),
            taxRate: t.Number(),
          },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "StockCardTaxRate" },
);

export const StockCardTaxRateSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      stockCardId: t.Boolean(),
      taxName: t.Boolean(),
      taxRate: t.Boolean(),
      stockCard: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardTaxRateInclude = t.Partial(
  t.Object(
    { stockCard: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardTaxRateOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      stockCardId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      taxName: t.Union([t.Literal("asc"), t.Literal("desc")]),
      taxRate: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardTaxRate = t.Composite(
  [StockCardTaxRatePlain, StockCardTaxRateRelations],
  { additionalProperties: true },
);

export const StockCardTaxRateInputCreate = t.Composite(
  [StockCardTaxRatePlainInputCreate, StockCardTaxRateRelationsInputCreate],
  { additionalProperties: true },
);

export const StockCardTaxRateInputUpdate = t.Composite(
  [StockCardTaxRatePlainInputUpdate, StockCardTaxRateRelationsInputUpdate],
  { additionalProperties: true },
);
