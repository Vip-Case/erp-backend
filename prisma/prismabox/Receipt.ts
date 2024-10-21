import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const ReceiptPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    receiptType: t.Union(
      [
        t.Literal("Devir"),
        t.Literal("Sayim"),
        t.Literal("Nakil"),
        t.Literal("Giris"),
        t.Literal("Cikis"),
        t.Literal("Fire"),
      ],
      { additionalProperties: true },
    ),
    receiptDate: t.Date({ additionalProperties: true }),
    documentNo: t.String({ additionalProperties: true }),
    branchCode: t.String({ additionalProperties: true }),
    warehouseCode: t.String({ additionalProperties: true }),
    description: __nullable__(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const ReceiptRelations = t.Object(
  {
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
    warehouse: t.Object(
      {
        id: t.String({ additionalProperties: true }),
        warehouseName: t.String({ additionalProperties: true }),
        warehouseCode: t.String({ additionalProperties: true }),
        address: t.String({ additionalProperties: true }),
        countryCode: t.String({ additionalProperties: true }),
        city: t.String({ additionalProperties: true }),
        district: t.String({ additionalProperties: true }),
        phone: t.String({ additionalProperties: true }),
        email: t.String({ additionalProperties: true }),
        companyCode: t.String({ additionalProperties: true }),
        createdAt: t.Date({ additionalProperties: true }),
        updatedAt: t.Date({ additionalProperties: true }),
        createdBy: __nullable__(t.String({ additionalProperties: true })),
        updatedBy: __nullable__(t.String({ additionalProperties: true })),
      },
      { additionalProperties: true },
    ),
    ReceiptDetail: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          receiptId: t.String({ additionalProperties: true }),
          productCode: t.String({ additionalProperties: true }),
          quantity: t.Number({ additionalProperties: true }),
          unitPrice: t.Number({ additionalProperties: true }),
          totalPrice: t.Number({ additionalProperties: true }),
          vatRate: t.Number({ additionalProperties: true }),
          discount: t.Number({ additionalProperties: true }),
          netPrice: t.Number({ additionalProperties: true }),
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

export const ReceiptPlainInputCreate = t.Object(
  {
    receiptType: t.Union(
      [
        t.Literal("Devir"),
        t.Literal("Sayim"),
        t.Literal("Nakil"),
        t.Literal("Giris"),
        t.Literal("Cikis"),
        t.Literal("Fire"),
      ],
      { additionalProperties: true },
    ),
    receiptDate: t.Optional(t.Date({ additionalProperties: true })),
    documentNo: t.String({ additionalProperties: true }),
    branchCode: t.String({ additionalProperties: true }),
    warehouseCode: t.String({ additionalProperties: true }),
    description: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
  },
  { additionalProperties: true },
);

export const ReceiptPlainInputUpdate = t.Object(
  {
    receiptType: t.Union(
      [
        t.Literal("Devir"),
        t.Literal("Sayim"),
        t.Literal("Nakil"),
        t.Literal("Giris"),
        t.Literal("Cikis"),
        t.Literal("Fire"),
      ],
      { additionalProperties: true },
    ),
    receiptDate: t.Optional(t.Date({ additionalProperties: true })),
    documentNo: t.String({ additionalProperties: true }),
    branchCode: t.String({ additionalProperties: true }),
    warehouseCode: t.String({ additionalProperties: true }),
    description: __nullable__(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const ReceiptRelationsInputCreate = t.Object(
  {
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
    warehouse: t.Object(
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
    ReceiptDetail: t.Optional(
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

export const ReceiptRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      warehouse: t.Object(
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
      ReceiptDetail: t.Partial(
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

export const ReceiptWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        receiptType: t.Union(
          [
            t.Literal("Devir"),
            t.Literal("Sayim"),
            t.Literal("Nakil"),
            t.Literal("Giris"),
            t.Literal("Cikis"),
            t.Literal("Fire"),
          ],
          { additionalProperties: true },
        ),
        receiptDate: t.Date(),
        documentNo: t.String(),
        branchCode: t.String(),
        warehouseCode: t.String(),
        description: t.String(),
      }),
    { $id: "Receipt" },
  ),
  { additionalProperties: true },
);

export const ReceiptWhereUnique = t.Recursive(
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
            receiptType: t.Union(
              [
                t.Literal("Devir"),
                t.Literal("Sayim"),
                t.Literal("Nakil"),
                t.Literal("Giris"),
                t.Literal("Cikis"),
                t.Literal("Fire"),
              ],
              { additionalProperties: true },
            ),
            receiptDate: t.Date(),
            documentNo: t.String(),
            branchCode: t.String(),
            warehouseCode: t.String(),
            description: t.String(),
          },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "Receipt" },
);

export const ReceiptSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      receiptType: t.Boolean(),
      receiptDate: t.Boolean(),
      documentNo: t.Boolean(),
      branchCode: t.Boolean(),
      warehouseCode: t.Boolean(),
      description: t.Boolean(),
      branch: t.Boolean(),
      warehouse: t.Boolean(),
      ReceiptDetail: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const ReceiptInclude = t.Partial(
  t.Object(
    {
      receiptType: t.Boolean(),
      branch: t.Boolean(),
      warehouse: t.Boolean(),
      ReceiptDetail: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const ReceiptOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      receiptDate: t.Union([t.Literal("asc"), t.Literal("desc")]),
      documentNo: t.Union([t.Literal("asc"), t.Literal("desc")]),
      branchCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      warehouseCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      description: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const Receipt = t.Composite([ReceiptPlain, ReceiptRelations], {
  additionalProperties: true,
});

export const ReceiptInputCreate = t.Composite(
  [ReceiptPlainInputCreate, ReceiptRelationsInputCreate],
  { additionalProperties: true },
);

export const ReceiptInputUpdate = t.Composite(
  [ReceiptPlainInputUpdate, ReceiptRelationsInputUpdate],
  { additionalProperties: true },
);
