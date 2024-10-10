import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const CurrentPlain = t.Object(
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
);

export const CurrentRelations = t.Object(
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
    priceList: t.Object(
      {
        id: t.String({ additionalProperties: true }),
        priceListName: t.String({ additionalProperties: true }),
        currency: t.String({ additionalProperties: true }),
        isActive: t.Boolean({ additionalProperties: true }),
      },
      { additionalProperties: true },
    ),
    StockCard: t.Array(
      t.Object(
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
          riskQuantities: __nullable__(
            t.Number({ additionalProperties: true }),
          ),
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
    ),
    CurrentReportGroup: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          groupCode: t.String({ additionalProperties: true }),
          description: t.String({ additionalProperties: true }),
          parentGroupId: __nullable__(t.String({ additionalProperties: true })),
          createdAt: t.Date({ additionalProperties: true }),
          updatedAt: t.Date({ additionalProperties: true }),
          createdBy: __nullable__(t.String({ additionalProperties: true })),
          updatedBy: __nullable__(t.String({ additionalProperties: true })),
        },
        { additionalProperties: true },
      ),
    ),
    StockMovement: t.Array(
      t.Object(
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
          outWarehouseCode: __nullable__(
            t.String({ additionalProperties: true }),
          ),
          priceListId: __nullable__(t.String({ additionalProperties: true })),
          createdAt: t.Date({ additionalProperties: true }),
          createdBy: __nullable__(t.String({ additionalProperties: true })),
          updatedAt: __nullable__(t.Date({ additionalProperties: true })),
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

export const CurrentPlainInputCreate = t.Object(
  {
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
    createdBy: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    updatedBy: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
  },
  { additionalProperties: true },
);

export const CurrentPlainInputUpdate = t.Object(
  {
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
    createdBy: __nullable__(t.String({ additionalProperties: true })),
    updatedBy: __nullable__(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const CurrentRelationsInputCreate = t.Object(
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
    priceList: t.Object(
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
    StockCard: t.Optional(
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
    CurrentReportGroup: t.Optional(
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
    StockMovement: t.Optional(
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

export const CurrentRelationsInputUpdate = t.Partial(
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
      priceList: t.Object(
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
      StockCard: t.Partial(
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
      CurrentReportGroup: t.Partial(
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
      StockMovement: t.Partial(
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

export const CurrentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        currentCode: t.String(),
        currentName: t.String(),
        currentType: t.String(),
        identityNo: t.String(),
        taxNumber: t.String(),
        taxOffice: t.String(),
        address: t.String(),
        countryCode: t.String(),
        city: t.String(),
        district: t.String(),
        phone: t.String(),
        email: t.String(),
        website: t.String(),
        companyCode: t.String(),
        branchCode: t.String(),
        warehouseCode: t.String(),
        priceListId: t.String(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
        createdBy: t.String(),
        updatedBy: t.String(),
      }),
    { $id: "Current" },
  ),
  { additionalProperties: true },
);

export const CurrentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(t.Object({ id: t.String(), currentCode: t.String() })),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({ currentCode: t.String() }),
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
            currentCode: t.String(),
            currentName: t.String(),
            currentType: t.String(),
            identityNo: t.String(),
            taxNumber: t.String(),
            taxOffice: t.String(),
            address: t.String(),
            countryCode: t.String(),
            city: t.String(),
            district: t.String(),
            phone: t.String(),
            email: t.String(),
            website: t.String(),
            companyCode: t.String(),
            branchCode: t.String(),
            warehouseCode: t.String(),
            priceListId: t.String(),
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
  { $id: "Current" },
);

export const CurrentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      currentCode: t.Boolean(),
      currentName: t.Boolean(),
      currentType: t.Boolean(),
      identityNo: t.Boolean(),
      taxNumber: t.Boolean(),
      taxOffice: t.Boolean(),
      address: t.Boolean(),
      countryCode: t.Boolean(),
      city: t.Boolean(),
      district: t.Boolean(),
      phone: t.Boolean(),
      email: t.Boolean(),
      website: t.Boolean(),
      companyCode: t.Boolean(),
      branchCode: t.Boolean(),
      warehouseCode: t.Boolean(),
      priceListId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      createdBy: t.Boolean(),
      updatedBy: t.Boolean(),
      company: t.Boolean(),
      branch: t.Boolean(),
      warehouse: t.Boolean(),
      priceList: t.Boolean(),
      StockCard: t.Boolean(),
      CurrentReportGroup: t.Boolean(),
      StockMovement: t.Boolean(),
      Invoice: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const CurrentInclude = t.Partial(
  t.Object(
    {
      company: t.Boolean(),
      branch: t.Boolean(),
      warehouse: t.Boolean(),
      priceList: t.Boolean(),
      StockCard: t.Boolean(),
      CurrentReportGroup: t.Boolean(),
      StockMovement: t.Boolean(),
      Invoice: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const CurrentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      currentCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      currentName: t.Union([t.Literal("asc"), t.Literal("desc")]),
      currentType: t.Union([t.Literal("asc"), t.Literal("desc")]),
      identityNo: t.Union([t.Literal("asc"), t.Literal("desc")]),
      taxNumber: t.Union([t.Literal("asc"), t.Literal("desc")]),
      taxOffice: t.Union([t.Literal("asc"), t.Literal("desc")]),
      address: t.Union([t.Literal("asc"), t.Literal("desc")]),
      countryCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      city: t.Union([t.Literal("asc"), t.Literal("desc")]),
      district: t.Union([t.Literal("asc"), t.Literal("desc")]),
      phone: t.Union([t.Literal("asc"), t.Literal("desc")]),
      email: t.Union([t.Literal("asc"), t.Literal("desc")]),
      website: t.Union([t.Literal("asc"), t.Literal("desc")]),
      companyCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      branchCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      warehouseCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      priceListId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const Current = t.Composite([CurrentPlain, CurrentRelations], {
  additionalProperties: true,
});

export const CurrentInputCreate = t.Composite(
  [CurrentPlainInputCreate, CurrentRelationsInputCreate],
  { additionalProperties: true },
);

export const CurrentInputUpdate = t.Composite(
  [CurrentPlainInputUpdate, CurrentRelationsInputUpdate],
  { additionalProperties: true },
);
