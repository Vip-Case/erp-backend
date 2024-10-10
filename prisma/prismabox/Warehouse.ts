import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const WarehousePlain = t.Object(
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
);

export const WarehouseRelations = t.Object(
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
    Branch: t.Array(
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
    User: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          username: t.String({ additionalProperties: true }),
          password: t.String({ additionalProperties: true }),
          email: t.String({ additionalProperties: true }),
          firstName: t.String({ additionalProperties: true }),
          lastName: t.String({ additionalProperties: true }),
          phone: t.String({ additionalProperties: true }),
          address: t.String({ additionalProperties: true }),
          isActive: t.Boolean({ additionalProperties: true }),
          companyCode: t.String({ additionalProperties: true }),
          createdAt: t.Date({ additionalProperties: true }),
          updatedAt: t.Date({ additionalProperties: true }),
          createdBy: __nullable__(t.String({ additionalProperties: true })),
          updatedBy: __nullable__(t.String({ additionalProperties: true })),
        },
        { additionalProperties: true },
      ),
    ),
    Current: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          currentCode: t.String({ additionalProperties: true }),
          currentName: t.String({ additionalProperties: true }),
          currentType: t.String({ additionalProperties: true }),
          identityNo: t.String({ additionalProperties: true }),
          taxNumber: t.String({ additionalProperties: true }),
          taxOffice: t.String({ additionalProperties: true }),
          address: t.String({ additionalProperties: true }),
          countryCode: t.String({ additionalProperties: true }),
          city: t.String({ additionalProperties: true }),
          district: t.String({ additionalProperties: true }),
          phone: t.String({ additionalProperties: true }),
          email: t.String({ additionalProperties: true }),
          website: t.String({ additionalProperties: true }),
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
    ),
    stockMovements: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          productCode: t.String({ additionalProperties: true }),
          warehouseCode: t.String({ additionalProperties: true }),
          branchCode: t.String({ additionalProperties: true }),
          currentCode: t.String({ additionalProperties: true }),
          documentType: __nullable__(
            t.Union(
              [
                t.Literal("Invoice"),
                t.Literal("Order"),
                t.Literal("Waybill"),
                t.Literal("Other"),
              ],
              { additionalProperties: true },
            ),
          ),
          invoiceType: __nullable__(
            t.Union(
              [
                t.Literal("Purchase"),
                t.Literal("Sales"),
                t.Literal("Return"),
                t.Literal("Cancel"),
                t.Literal("Other"),
              ],
              { additionalProperties: true },
            ),
          ),
          movementType: t.Union(
            [
              t.Literal("Devir"),
              t.Literal("DepolarArasiTransfer"),
              t.Literal("Uretim"),
              t.Literal("Muhtelif"),
              t.Literal("Maliyet"),
              t.Literal("Konsinye"),
              t.Literal("Teshir"),
            ],
            { additionalProperties: true },
          ),
          invoiceNo: t.String({ additionalProperties: true }),
          invoiceDate: t.Date({ additionalProperties: true }),
          waybillNo: __nullable__(t.String({ additionalProperties: true })),
          waybillDate: __nullable__(t.Date({ additionalProperties: true })),
          gcCode: t.String({ additionalProperties: true }),
          type: t.String({ additionalProperties: true }),
          description: t.String({ additionalProperties: true }),
          quantity: t.Number({ additionalProperties: true }),
          unitPrice: t.Number({ additionalProperties: true }),
          totalPrice: t.Number({ additionalProperties: true }),
          unitOfMeasure: __nullable__(t.String({ additionalProperties: true })),
          outWarehouseCode: __nullable__(
            t.String({ additionalProperties: true }),
          ),
          priceListId: __nullable__(t.String({ additionalProperties: true })),
          discount1: __nullable__(t.Number({ additionalProperties: true })),
          discount2: __nullable__(t.Number({ additionalProperties: true })),
          discount3: __nullable__(t.Number({ additionalProperties: true })),
          discount4: __nullable__(t.Number({ additionalProperties: true })),
          createdAt: t.Date({ additionalProperties: true }),
          createdBy: __nullable__(t.String({ additionalProperties: true })),
          updatedAt: t.Date({ additionalProperties: true }),
          updatedBy: __nullable__(t.String({ additionalProperties: true })),
        },
        { additionalProperties: true },
      ),
    ),
    outMovements: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          productCode: t.String({ additionalProperties: true }),
          warehouseCode: t.String({ additionalProperties: true }),
          branchCode: t.String({ additionalProperties: true }),
          currentCode: t.String({ additionalProperties: true }),
          documentType: __nullable__(
            t.Union(
              [
                t.Literal("Invoice"),
                t.Literal("Order"),
                t.Literal("Waybill"),
                t.Literal("Other"),
              ],
              { additionalProperties: true },
            ),
          ),
          invoiceType: __nullable__(
            t.Union(
              [
                t.Literal("Purchase"),
                t.Literal("Sales"),
                t.Literal("Return"),
                t.Literal("Cancel"),
                t.Literal("Other"),
              ],
              { additionalProperties: true },
            ),
          ),
          movementType: t.Union(
            [
              t.Literal("Devir"),
              t.Literal("DepolarArasiTransfer"),
              t.Literal("Uretim"),
              t.Literal("Muhtelif"),
              t.Literal("Maliyet"),
              t.Literal("Konsinye"),
              t.Literal("Teshir"),
            ],
            { additionalProperties: true },
          ),
          invoiceNo: t.String({ additionalProperties: true }),
          invoiceDate: t.Date({ additionalProperties: true }),
          waybillNo: __nullable__(t.String({ additionalProperties: true })),
          waybillDate: __nullable__(t.Date({ additionalProperties: true })),
          gcCode: t.String({ additionalProperties: true }),
          type: t.String({ additionalProperties: true }),
          description: t.String({ additionalProperties: true }),
          quantity: t.Number({ additionalProperties: true }),
          unitPrice: t.Number({ additionalProperties: true }),
          totalPrice: t.Number({ additionalProperties: true }),
          unitOfMeasure: __nullable__(t.String({ additionalProperties: true })),
          outWarehouseCode: __nullable__(
            t.String({ additionalProperties: true }),
          ),
          priceListId: __nullable__(t.String({ additionalProperties: true })),
          discount1: __nullable__(t.Number({ additionalProperties: true })),
          discount2: __nullable__(t.Number({ additionalProperties: true })),
          discount3: __nullable__(t.Number({ additionalProperties: true })),
          discount4: __nullable__(t.Number({ additionalProperties: true })),
          createdAt: t.Date({ additionalProperties: true }),
          createdBy: __nullable__(t.String({ additionalProperties: true })),
          updatedAt: t.Date({ additionalProperties: true }),
          updatedBy: __nullable__(t.String({ additionalProperties: true })),
        },
        { additionalProperties: true },
      ),
    ),
    Invoice: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          invoiceNo: t.String({ additionalProperties: true }),
          gibInvoiceNo: __nullable__(t.String({ additionalProperties: true })),
          invoiceDate: t.Date({ additionalProperties: true }),
          invoiceType: t.Union(
            [
              t.Literal("Purchase"),
              t.Literal("Sales"),
              t.Literal("Return"),
              t.Literal("Cancel"),
              t.Literal("Other"),
            ],
            { additionalProperties: true },
          ),
          documentType: t.Union(
            [
              t.Literal("Invoice"),
              t.Literal("Order"),
              t.Literal("Waybill"),
              t.Literal("Other"),
            ],
            { additionalProperties: true },
          ),
          currentCode: t.String({ additionalProperties: true }),
          companyCode: t.String({ additionalProperties: true }),
          branchCode: t.String({ additionalProperties: true }),
          outBranchCode: __nullable__(t.String({ additionalProperties: true })),
          warehouseCode: t.String({ additionalProperties: true }),
          description: t.String({ additionalProperties: true }),
          genelIskontoTutar: t.Number({ additionalProperties: true }),
          genelIskontoOran: t.Number({ additionalProperties: true }),
          paymentDate: t.Date({ additionalProperties: true }),
          paymentDay: t.Integer({ additionalProperties: true }),
          priceListId: t.String({ additionalProperties: true }),
          totalAmount: t.Number({ additionalProperties: true }),
          totalVat: t.Number({ additionalProperties: true }),
          totalDiscount: t.Number({ additionalProperties: true }),
          totalNet: t.Number({ additionalProperties: true }),
          totalPaid: t.Number({ additionalProperties: true }),
          totalDebt: t.Number({ additionalProperties: true }),
          totalBalance: t.Number({ additionalProperties: true }),
          createdAt: t.Date({ additionalProperties: true }),
          updatedAt: t.Date({ additionalProperties: true }),
          canceledAt: t.Date({ additionalProperties: true }),
          createdBy: __nullable__(t.String({ additionalProperties: true })),
          updatedBy: __nullable__(t.String({ additionalProperties: true })),
        },
        { additionalProperties: true },
      ),
    ),
  },
  { additionalProperties: true },
);

export const WarehousePlainInputCreate = t.Object(
  {
    warehouseName: t.String({ additionalProperties: true }),
    warehouseCode: t.String({ additionalProperties: true }),
    address: t.String({ additionalProperties: true }),
    countryCode: t.String({ additionalProperties: true }),
    city: t.String({ additionalProperties: true }),
    district: t.String({ additionalProperties: true }),
    phone: t.String({ additionalProperties: true }),
    email: t.String({ additionalProperties: true }),
    companyCode: t.String({ additionalProperties: true }),
    createdBy: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    updatedBy: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
  },
  { additionalProperties: true },
);

export const WarehousePlainInputUpdate = t.Object(
  {
    warehouseName: t.String({ additionalProperties: true }),
    warehouseCode: t.String({ additionalProperties: true }),
    address: t.String({ additionalProperties: true }),
    countryCode: t.String({ additionalProperties: true }),
    city: t.String({ additionalProperties: true }),
    district: t.String({ additionalProperties: true }),
    phone: t.String({ additionalProperties: true }),
    email: t.String({ additionalProperties: true }),
    companyCode: t.String({ additionalProperties: true }),
    createdBy: __nullable__(t.String({ additionalProperties: true })),
    updatedBy: __nullable__(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const WarehouseRelationsInputCreate = t.Object(
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
    Branch: t.Optional(
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
    User: t.Optional(
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
    Current: t.Optional(
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
    stockMovements: t.Optional(
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
    outMovements: t.Optional(
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
    Invoice: t.Optional(
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

export const WarehouseRelationsInputUpdate = t.Partial(
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
      Branch: t.Partial(
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
      User: t.Partial(
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
      Current: t.Partial(
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
      stockMovements: t.Partial(
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
      outMovements: t.Partial(
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
      Invoice: t.Partial(
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

export const WarehouseWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        warehouseName: t.String(),
        warehouseCode: t.String(),
        address: t.String(),
        countryCode: t.String(),
        city: t.String(),
        district: t.String(),
        phone: t.String(),
        email: t.String(),
        companyCode: t.String(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
        createdBy: t.String(),
        updatedBy: t.String(),
      }),
    { $id: "Warehouse" },
  ),
  { additionalProperties: true },
);

export const WarehouseWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object({
          id: t.String(),
          warehouseName: t.String(),
          warehouseCode: t.String(),
        }),
      ),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({ warehouseName: t.String() }),
        t.Object({ warehouseCode: t.String() }),
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
            warehouseName: t.String(),
            warehouseCode: t.String(),
            address: t.String(),
            countryCode: t.String(),
            city: t.String(),
            district: t.String(),
            phone: t.String(),
            email: t.String(),
            companyCode: t.String(),
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
  { $id: "Warehouse" },
);

export const WarehouseSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      warehouseName: t.Boolean(),
      warehouseCode: t.Boolean(),
      address: t.Boolean(),
      countryCode: t.Boolean(),
      city: t.Boolean(),
      district: t.Boolean(),
      phone: t.Boolean(),
      email: t.Boolean(),
      companyCode: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      createdBy: t.Boolean(),
      updatedBy: t.Boolean(),
      company: t.Boolean(),
      Branch: t.Boolean(),
      User: t.Boolean(),
      Current: t.Boolean(),
      stockMovements: t.Boolean(),
      outMovements: t.Boolean(),
      Invoice: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const WarehouseInclude = t.Partial(
  t.Object(
    {
      company: t.Boolean(),
      Branch: t.Boolean(),
      User: t.Boolean(),
      Current: t.Boolean(),
      stockMovements: t.Boolean(),
      outMovements: t.Boolean(),
      Invoice: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const WarehouseOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      warehouseName: t.Union([t.Literal("asc"), t.Literal("desc")]),
      warehouseCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      address: t.Union([t.Literal("asc"), t.Literal("desc")]),
      countryCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      city: t.Union([t.Literal("asc"), t.Literal("desc")]),
      district: t.Union([t.Literal("asc"), t.Literal("desc")]),
      phone: t.Union([t.Literal("asc"), t.Literal("desc")]),
      email: t.Union([t.Literal("asc"), t.Literal("desc")]),
      companyCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const Warehouse = t.Composite([WarehousePlain, WarehouseRelations], {
  additionalProperties: true,
});

export const WarehouseInputCreate = t.Composite(
  [WarehousePlainInputCreate, WarehouseRelationsInputCreate],
  { additionalProperties: true },
);

export const WarehouseInputUpdate = t.Composite(
  [WarehousePlainInputUpdate, WarehouseRelationsInputUpdate],
  { additionalProperties: true },
);
