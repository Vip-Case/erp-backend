import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const StockCardWarehousePlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    stockCardId: t.String({ additionalProperties: true }),
    warehouseId: t.String({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const StockCardWarehouseRelations = t.Object(
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
  },
  { additionalProperties: true },
);

export const StockCardWarehousePlainInputCreate = t.Object(
  {},
  { additionalProperties: true },
);

export const StockCardWarehousePlainInputUpdate = t.Object(
  {},
  { additionalProperties: true },
);

export const StockCardWarehouseRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: true },
);

export const StockCardWarehouseRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardWarehouseWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        stockCardId: t.String(),
        warehouseId: t.String(),
      }),
    { $id: "StockCardWarehouse" },
  ),
  { additionalProperties: true },
);

export const StockCardWarehouseWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object({
          id: t.String(),
          stockCardId_warehouseId: t.Object({
            stockCardId: t.String(),
            warehouseId: t.String(),
          }),
        }),
      ),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({
          stockCardId_warehouseId: t.Object({
            stockCardId: t.String(),
            warehouseId: t.String(),
          }),
        }),
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
          { id: t.String(), stockCardId: t.String(), warehouseId: t.String() },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "StockCardWarehouse" },
);

export const StockCardWarehouseSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      stockCardId: t.Boolean(),
      warehouseId: t.Boolean(),
      stockCard: t.Boolean(),
      warehouse: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardWarehouseInclude = t.Partial(
  t.Object(
    { stockCard: t.Boolean(), warehouse: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardWarehouseOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      stockCardId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      warehouseId: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardWarehouse = t.Composite(
  [StockCardWarehousePlain, StockCardWarehouseRelations],
  { additionalProperties: true },
);

export const StockCardWarehouseInputCreate = t.Composite(
  [StockCardWarehousePlainInputCreate, StockCardWarehouseRelationsInputCreate],
  { additionalProperties: true },
);

export const StockCardWarehouseInputUpdate = t.Composite(
  [StockCardWarehousePlainInputUpdate, StockCardWarehouseRelationsInputUpdate],
  { additionalProperties: true },
);
