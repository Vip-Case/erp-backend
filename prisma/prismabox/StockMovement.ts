import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const StockMovementPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    productCode: t.String({ additionalProperties: true }),
    warehouseCode: t.String({ additionalProperties: true }),
    branchCode: t.String({ additionalProperties: true }),
    currentCode: __nullable__(t.String({ additionalProperties: true })),
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
    documentNo: __nullable__(t.String({ additionalProperties: true })),
    gcCode: __nullable__(t.String({ additionalProperties: true })),
    type: __nullable__(t.String({ additionalProperties: true })),
    description: __nullable__(t.String({ additionalProperties: true })),
    quantity: __nullable__(t.Number({ additionalProperties: true })),
    unitPrice: __nullable__(t.Number({ additionalProperties: true })),
    totalPrice: __nullable__(t.Number({ additionalProperties: true })),
    unitOfMeasure: __nullable__(t.String({ additionalProperties: true })),
    outWarehouseCode: __nullable__(t.String({ additionalProperties: true })),
    priceListId: __nullable__(t.String({ additionalProperties: true })),
    createdAt: t.Date({ additionalProperties: true }),
    createdBy: __nullable__(t.String({ additionalProperties: true })),
    updatedAt: __nullable__(t.Date({ additionalProperties: true })),
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
    current: __nullable__(
      t.Object(
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
    ),
    invoice: __nullable__(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          invoiceNo: t.String({ additionalProperties: true }),
          gibInvoiceNo: __nullable__(t.String({ additionalProperties: true })),
          invoiceDate: __nullable__(t.Date({ additionalProperties: true })),
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
          currentCode: __nullable__(t.String({ additionalProperties: true })),
          companyCode: __nullable__(t.String({ additionalProperties: true })),
          branchCode: t.String({ additionalProperties: true }),
          outBranchCode: __nullable__(t.String({ additionalProperties: true })),
          warehouseCode: t.String({ additionalProperties: true }),
          description: __nullable__(t.String({ additionalProperties: true })),
          genelIskontoTutar: __nullable__(
            t.Number({ additionalProperties: true }),
          ),
          genelIskontoOran: __nullable__(
            t.Number({ additionalProperties: true }),
          ),
          paymentDate: __nullable__(t.Date({ additionalProperties: true })),
          paymentDay: __nullable__(t.Integer({ additionalProperties: true })),
          priceListId: __nullable__(t.String({ additionalProperties: true })),
          totalAmount: __nullable__(t.Number({ additionalProperties: true })),
          totalVat: __nullable__(t.Number({ additionalProperties: true })),
          totalDiscount: __nullable__(t.Number({ additionalProperties: true })),
          totalNet: __nullable__(t.Number({ additionalProperties: true })),
          totalPaid: __nullable__(t.Number({ additionalProperties: true })),
          totalDebt: __nullable__(t.Number({ additionalProperties: true })),
          totalBalance: __nullable__(t.Number({ additionalProperties: true })),
          createdAt: t.Date({ additionalProperties: true }),
          updatedAt: t.Date({ additionalProperties: true }),
          canceledAt: __nullable__(t.Date({ additionalProperties: true })),
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
    currentCode: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    documentType: t.Optional(
      __nullable__(
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
    ),
    invoiceType: t.Optional(
      __nullable__(
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
    documentNo: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    gcCode: t.Optional(__nullable__(t.String({ additionalProperties: true }))),
    type: t.Optional(__nullable__(t.String({ additionalProperties: true }))),
    description: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    quantity: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    unitPrice: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    totalPrice: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    unitOfMeasure: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    outWarehouseCode: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
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
    currentCode: __nullable__(t.String({ additionalProperties: true })),
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
    documentNo: __nullable__(t.String({ additionalProperties: true })),
    gcCode: __nullable__(t.String({ additionalProperties: true })),
    type: __nullable__(t.String({ additionalProperties: true })),
    description: __nullable__(t.String({ additionalProperties: true })),
    quantity: __nullable__(t.Number({ additionalProperties: true })),
    unitPrice: __nullable__(t.Number({ additionalProperties: true })),
    totalPrice: __nullable__(t.Number({ additionalProperties: true })),
    unitOfMeasure: __nullable__(t.String({ additionalProperties: true })),
    outWarehouseCode: __nullable__(t.String({ additionalProperties: true })),
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
    current: t.Optional(
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
    invoice: t.Optional(
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
      current: t.Partial(
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
      invoice: t.Partial(
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
        documentNo: t.String(),
        gcCode: t.String(),
        type: t.String(),
        description: t.String(),
        quantity: t.Number(),
        unitPrice: t.Number(),
        totalPrice: t.Number(),
        unitOfMeasure: t.String(),
        outWarehouseCode: t.String(),
        priceListId: t.String(),
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
            documentNo: t.String(),
            gcCode: t.String(),
            type: t.String(),
            description: t.String(),
            quantity: t.Number(),
            unitPrice: t.Number(),
            totalPrice: t.Number(),
            unitOfMeasure: t.String(),
            outWarehouseCode: t.String(),
            priceListId: t.String(),
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
      documentNo: t.Boolean(),
      gcCode: t.Boolean(),
      type: t.Boolean(),
      description: t.Boolean(),
      quantity: t.Boolean(),
      unitPrice: t.Boolean(),
      totalPrice: t.Boolean(),
      unitOfMeasure: t.Boolean(),
      outWarehouseCode: t.Boolean(),
      priceListId: t.Boolean(),
      createdAt: t.Boolean(),
      createdBy: t.Boolean(),
      updatedAt: t.Boolean(),
      updatedBy: t.Boolean(),
      stockCard: t.Boolean(),
      warehouse: t.Boolean(),
      branch: t.Boolean(),
      outWarehouse: t.Boolean(),
      priceList: t.Boolean(),
      current: t.Boolean(),
      invoice: t.Boolean(),
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
      current: t.Boolean(),
      invoice: t.Boolean(),
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
      documentNo: t.Union([t.Literal("asc"), t.Literal("desc")]),
      gcCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      type: t.Union([t.Literal("asc"), t.Literal("desc")]),
      description: t.Union([t.Literal("asc"), t.Literal("desc")]),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")]),
      unitPrice: t.Union([t.Literal("asc"), t.Literal("desc")]),
      totalPrice: t.Union([t.Literal("asc"), t.Literal("desc")]),
      unitOfMeasure: t.Union([t.Literal("asc"), t.Literal("desc")]),
      outWarehouseCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      priceListId: t.Union([t.Literal("asc"), t.Literal("desc")]),
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
