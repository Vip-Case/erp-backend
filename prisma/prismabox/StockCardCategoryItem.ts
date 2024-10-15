import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const StockCardCategoryItemPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    stockCardId: t.String({ additionalProperties: true }),
    categoryId: t.String({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const StockCardCategoryItemRelations = t.Object(
  {
    category: t.Object(
      {
        id: t.String({ additionalProperties: true }),
        categoryName: t.String({ additionalProperties: true }),
        parentCategoryId: __nullable__(
          t.String({ additionalProperties: true }),
        ),
      },
      { additionalProperties: true },
    ),
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
  },
  { additionalProperties: true },
);

export const StockCardCategoryItemPlainInputCreate = t.Object(
  {},
  { additionalProperties: true },
);

export const StockCardCategoryItemPlainInputUpdate = t.Object(
  {},
  { additionalProperties: true },
);

export const StockCardCategoryItemRelationsInputCreate = t.Object(
  {
    category: t.Object(
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
  },
  { additionalProperties: true },
);

export const StockCardCategoryItemRelationsInputUpdate = t.Partial(
  t.Object(
    {
      category: t.Object(
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
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardCategoryItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        stockCardId: t.String(),
        categoryId: t.String(),
      }),
    { $id: "StockCardCategoryItem" },
  ),
  { additionalProperties: true },
);

export const StockCardCategoryItemWhereUnique = t.Recursive(
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
          { id: t.String(), stockCardId: t.String(), categoryId: t.String() },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "StockCardCategoryItem" },
);

export const StockCardCategoryItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      stockCardId: t.Boolean(),
      categoryId: t.Boolean(),
      category: t.Boolean(),
      stockCard: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardCategoryItemInclude = t.Partial(
  t.Object(
    { category: t.Boolean(), stockCard: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardCategoryItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      stockCardId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      categoryId: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardCategoryItem = t.Composite(
  [StockCardCategoryItemPlain, StockCardCategoryItemRelations],
  { additionalProperties: true },
);

export const StockCardCategoryItemInputCreate = t.Composite(
  [
    StockCardCategoryItemPlainInputCreate,
    StockCardCategoryItemRelationsInputCreate,
  ],
  { additionalProperties: true },
);

export const StockCardCategoryItemInputUpdate = t.Composite(
  [
    StockCardCategoryItemPlainInputUpdate,
    StockCardCategoryItemRelationsInputUpdate,
  ],
  { additionalProperties: true },
);
