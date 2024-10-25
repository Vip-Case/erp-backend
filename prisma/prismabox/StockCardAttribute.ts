import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const StockCardAttributePlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    attributeName: t.String({ additionalProperties: true }),
    values: t.Array(t.String({ additionalProperties: true })),
    stockCardId: __nullable__(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const StockCardAttributeRelations = t.Object(
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
          manufacturerCode: __nullable__(
            t.String({ additionalProperties: true }),
          ),
          companyCode: __nullable__(t.String({ additionalProperties: true })),
          branchCode: __nullable__(t.String({ additionalProperties: true })),
          brand: __nullable__(t.String({ additionalProperties: true })),
          unitOfMeasure: __nullable__(t.String({ additionalProperties: true })),
          productType: t.String({ additionalProperties: true }),
          marketNames: __nullable__(t.String({ additionalProperties: true })),
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
    variations: t.Array(
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

export const StockCardAttributePlainInputCreate = t.Object(
  {
    attributeName: t.String({ additionalProperties: true }),
    values: t.Array(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const StockCardAttributePlainInputUpdate = t.Object(
  {
    attributeName: t.String({ additionalProperties: true }),
    values: t.Array(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const StockCardAttributeRelationsInputCreate = t.Object(
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
    variations: t.Optional(
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

export const StockCardAttributeRelationsInputUpdate = t.Partial(
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
      variations: t.Partial(
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

export const StockCardAttributeWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        attributeName: t.String(),
        values: t.Array(t.String()),
        stockCardId: t.String(),
      }),
    { $id: "StockCardAttribute" },
  ),
  { additionalProperties: true },
);

export const StockCardAttributeWhereUnique = t.Recursive(
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
            attributeName: t.String(),
            values: t.Array(t.String()),
            stockCardId: t.String(),
          },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "StockCardAttribute" },
);

export const StockCardAttributeSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      attributeName: t.Boolean(),
      values: t.Boolean(),
      stockCardId: t.Boolean(),
      stockCard: t.Boolean(),
      variations: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardAttributeInclude = t.Partial(
  t.Object(
    { stockCard: t.Boolean(), variations: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardAttributeOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      attributeName: t.Union([t.Literal("asc"), t.Literal("desc")]),
      values: t.Union([t.Literal("asc"), t.Literal("desc")]),
      stockCardId: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardAttribute = t.Composite(
  [StockCardAttributePlain, StockCardAttributeRelations],
  { additionalProperties: true },
);

export const StockCardAttributeInputCreate = t.Composite(
  [StockCardAttributePlainInputCreate, StockCardAttributeRelationsInputCreate],
  { additionalProperties: true },
);

export const StockCardAttributeInputUpdate = t.Composite(
  [StockCardAttributePlainInputUpdate, StockCardAttributeRelationsInputUpdate],
  { additionalProperties: true },
);
