import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const StockCardVariationPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    stockCardId: t.String({ additionalProperties: true }),
    productCode: t.String({ additionalProperties: true }),
    productName: t.String({ additionalProperties: true }),
    invoiceName: __nullable__(t.String({ additionalProperties: true })),
    shortDescription: __nullable__(t.String({ additionalProperties: true })),
    description: __nullable__(t.String({ additionalProperties: true })),
    riskQuantities: t.Number({ additionalProperties: true }),
    hasExpirationDate: t.Boolean({ additionalProperties: true }),
    allowNegativeStock: t.Boolean({ additionalProperties: true }),
    price: t.Number({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const StockCardVariationRelations = t.Object(
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
        warehouseCode: __nullable__(t.String({ additionalProperties: true })),
        manufacturerCode: __nullable__(
          t.String({ additionalProperties: true }),
        ),
        companyCode: __nullable__(t.String({ additionalProperties: true })),
        branchCode: __nullable__(t.String({ additionalProperties: true })),
        brand: __nullable__(t.String({ additionalProperties: true })),
        unitOfMeasure: __nullable__(t.String({ additionalProperties: true })),
        productType: t.String({ additionalProperties: true }),
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
    attributes: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          attributeName: t.String({ additionalProperties: true }),
          values: t.Array(t.String({ additionalProperties: true })),
          stockCardId: __nullable__(t.String({ additionalProperties: true })),
        },
        { additionalProperties: true },
      ),
    ),
    Barcodes: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          stockCardId: t.String({ additionalProperties: true }),
          barcode: t.String({ additionalProperties: true }),
        },
        { additionalProperties: true },
      ),
    ),
    StockCardPriceListItems: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          priceListId: t.String({ additionalProperties: true }),
          stockCardId: t.String({ additionalProperties: true }),
          price: t.Number({ additionalProperties: true }),
        },
        { additionalProperties: true },
      ),
    ),
  },
  { additionalProperties: true },
);

export const StockCardVariationPlainInputCreate = t.Object(
  {
    productCode: t.String({ additionalProperties: true }),
    productName: t.String({ additionalProperties: true }),
    invoiceName: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    shortDescription: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    description: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    riskQuantities: t.Number({ additionalProperties: true }),
    hasExpirationDate: t.Optional(t.Boolean({ additionalProperties: true })),
    allowNegativeStock: t.Optional(t.Boolean({ additionalProperties: true })),
    price: t.Number({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const StockCardVariationPlainInputUpdate = t.Object(
  {
    productCode: t.String({ additionalProperties: true }),
    productName: t.String({ additionalProperties: true }),
    invoiceName: __nullable__(t.String({ additionalProperties: true })),
    shortDescription: __nullable__(t.String({ additionalProperties: true })),
    description: __nullable__(t.String({ additionalProperties: true })),
    riskQuantities: t.Number({ additionalProperties: true }),
    hasExpirationDate: t.Optional(t.Boolean({ additionalProperties: true })),
    allowNegativeStock: t.Optional(t.Boolean({ additionalProperties: true })),
    price: t.Number({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const StockCardVariationRelationsInputCreate = t.Object(
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
    attributes: t.Optional(
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
    Barcodes: t.Optional(
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
    StockCardPriceListItems: t.Optional(
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

export const StockCardVariationRelationsInputUpdate = t.Partial(
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
      attributes: t.Partial(
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
      Barcodes: t.Partial(
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
      StockCardPriceListItems: t.Partial(
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

export const StockCardVariationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        stockCardId: t.String(),
        productCode: t.String(),
        productName: t.String(),
        invoiceName: t.String(),
        shortDescription: t.String(),
        description: t.String(),
        riskQuantities: t.Number(),
        hasExpirationDate: t.Boolean(),
        allowNegativeStock: t.Boolean(),
        price: t.Number(),
      }),
    { $id: "StockCardVariation" },
  ),
  { additionalProperties: true },
);

export const StockCardVariationWhereUnique = t.Recursive(
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
            productCode: t.String(),
            productName: t.String(),
            invoiceName: t.String(),
            shortDescription: t.String(),
            description: t.String(),
            riskQuantities: t.Number(),
            hasExpirationDate: t.Boolean(),
            allowNegativeStock: t.Boolean(),
            price: t.Number(),
          },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "StockCardVariation" },
);

export const StockCardVariationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      stockCardId: t.Boolean(),
      productCode: t.Boolean(),
      productName: t.Boolean(),
      invoiceName: t.Boolean(),
      shortDescription: t.Boolean(),
      description: t.Boolean(),
      riskQuantities: t.Boolean(),
      hasExpirationDate: t.Boolean(),
      allowNegativeStock: t.Boolean(),
      price: t.Boolean(),
      stockCard: t.Boolean(),
      attributes: t.Boolean(),
      Barcodes: t.Boolean(),
      StockCardPriceListItems: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardVariationInclude = t.Partial(
  t.Object(
    {
      stockCard: t.Boolean(),
      attributes: t.Boolean(),
      Barcodes: t.Boolean(),
      StockCardPriceListItems: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardVariationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      stockCardId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      productCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      productName: t.Union([t.Literal("asc"), t.Literal("desc")]),
      invoiceName: t.Union([t.Literal("asc"), t.Literal("desc")]),
      shortDescription: t.Union([t.Literal("asc"), t.Literal("desc")]),
      description: t.Union([t.Literal("asc"), t.Literal("desc")]),
      riskQuantities: t.Union([t.Literal("asc"), t.Literal("desc")]),
      hasExpirationDate: t.Union([t.Literal("asc"), t.Literal("desc")]),
      allowNegativeStock: t.Union([t.Literal("asc"), t.Literal("desc")]),
      price: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardVariation = t.Composite(
  [StockCardVariationPlain, StockCardVariationRelations],
  { additionalProperties: true },
);

export const StockCardVariationInputCreate = t.Composite(
  [StockCardVariationPlainInputCreate, StockCardVariationRelationsInputCreate],
  { additionalProperties: true },
);

export const StockCardVariationInputUpdate = t.Composite(
  [StockCardVariationPlainInputUpdate, StockCardVariationRelationsInputUpdate],
  { additionalProperties: true },
);
