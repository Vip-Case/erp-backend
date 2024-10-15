import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const StockCardPriceListItemsPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    priceListId: t.String({ additionalProperties: true }),
    stockCardId: t.String({ additionalProperties: true }),
    price: t.Number({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const StockCardPriceListItemsRelations = t.Object(
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

export const StockCardPriceListItemsPlainInputCreate = t.Object(
  { price: t.Number({ additionalProperties: true }) },
  { additionalProperties: true },
);

export const StockCardPriceListItemsPlainInputUpdate = t.Object(
  { price: t.Number({ additionalProperties: true }) },
  { additionalProperties: true },
);

export const StockCardPriceListItemsRelationsInputCreate = t.Object(
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

export const StockCardPriceListItemsRelationsInputUpdate = t.Partial(
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

export const StockCardPriceListItemsWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        priceListId: t.String(),
        stockCardId: t.String(),
        price: t.Number(),
      }),
    { $id: "StockCardPriceListItems" },
  ),
  { additionalProperties: true },
);

export const StockCardPriceListItemsWhereUnique = t.Recursive(
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
            priceListId: t.String(),
            stockCardId: t.String(),
            price: t.Number(),
          },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "StockCardPriceListItems" },
);

export const StockCardPriceListItemsSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      priceListId: t.Boolean(),
      stockCardId: t.Boolean(),
      price: t.Boolean(),
      stockCard: t.Boolean(),
      StockCardVariation: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardPriceListItemsInclude = t.Partial(
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

export const StockCardPriceListItemsOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      priceListId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      stockCardId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      price: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardPriceListItems = t.Composite(
  [StockCardPriceListItemsPlain, StockCardPriceListItemsRelations],
  { additionalProperties: true },
);

export const StockCardPriceListItemsInputCreate = t.Composite(
  [
    StockCardPriceListItemsPlainInputCreate,
    StockCardPriceListItemsRelationsInputCreate,
  ],
  { additionalProperties: true },
);

export const StockCardPriceListItemsInputUpdate = t.Composite(
  [
    StockCardPriceListItemsPlainInputUpdate,
    StockCardPriceListItemsRelationsInputUpdate,
  ],
  { additionalProperties: true },
);
