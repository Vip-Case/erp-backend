import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const CurrentCategoryPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    categoryName: t.String({ additionalProperties: true }),
    categoryCode: t.String({ additionalProperties: true }),
    parentCategoryId: __nullable__(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const CurrentCategoryRelations = t.Object(
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
          currentId: t.String({ additionalProperties: true }),
          categoryId: t.String({ additionalProperties: true }),
        },
        { additionalProperties: true },
      ),
    ),
  },
  { additionalProperties: true },
);

export const CurrentCategoryPlainInputCreate = t.Object(
  {
    categoryName: t.String({ additionalProperties: true }),
    categoryCode: t.String({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const CurrentCategoryPlainInputUpdate = t.Object(
  {
    categoryName: t.String({ additionalProperties: true }),
    categoryCode: t.String({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const CurrentCategoryRelationsInputCreate = t.Object(
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

export const CurrentCategoryRelationsInputUpdate = t.Partial(
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

export const CurrentCategoryWhere = t.Partial(
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
    { $id: "CurrentCategory" },
  ),
  { additionalProperties: true },
);

export const CurrentCategoryWhereUnique = t.Recursive(
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
  { $id: "CurrentCategory" },
);

export const CurrentCategorySelect = t.Partial(
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

export const CurrentCategoryInclude = t.Partial(
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

export const CurrentCategoryOrderBy = t.Partial(
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

export const CurrentCategory = t.Composite(
  [CurrentCategoryPlain, CurrentCategoryRelations],
  { additionalProperties: true },
);

export const CurrentCategoryInputCreate = t.Composite(
  [CurrentCategoryPlainInputCreate, CurrentCategoryRelationsInputCreate],
  { additionalProperties: true },
);

export const CurrentCategoryInputUpdate = t.Composite(
  [CurrentCategoryPlainInputUpdate, CurrentCategoryRelationsInputUpdate],
  { additionalProperties: true },
);
