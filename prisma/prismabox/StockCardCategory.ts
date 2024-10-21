import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const StockCardCategoryPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    categoryName: t.String({ additionalProperties: true }),
    categoryCode: t.String({ additionalProperties: true }),
    parentCategoryId: __nullable__(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const StockCardCategoryRelations = t.Object(
  {
    parentCategory: __nullable__(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          categoryName: t.String({ additionalProperties: true }),
          categoryCode: t.String({ additionalProperties: true }),
          parentCategoryId: __nullable__(
            t.String({ additionalProperties: true }),
          ),
        },
        { additionalProperties: true },
      ),
    ),
    childCategories: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          categoryName: t.String({ additionalProperties: true }),
          categoryCode: t.String({ additionalProperties: true }),
          parentCategoryId: __nullable__(
            t.String({ additionalProperties: true }),
          ),
        },
        { additionalProperties: true },
      ),
    ),
    CategoryItems: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          stockCardId: t.String({ additionalProperties: true }),
          categoryId: t.String({ additionalProperties: true }),
        },
        { additionalProperties: true },
      ),
    ),
  },
  { additionalProperties: true },
);

export const StockCardCategoryPlainInputCreate = t.Object(
  {
    categoryName: t.String({ additionalProperties: true }),
    categoryCode: t.String({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const StockCardCategoryPlainInputUpdate = t.Object(
  {
    categoryName: t.String({ additionalProperties: true }),
    categoryCode: t.String({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const StockCardCategoryRelationsInputCreate = t.Object(
  {
    parentCategory: t.Optional(
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
    childCategories: t.Optional(
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
    CategoryItems: t.Optional(
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

export const StockCardCategoryRelationsInputUpdate = t.Partial(
  t.Object(
    {
      parentCategory: t.Partial(
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
      childCategories: t.Partial(
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
      CategoryItems: t.Partial(
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

export const StockCardCategoryWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        categoryName: t.String(),
        categoryCode: t.String(),
        parentCategoryId: t.String(),
      }),
    { $id: "StockCardCategory" },
  ),
  { additionalProperties: true },
);

export const StockCardCategoryWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(t.Object({ id: t.String(), categoryCode: t.String() })),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({ categoryCode: t.String() }),
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
          {
            id: t.String(),
            categoryName: t.String(),
            categoryCode: t.String(),
            parentCategoryId: t.String(),
          },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "StockCardCategory" },
);

export const StockCardCategorySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      categoryName: t.Boolean(),
      categoryCode: t.Boolean(),
      parentCategoryId: t.Boolean(),
      parentCategory: t.Boolean(),
      childCategories: t.Boolean(),
      CategoryItems: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardCategoryInclude = t.Partial(
  t.Object(
    {
      parentCategory: t.Boolean(),
      childCategories: t.Boolean(),
      CategoryItems: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardCategoryOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      categoryName: t.Union([t.Literal("asc"), t.Literal("desc")]),
      categoryCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      parentCategoryId: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardCategory = t.Composite(
  [StockCardCategoryPlain, StockCardCategoryRelations],
  { additionalProperties: true },
);

export const StockCardCategoryInputCreate = t.Composite(
  [StockCardCategoryPlainInputCreate, StockCardCategoryRelationsInputCreate],
  { additionalProperties: true },
);

export const StockCardCategoryInputUpdate = t.Composite(
  [StockCardCategoryPlainInputUpdate, StockCardCategoryRelationsInputUpdate],
  { additionalProperties: true },
);
