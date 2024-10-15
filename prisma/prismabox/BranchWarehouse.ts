import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const BranchWarehousePlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    branchId: t.String({ additionalProperties: true }),
    warehouseId: t.String({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const BranchWarehouseRelations = t.Object(
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
  },
  { additionalProperties: true },
);

export const BranchWarehousePlainInputCreate = t.Object(
  {},
  { additionalProperties: true },
);

export const BranchWarehousePlainInputUpdate = t.Object(
  {},
  { additionalProperties: true },
);

export const BranchWarehouseRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: true },
);

export const BranchWarehouseRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const BranchWarehouseWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        branchId: t.String(),
        warehouseId: t.String(),
      }),
    { $id: "BranchWarehouse" },
  ),
  { additionalProperties: true },
);

export const BranchWarehouseWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object({
          id: t.String(),
          branchId_warehouseId: t.Object({
            branchId: t.String(),
            warehouseId: t.String(),
          }),
        }),
      ),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({
          branchId_warehouseId: t.Object({
            branchId: t.String(),
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
          { id: t.String(), branchId: t.String(), warehouseId: t.String() },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "BranchWarehouse" },
);

export const BranchWarehouseSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      branchId: t.Boolean(),
      warehouseId: t.Boolean(),
      branch: t.Boolean(),
      warehouse: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const BranchWarehouseInclude = t.Partial(
  t.Object(
    { branch: t.Boolean(), warehouse: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const BranchWarehouseOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      branchId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      warehouseId: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const BranchWarehouse = t.Composite(
  [BranchWarehousePlain, BranchWarehouseRelations],
  { additionalProperties: true },
);

export const BranchWarehouseInputCreate = t.Composite(
  [BranchWarehousePlainInputCreate, BranchWarehouseRelationsInputCreate],
  { additionalProperties: true },
);

export const BranchWarehouseInputUpdate = t.Composite(
  [BranchWarehousePlainInputUpdate, BranchWarehouseRelationsInputUpdate],
  { additionalProperties: true },
);
