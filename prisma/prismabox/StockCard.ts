import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const StockCardPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    productCode: t.String({ additionalProperties: true }),
    productName: t.String({ additionalProperties: true }),
    invoiceName: __nullable__(t.String({ additionalProperties: true })),
    shortDescription: __nullable__(t.String({ additionalProperties: true })),
    description: __nullable__(t.String({ additionalProperties: true })),
    warehouseCode: __nullable__(t.String({ additionalProperties: true })),
    manufacturerCode: __nullable__(t.String({ additionalProperties: true })),
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
);

export const StockCardRelations = t.Object(
  {
    Company: __nullable__(
      t.Object(
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
    ),
    Branch: __nullable__(
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
    Current: __nullable__(
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
    Attributes: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          attributeName: t.String({ additionalProperties: true }),
          values: t.Array(t.String({ additionalProperties: true })),
          stockCardId: __nullable__(t.String({ additionalProperties: true })),
        },
        { additionalProperties: true },
      ),
    ),
    Barcodes: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          stockCardId: t.String({ additionalProperties: true }),
          barcode: t.String({ additionalProperties: true }),
        },
        { additionalProperties: true },
      ),
    ),
    Categories: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          stockCardId: t.String({ additionalProperties: true }),
          categoryId: t.String({ additionalProperties: true }),
        },
        { additionalProperties: true },
      ),
    ),
    StockCardPriceLists: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          priceListId: t.String({ additionalProperties: true }),
          stockCardId: t.String({ additionalProperties: true }),
          price: t.Number({ additionalProperties: true }),
        },
        { additionalProperties: true },
      ),
    ),
    TaxRates: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          stockCardId: __nullable__(t.String({ additionalProperties: true })),
          taxName: t.String({ additionalProperties: true }),
          taxRate: t.Number({ additionalProperties: true }),
        },
        { additionalProperties: true },
      ),
    ),
    Variations: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          stockCardId: t.String({ additionalProperties: true }),
          productCode: t.String({ additionalProperties: true }),
          productName: t.String({ additionalProperties: true }),
          invoiceName: __nullable__(t.String({ additionalProperties: true })),
          shortDescription: __nullable__(
            t.String({ additionalProperties: true }),
          ),
          description: __nullable__(t.String({ additionalProperties: true })),
          riskQuantities: t.Number({ additionalProperties: true }),
          hasExpirationDate: t.Boolean({ additionalProperties: true }),
          allowNegativeStock: t.Boolean({ additionalProperties: true }),
          price: t.Number({ additionalProperties: true }),
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
    InvoiceDetail: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          invoiceId: t.String({ additionalProperties: true }),
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

export const StockCardPlainInputCreate = t.Object(
  {
    productCode: t.String({ additionalProperties: true }),
    productName: t.String({ additionalProperties: true }),
    invoiceName: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    shortDescription: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    description: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    warehouseCode: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    manufacturerCode: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    companyCode: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    branchCode: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    brand: t.Optional(__nullable__(t.String({ additionalProperties: true }))),
    unitOfMeasure: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    productType: t.String({ additionalProperties: true }),
    riskQuantities: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    stockStatus: t.Optional(t.Boolean({ additionalProperties: true })),
    hasExpirationDate: t.Optional(t.Boolean({ additionalProperties: true })),
    allowNegativeStock: t.Optional(t.Boolean({ additionalProperties: true })),
    createdBy: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    updatedBy: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
  },
  { additionalProperties: true },
);

export const StockCardPlainInputUpdate = t.Object(
  {
    productCode: t.String({ additionalProperties: true }),
    productName: t.String({ additionalProperties: true }),
    invoiceName: __nullable__(t.String({ additionalProperties: true })),
    shortDescription: __nullable__(t.String({ additionalProperties: true })),
    description: __nullable__(t.String({ additionalProperties: true })),
    warehouseCode: __nullable__(t.String({ additionalProperties: true })),
    manufacturerCode: __nullable__(t.String({ additionalProperties: true })),
    companyCode: __nullable__(t.String({ additionalProperties: true })),
    branchCode: __nullable__(t.String({ additionalProperties: true })),
    brand: __nullable__(t.String({ additionalProperties: true })),
    unitOfMeasure: __nullable__(t.String({ additionalProperties: true })),
    productType: t.String({ additionalProperties: true }),
    riskQuantities: __nullable__(t.Number({ additionalProperties: true })),
    stockStatus: t.Optional(t.Boolean({ additionalProperties: true })),
    hasExpirationDate: t.Optional(t.Boolean({ additionalProperties: true })),
    allowNegativeStock: t.Optional(t.Boolean({ additionalProperties: true })),
    createdBy: __nullable__(t.String({ additionalProperties: true })),
    updatedBy: __nullable__(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const StockCardRelationsInputCreate = t.Object(
  {
    Company: t.Optional(
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
    Branch: t.Optional(
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
    Attributes: t.Optional(
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
    Barcodes: t.Optional(
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
    Categories: t.Optional(
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
    StockCardPriceLists: t.Optional(
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
    TaxRates: t.Optional(
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
    Variations: t.Optional(
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
    InvoiceDetail: t.Optional(
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

export const StockCardRelationsInputUpdate = t.Partial(
  t.Object(
    {
      Company: t.Partial(
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
      Branch: t.Partial(
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
      Attributes: t.Partial(
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
      Barcodes: t.Partial(
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
      Categories: t.Partial(
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
      StockCardPriceLists: t.Partial(
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
      TaxRates: t.Partial(
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
      Variations: t.Partial(
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
      InvoiceDetail: t.Partial(
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

export const StockCardWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        productCode: t.String(),
        productName: t.String(),
        invoiceName: t.String(),
        shortDescription: t.String(),
        description: t.String(),
        warehouseCode: t.String(),
        manufacturerCode: t.String(),
        companyCode: t.String(),
        branchCode: t.String(),
        brand: t.String(),
        unitOfMeasure: t.String(),
        productType: t.String(),
        riskQuantities: t.Number(),
        stockStatus: t.Boolean(),
        hasExpirationDate: t.Boolean(),
        allowNegativeStock: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
        createdBy: t.String(),
        updatedBy: t.String(),
      }),
    { $id: "StockCard" },
  ),
  { additionalProperties: true },
);

export const StockCardWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object({
          id: t.String(),
          productCode: t.String(),
          description: t.String(),
          warehouseCode: t.String(),
        }),
      ),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({ productCode: t.String() }),
        t.Object({ description: t.String() }),
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
            productCode: t.String(),
            productName: t.String(),
            invoiceName: t.String(),
            shortDescription: t.String(),
            description: t.String(),
            warehouseCode: t.String(),
            manufacturerCode: t.String(),
            companyCode: t.String(),
            branchCode: t.String(),
            brand: t.String(),
            unitOfMeasure: t.String(),
            productType: t.String(),
            riskQuantities: t.Number(),
            stockStatus: t.Boolean(),
            hasExpirationDate: t.Boolean(),
            allowNegativeStock: t.Boolean(),
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
  { $id: "StockCard" },
);

export const StockCardSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      productCode: t.Boolean(),
      productName: t.Boolean(),
      invoiceName: t.Boolean(),
      shortDescription: t.Boolean(),
      description: t.Boolean(),
      warehouseCode: t.Boolean(),
      manufacturerCode: t.Boolean(),
      companyCode: t.Boolean(),
      branchCode: t.Boolean(),
      brand: t.Boolean(),
      unitOfMeasure: t.Boolean(),
      productType: t.Boolean(),
      riskQuantities: t.Boolean(),
      stockStatus: t.Boolean(),
      hasExpirationDate: t.Boolean(),
      allowNegativeStock: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      createdBy: t.Boolean(),
      updatedBy: t.Boolean(),
      Company: t.Boolean(),
      Branch: t.Boolean(),
      Current: t.Boolean(),
      Attributes: t.Boolean(),
      Barcodes: t.Boolean(),
      Categories: t.Boolean(),
      StockCardPriceLists: t.Boolean(),
      TaxRates: t.Boolean(),
      Variations: t.Boolean(),
      StockMovement: t.Boolean(),
      InvoiceDetail: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardInclude = t.Partial(
  t.Object(
    {
      Company: t.Boolean(),
      Branch: t.Boolean(),
      Current: t.Boolean(),
      Attributes: t.Boolean(),
      Barcodes: t.Boolean(),
      Categories: t.Boolean(),
      StockCardPriceLists: t.Boolean(),
      TaxRates: t.Boolean(),
      Variations: t.Boolean(),
      StockMovement: t.Boolean(),
      InvoiceDetail: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      productCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      productName: t.Union([t.Literal("asc"), t.Literal("desc")]),
      invoiceName: t.Union([t.Literal("asc"), t.Literal("desc")]),
      shortDescription: t.Union([t.Literal("asc"), t.Literal("desc")]),
      description: t.Union([t.Literal("asc"), t.Literal("desc")]),
      warehouseCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      manufacturerCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      companyCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      branchCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      brand: t.Union([t.Literal("asc"), t.Literal("desc")]),
      unitOfMeasure: t.Union([t.Literal("asc"), t.Literal("desc")]),
      productType: t.Union([t.Literal("asc"), t.Literal("desc")]),
      riskQuantities: t.Union([t.Literal("asc"), t.Literal("desc")]),
      stockStatus: t.Union([t.Literal("asc"), t.Literal("desc")]),
      hasExpirationDate: t.Union([t.Literal("asc"), t.Literal("desc")]),
      allowNegativeStock: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCard = t.Composite([StockCardPlain, StockCardRelations], {
  additionalProperties: true,
});

export const StockCardInputCreate = t.Composite(
  [StockCardPlainInputCreate, StockCardRelationsInputCreate],
  { additionalProperties: true },
);

export const StockCardInputUpdate = t.Composite(
  [StockCardPlainInputUpdate, StockCardRelationsInputUpdate],
  { additionalProperties: true },
);
