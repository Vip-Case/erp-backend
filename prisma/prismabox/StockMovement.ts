import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const StockMovementPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    productCode: t.String({ additionalProperties: true }),
    warehouseCode: t.String({ additionalProperties: true }),
    branchCode: t.String({ additionalProperties: true }),
    currentCode: t.String({ additionalProperties: true }),
    documentType: t.Union(
      [
        t.Literal("Invoice"),
        t.Literal("Order"),
        t.Literal("Waybill"),
        t.Literal("Other"),
      ],
      { additionalProperties: true },
    ),
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
    outWarehouseCode: __nullable__(t.String({ additionalProperties: true })),
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
);

export const StockMovementRelations = t.Object(
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
        warehouseCode: __nullable__(t.String({ additionalProperties: true })),
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
    warehouse: t.Object(
      {
        id: t.String({ additionalProperties: true }),
        warehouseName: t.String({ additionalProperties: true }),
        warehouseCode: t.String({ additionalProperties: true }),
        stockCardId: __nullable__(t.String({ additionalProperties: true })),
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
    outWarehouse: __nullable__(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          warehouseName: t.String({ additionalProperties: true }),
          warehouseCode: t.String({ additionalProperties: true }),
          stockCardId: __nullable__(t.String({ additionalProperties: true })),
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
    ),
    priceList: __nullable__(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          priceListName: t.String({ additionalProperties: true }),
          currency: t.String({ additionalProperties: true }),
          isActive: t.Boolean({ additionalProperties: true }),
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
  },
  { additionalProperties: true },
);

export const StockMovementPlainInputCreate = t.Object(
  {
    productCode: t.String({ additionalProperties: true }),
    warehouseCode: t.String({ additionalProperties: true }),
    branchCode: t.String({ additionalProperties: true }),
    currentCode: t.String({ additionalProperties: true }),
    documentType: t.Union(
      [
        t.Literal("Invoice"),
        t.Literal("Order"),
        t.Literal("Waybill"),
        t.Literal("Other"),
      ],
      { additionalProperties: true },
    ),
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
    waybillNo: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    waybillDate: t.Optional(
      __nullable__(t.Date({ additionalProperties: true })),
    ),
    gcCode: t.String({ additionalProperties: true }),
    type: t.String({ additionalProperties: true }),
    description: t.String({ additionalProperties: true }),
    quantity: t.Number({ additionalProperties: true }),
    unitPrice: t.Number({ additionalProperties: true }),
    totalPrice: t.Number({ additionalProperties: true }),
    unitOfMeasure: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    outWarehouseCode: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    discount1: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    discount2: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    discount3: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    discount4: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    createdBy: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    updatedBy: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
  },
  { additionalProperties: true },
);

export const StockMovementPlainInputUpdate = t.Object(
  {
    productCode: t.String({ additionalProperties: true }),
    warehouseCode: t.String({ additionalProperties: true }),
    branchCode: t.String({ additionalProperties: true }),
    currentCode: t.String({ additionalProperties: true }),
    documentType: t.Union(
      [
        t.Literal("Invoice"),
        t.Literal("Order"),
        t.Literal("Waybill"),
        t.Literal("Other"),
      ],
      { additionalProperties: true },
    ),
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
    outWarehouseCode: __nullable__(t.String({ additionalProperties: true })),
    discount1: __nullable__(t.Number({ additionalProperties: true })),
    discount2: __nullable__(t.Number({ additionalProperties: true })),
    discount3: __nullable__(t.Number({ additionalProperties: true })),
    discount4: __nullable__(t.Number({ additionalProperties: true })),
    createdBy: __nullable__(t.String({ additionalProperties: true })),
    updatedBy: __nullable__(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const StockMovementRelationsInputCreate = t.Object(
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
    outWarehouse: t.Optional(
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
    priceList: t.Optional(
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
  },
  { additionalProperties: true },
);

export const StockMovementRelationsInputUpdate = t.Partial(
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
      outWarehouse: t.Partial(
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
      priceList: t.Partial(
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
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockMovementWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        productCode: t.String(),
        warehouseCode: t.String(),
        branchCode: t.String(),
        currentCode: t.String(),
        documentType: t.Union(
          [
            t.Literal("Invoice"),
            t.Literal("Order"),
            t.Literal("Waybill"),
            t.Literal("Other"),
          ],
          { additionalProperties: true },
        ),
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
        invoiceNo: t.String(),
        invoiceDate: t.Date(),
        waybillNo: t.String(),
        waybillDate: t.Date(),
        gcCode: t.String(),
        type: t.String(),
        description: t.String(),
        quantity: t.Number(),
        unitPrice: t.Number(),
        totalPrice: t.Number(),
        unitOfMeasure: t.String(),
        outWarehouseCode: t.String(),
        priceListId: t.String(),
        discount1: t.Number(),
        discount2: t.Number(),
        discount3: t.Number(),
        discount4: t.Number(),
        createdAt: t.Date(),
        createdBy: t.String(),
        updatedAt: t.Date(),
        updatedBy: t.String(),
      }),
    { $id: "StockMovement" },
  ),
  { additionalProperties: true },
);

export const StockMovementWhereUnique = t.Recursive(
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
            productCode: t.String(),
            warehouseCode: t.String(),
            branchCode: t.String(),
            currentCode: t.String(),
            documentType: t.Union(
              [
                t.Literal("Invoice"),
                t.Literal("Order"),
                t.Literal("Waybill"),
                t.Literal("Other"),
              ],
              { additionalProperties: true },
            ),
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
            invoiceNo: t.String(),
            invoiceDate: t.Date(),
            waybillNo: t.String(),
            waybillDate: t.Date(),
            gcCode: t.String(),
            type: t.String(),
            description: t.String(),
            quantity: t.Number(),
            unitPrice: t.Number(),
            totalPrice: t.Number(),
            unitOfMeasure: t.String(),
            outWarehouseCode: t.String(),
            priceListId: t.String(),
            discount1: t.Number(),
            discount2: t.Number(),
            discount3: t.Number(),
            discount4: t.Number(),
            createdAt: t.Date(),
            createdBy: t.String(),
            updatedAt: t.Date(),
            updatedBy: t.String(),
          },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "StockMovement" },
);

export const StockMovementSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      productCode: t.Boolean(),
      warehouseCode: t.Boolean(),
      branchCode: t.Boolean(),
      currentCode: t.Boolean(),
      documentType: t.Boolean(),
      invoiceType: t.Boolean(),
      movementType: t.Boolean(),
      invoiceNo: t.Boolean(),
      invoiceDate: t.Boolean(),
      waybillNo: t.Boolean(),
      waybillDate: t.Boolean(),
      gcCode: t.Boolean(),
      type: t.Boolean(),
      description: t.Boolean(),
      quantity: t.Boolean(),
      unitPrice: t.Boolean(),
      totalPrice: t.Boolean(),
      unitOfMeasure: t.Boolean(),
      outWarehouseCode: t.Boolean(),
      priceListId: t.Boolean(),
      discount1: t.Boolean(),
      discount2: t.Boolean(),
      discount3: t.Boolean(),
      discount4: t.Boolean(),
      createdAt: t.Boolean(),
      createdBy: t.Boolean(),
      updatedAt: t.Boolean(),
      updatedBy: t.Boolean(),
      stockCard: t.Boolean(),
      warehouse: t.Boolean(),
      branch: t.Boolean(),
      outWarehouse: t.Boolean(),
      priceList: t.Boolean(),
      Current: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockMovementInclude = t.Partial(
  t.Object(
    {
      documentType: t.Boolean(),
      invoiceType: t.Boolean(),
      movementType: t.Boolean(),
      stockCard: t.Boolean(),
      warehouse: t.Boolean(),
      branch: t.Boolean(),
      outWarehouse: t.Boolean(),
      priceList: t.Boolean(),
      Current: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockMovementOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      productCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      warehouseCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      branchCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      currentCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      invoiceNo: t.Union([t.Literal("asc"), t.Literal("desc")]),
      invoiceDate: t.Union([t.Literal("asc"), t.Literal("desc")]),
      waybillNo: t.Union([t.Literal("asc"), t.Literal("desc")]),
      waybillDate: t.Union([t.Literal("asc"), t.Literal("desc")]),
      gcCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      type: t.Union([t.Literal("asc"), t.Literal("desc")]),
      description: t.Union([t.Literal("asc"), t.Literal("desc")]),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")]),
      unitPrice: t.Union([t.Literal("asc"), t.Literal("desc")]),
      totalPrice: t.Union([t.Literal("asc"), t.Literal("desc")]),
      unitOfMeasure: t.Union([t.Literal("asc"), t.Literal("desc")]),
      outWarehouseCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      priceListId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      discount1: t.Union([t.Literal("asc"), t.Literal("desc")]),
      discount2: t.Union([t.Literal("asc"), t.Literal("desc")]),
      discount3: t.Union([t.Literal("asc"), t.Literal("desc")]),
      discount4: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockMovement = t.Composite(
  [StockMovementPlain, StockMovementRelations],
  { additionalProperties: true },
);

export const StockMovementInputCreate = t.Composite(
  [StockMovementPlainInputCreate, StockMovementRelationsInputCreate],
  { additionalProperties: true },
);

export const StockMovementInputUpdate = t.Composite(
  [StockMovementPlainInputUpdate, StockMovementRelationsInputUpdate],
  { additionalProperties: true },
);
