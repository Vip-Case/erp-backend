import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const CurrentCategoryItemPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    currentId: t.String({ additionalProperties: true }),
    categoryId: t.String({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const CurrentCategoryItemRelations = t.Object(
  {
    category: t.Object(
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
    current: t.Object(
      {
        id: t.String({ additionalProperties: true }),
        currentCode: t.String({ additionalProperties: true }),
        currentName: t.String({ additionalProperties: true }),
        currentType: t.String({ additionalProperties: true }),
        institution: t.String({ additionalProperties: true }),
        identityNo: __nullable__(t.String({ additionalProperties: true })),
        taxNumber: __nullable__(t.String({ additionalProperties: true })),
        taxOffice: __nullable__(t.String({ additionalProperties: true })),
        birthOfDate: t.Date({ additionalProperties: true }),
        KepAdress: __nullable__(t.String({ additionalProperties: true })),
        MersisNo: t.String({ additionalProperties: true }),
        accounts: __nullable__(t.String({ additionalProperties: true })),
        works: __nullable__(t.String({ additionalProperties: true })),
        plasiyer: __nullable__(t.String({ additionalProperties: true })),
        address: __nullable__(t.String({ additionalProperties: true })),
        countryCode: __nullable__(t.String({ additionalProperties: true })),
        city: __nullable__(t.String({ additionalProperties: true })),
        district: __nullable__(t.String({ additionalProperties: true })),
        phone: __nullable__(t.String({ additionalProperties: true })),
        email: __nullable__(t.String({ additionalProperties: true })),
        website: __nullable__(t.String({ additionalProperties: true })),
        companyCode: t.String({ additionalProperties: true }),
        branchCode: t.String({ additionalProperties: true }),
        warehouseCode: t.String({ additionalProperties: true }),
        priceListId: t.String({ additionalProperties: true }),
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

export const CurrentCategoryItemPlainInputCreate = t.Object(
  {},
  { additionalProperties: true },
);

export const CurrentCategoryItemPlainInputUpdate = t.Object(
  {},
  { additionalProperties: true },
);

export const CurrentCategoryItemRelationsInputCreate = t.Object(
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
    current: t.Object(
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

export const CurrentCategoryItemRelationsInputUpdate = t.Partial(
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
      current: t.Object(
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

export const CurrentCategoryItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        currentId: t.String(),
        categoryId: t.String(),
      }),
    { $id: "CurrentCategoryItem" },
  ),
  { additionalProperties: true },
);

export const CurrentCategoryItemWhereUnique = t.Recursive(
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
          { id: t.String(), currentId: t.String(), categoryId: t.String() },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "CurrentCategoryItem" },
);

export const CurrentCategoryItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      currentId: t.Boolean(),
      categoryId: t.Boolean(),
      category: t.Boolean(),
      current: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const CurrentCategoryItemInclude = t.Partial(
  t.Object(
    { category: t.Boolean(), current: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const CurrentCategoryItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      currentId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      categoryId: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const CurrentCategoryItem = t.Composite(
  [CurrentCategoryItemPlain, CurrentCategoryItemRelations],
  { additionalProperties: true },
);

export const CurrentCategoryItemInputCreate = t.Composite(
  [
    CurrentCategoryItemPlainInputCreate,
    CurrentCategoryItemRelationsInputCreate,
  ],
  { additionalProperties: true },
);

export const CurrentCategoryItemInputUpdate = t.Composite(
  [
    CurrentCategoryItemPlainInputUpdate,
    CurrentCategoryItemRelationsInputUpdate,
  ],
  { additionalProperties: true },
);
