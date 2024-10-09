import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const CurrentMovementPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    currentCode: t.String({ additionalProperties: true }),
    dueDate: t.Date({ additionalProperties: true }),
    description: t.String({ additionalProperties: true }),
    debtAmount: t.Number({ additionalProperties: true }),
    creditAmount: t.Number({ additionalProperties: true }),
    balanceAmount: t.Number({ additionalProperties: true }),
    priceListId: t.String({ additionalProperties: true }),
    movementType: t.Union([t.Literal("Borc"), t.Literal("Alacak")], {
      additionalProperties: true,
    }),
    documentType: t.Union(
      [
        t.Literal("Devir"),
        t.Literal("Fatura"),
        t.Literal("IadeFatura"),
        t.Literal("Kasa"),
        t.Literal("MusteriSeneti"),
        t.Literal("BorcSeneti"),
        t.Literal("MusteriCeki"),
        t.Literal("BorcCeki"),
        t.Literal("KarsiliksizCek"),
        t.Literal("Muhtelif"),
      ],
      { additionalProperties: true },
    ),
    companyCode: t.String({ additionalProperties: true }),
    branchCode: t.String({ additionalProperties: true }),
    createdAt: t.Date({ additionalProperties: true }),
    updatedAt: t.Date({ additionalProperties: true }),
    createdBy: __nullable__(t.String({ additionalProperties: true })),
    updatedBy: __nullable__(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const CurrentMovementRelations = t.Object(
  {
    company: t.Object(
      {
        id: t.String({ additionalProperties: true }),
        companyName: t.String({ additionalProperties: true }),
        companyCode: t.String({ additionalProperties: true }),
        taxNumber: t.String({ additionalProperties: true }),
        taxOffice: t.String({ additionalProperties: true }),
        address: t.String({ additionalProperties: true }),
        countryCode: t.String({ additionalProperties: true }),
        city: t.String({ additionalProperties: true }),
        district: t.String({ additionalProperties: true }),
        phone: t.String({ additionalProperties: true }),
        email: t.String({ additionalProperties: true }),
        website: t.String({ additionalProperties: true }),
        createdAt: t.Date({ additionalProperties: true }),
        updatedAt: t.Date({ additionalProperties: true }),
        createdBy: __nullable__(t.String({ additionalProperties: true })),
        updatedBy: __nullable__(t.String({ additionalProperties: true })),
      },
      { additionalProperties: true },
    ),
    branch: t.Object(
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
    StockCardPriceList: t.Object(
      {
        id: t.String({ additionalProperties: true }),
        priceListName: t.String({ additionalProperties: true }),
        currency: t.String({ additionalProperties: true }),
        isActive: t.Boolean({ additionalProperties: true }),
      },
      { additionalProperties: true },
    ),
  },
  { additionalProperties: true },
);

export const CurrentMovementPlainInputCreate = t.Object(
  {
    currentCode: t.String({ additionalProperties: true }),
    dueDate: t.Date({ additionalProperties: true }),
    description: t.String({ additionalProperties: true }),
    debtAmount: t.Number({ additionalProperties: true }),
    creditAmount: t.Number({ additionalProperties: true }),
    balanceAmount: t.Number({ additionalProperties: true }),
    movementType: t.Union([t.Literal("Borc"), t.Literal("Alacak")], {
      additionalProperties: true,
    }),
    documentType: t.Union(
      [
        t.Literal("Devir"),
        t.Literal("Fatura"),
        t.Literal("IadeFatura"),
        t.Literal("Kasa"),
        t.Literal("MusteriSeneti"),
        t.Literal("BorcSeneti"),
        t.Literal("MusteriCeki"),
        t.Literal("BorcCeki"),
        t.Literal("KarsiliksizCek"),
        t.Literal("Muhtelif"),
      ],
      { additionalProperties: true },
    ),
    companyCode: t.String({ additionalProperties: true }),
    branchCode: t.String({ additionalProperties: true }),
    createdBy: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    updatedBy: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
  },
  { additionalProperties: true },
);

export const CurrentMovementPlainInputUpdate = t.Object(
  {
    currentCode: t.String({ additionalProperties: true }),
    dueDate: t.Date({ additionalProperties: true }),
    description: t.String({ additionalProperties: true }),
    debtAmount: t.Number({ additionalProperties: true }),
    creditAmount: t.Number({ additionalProperties: true }),
    balanceAmount: t.Number({ additionalProperties: true }),
    movementType: t.Union([t.Literal("Borc"), t.Literal("Alacak")], {
      additionalProperties: true,
    }),
    documentType: t.Union(
      [
        t.Literal("Devir"),
        t.Literal("Fatura"),
        t.Literal("IadeFatura"),
        t.Literal("Kasa"),
        t.Literal("MusteriSeneti"),
        t.Literal("BorcSeneti"),
        t.Literal("MusteriCeki"),
        t.Literal("BorcCeki"),
        t.Literal("KarsiliksizCek"),
        t.Literal("Muhtelif"),
      ],
      { additionalProperties: true },
    ),
    companyCode: t.String({ additionalProperties: true }),
    branchCode: t.String({ additionalProperties: true }),
    createdBy: __nullable__(t.String({ additionalProperties: true })),
    updatedBy: __nullable__(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const CurrentMovementRelationsInputCreate = t.Object(
  {
    company: t.Object(
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
    branch: t.Object(
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
    StockCardPriceList: t.Object(
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

export const CurrentMovementRelationsInputUpdate = t.Partial(
  t.Object(
    {
      company: t.Object(
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
      branch: t.Object(
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
      StockCardPriceList: t.Object(
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

export const CurrentMovementWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        currentCode: t.String(),
        dueDate: t.Date(),
        description: t.String(),
        debtAmount: t.Number(),
        creditAmount: t.Number(),
        balanceAmount: t.Number(),
        priceListId: t.String(),
        movementType: t.Union([t.Literal("Borc"), t.Literal("Alacak")], {
          additionalProperties: true,
        }),
        documentType: t.Union(
          [
            t.Literal("Devir"),
            t.Literal("Fatura"),
            t.Literal("IadeFatura"),
            t.Literal("Kasa"),
            t.Literal("MusteriSeneti"),
            t.Literal("BorcSeneti"),
            t.Literal("MusteriCeki"),
            t.Literal("BorcCeki"),
            t.Literal("KarsiliksizCek"),
            t.Literal("Muhtelif"),
          ],
          { additionalProperties: true },
        ),
        companyCode: t.String(),
        branchCode: t.String(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
        createdBy: t.String(),
        updatedBy: t.String(),
      }),
    { $id: "CurrentMovement" },
  ),
  { additionalProperties: true },
);

export const CurrentMovementWhereUnique = t.Recursive(
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
            currentCode: t.String(),
            dueDate: t.Date(),
            description: t.String(),
            debtAmount: t.Number(),
            creditAmount: t.Number(),
            balanceAmount: t.Number(),
            priceListId: t.String(),
            movementType: t.Union([t.Literal("Borc"), t.Literal("Alacak")], {
              additionalProperties: true,
            }),
            documentType: t.Union(
              [
                t.Literal("Devir"),
                t.Literal("Fatura"),
                t.Literal("IadeFatura"),
                t.Literal("Kasa"),
                t.Literal("MusteriSeneti"),
                t.Literal("BorcSeneti"),
                t.Literal("MusteriCeki"),
                t.Literal("BorcCeki"),
                t.Literal("KarsiliksizCek"),
                t.Literal("Muhtelif"),
              ],
              { additionalProperties: true },
            ),
            companyCode: t.String(),
            branchCode: t.String(),
            createdAt: t.Date(),
            updatedAt: t.Date(),
            createdBy: t.String(),
            updatedBy: t.String(),
          },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "CurrentMovement" },
);

export const CurrentMovementSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      currentCode: t.Boolean(),
      dueDate: t.Boolean(),
      description: t.Boolean(),
      debtAmount: t.Boolean(),
      creditAmount: t.Boolean(),
      balanceAmount: t.Boolean(),
      priceListId: t.Boolean(),
      movementType: t.Boolean(),
      documentType: t.Boolean(),
      companyCode: t.Boolean(),
      branchCode: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      createdBy: t.Boolean(),
      updatedBy: t.Boolean(),
      company: t.Boolean(),
      branch: t.Boolean(),
      StockCardPriceList: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const CurrentMovementInclude = t.Partial(
  t.Object(
    {
      movementType: t.Boolean(),
      documentType: t.Boolean(),
      company: t.Boolean(),
      branch: t.Boolean(),
      StockCardPriceList: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const CurrentMovementOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      currentCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      dueDate: t.Union([t.Literal("asc"), t.Literal("desc")]),
      description: t.Union([t.Literal("asc"), t.Literal("desc")]),
      debtAmount: t.Union([t.Literal("asc"), t.Literal("desc")]),
      creditAmount: t.Union([t.Literal("asc"), t.Literal("desc")]),
      balanceAmount: t.Union([t.Literal("asc"), t.Literal("desc")]),
      priceListId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      companyCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      branchCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const CurrentMovement = t.Composite(
  [CurrentMovementPlain, CurrentMovementRelations],
  { additionalProperties: true },
);

export const CurrentMovementInputCreate = t.Composite(
  [CurrentMovementPlainInputCreate, CurrentMovementRelationsInputCreate],
  { additionalProperties: true },
);

export const CurrentMovementInputUpdate = t.Composite(
  [CurrentMovementPlainInputUpdate, CurrentMovementRelationsInputUpdate],
  { additionalProperties: true },
);
