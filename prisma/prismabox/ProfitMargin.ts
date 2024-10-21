import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const ProfitMarginPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    stockCardId: t.String({ additionalProperties: true }),
    branchCode: __nullable__(t.String({ additionalProperties: true })),
    profitMargin: t.Number({ additionalProperties: true }),
    createdAt: t.Date({ additionalProperties: true }),
    updatedAt: t.Date({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const ProfitMarginRelations = t.Object(
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
    Branch: __nullable__(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          branchName: t.String({ additionalProperties: true }),
          branchCode: t.String({ additionalProperties: true }),
          address: t.String({ additionalProperties: true }),
          countryCode: t.String({ additionalProperties: true }),
          city: t.String({ additionalProperties: true }),
          district: t.String({ additionalProperties: true }),
          phone: t.String({ additionalProperties: true }),
          email: t.String({ additionalProperties: true }),
          website: t.String({ additionalProperties: true }),
          companyCode: t.String({ additionalProperties: true }),
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

export const ProfitMarginPlainInputCreate = t.Object(
  {
    branchCode: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    profitMargin: t.Number({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const ProfitMarginPlainInputUpdate = t.Object(
  {
    branchCode: __nullable__(t.String({ additionalProperties: true })),
    profitMargin: t.Number({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const ProfitMarginRelationsInputCreate = t.Object(
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
    Branch: t.Optional(
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

export const ProfitMarginRelationsInputUpdate = t.Partial(
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
      Branch: t.Partial(
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

export const ProfitMarginWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        stockCardId: t.String(),
        branchCode: t.String(),
        profitMargin: t.Number(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      }),
    { $id: "ProfitMargin" },
  ),
  { additionalProperties: true },
);

export const ProfitMarginWhereUnique = t.Recursive(
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
            branchCode: t.String(),
            profitMargin: t.Number(),
            createdAt: t.Date(),
            updatedAt: t.Date(),
          },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "ProfitMargin" },
);

export const ProfitMarginSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      stockCardId: t.Boolean(),
      branchCode: t.Boolean(),
      profitMargin: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      stockCard: t.Boolean(),
      Branch: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const ProfitMarginInclude = t.Partial(
  t.Object(
    { stockCard: t.Boolean(), Branch: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const ProfitMarginOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      stockCardId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      branchCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      profitMargin: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const ProfitMargin = t.Composite(
  [ProfitMarginPlain, ProfitMarginRelations],
  { additionalProperties: true },
);

export const ProfitMarginInputCreate = t.Composite(
  [ProfitMarginPlainInputCreate, ProfitMarginRelationsInputCreate],
  { additionalProperties: true },
);

export const ProfitMarginInputUpdate = t.Composite(
  [ProfitMarginPlainInputUpdate, ProfitMarginRelationsInputUpdate],
  { additionalProperties: true },
);
