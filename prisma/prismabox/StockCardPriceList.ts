import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const StockCardPriceListPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    priceListName: t.String({ additionalProperties: true }),
    currency: t.String({ additionalProperties: true }),
    isActive: t.Boolean({ additionalProperties: true }),
  },
  { additionalProperties: true },
);

export const StockCardPriceListRelations = t.Object(
  {
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
    StockMovement: t.Array(
      t.Object(
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
    CurrentMovement: t.Array(
      t.Object(
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

export const StockCardPriceListPlainInputCreate = t.Object(
  {
    priceListName: t.String({ additionalProperties: true }),
    currency: t.String({ additionalProperties: true }),
    isActive: t.Optional(t.Boolean({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const StockCardPriceListPlainInputUpdate = t.Object(
  {
    priceListName: t.String({ additionalProperties: true }),
    currency: t.String({ additionalProperties: true }),
    isActive: t.Optional(t.Boolean({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const StockCardPriceListRelationsInputCreate = t.Object(
  {
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
    CurrentMovement: t.Optional(
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

export const StockCardPriceListRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      CurrentMovement: t.Partial(
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

export const StockCardPriceListWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        priceListName: t.String(),
        currency: t.String(),
        isActive: t.Boolean(),
      }),
    { $id: "StockCardPriceList" },
  ),
  { additionalProperties: true },
);

export const StockCardPriceListWhereUnique = t.Recursive(
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
            priceListName: t.String(),
            currency: t.String(),
            isActive: t.Boolean(),
          },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "StockCardPriceList" },
);

export const StockCardPriceListSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      priceListName: t.Boolean(),
      currency: t.Boolean(),
      isActive: t.Boolean(),
      Current: t.Boolean(),
      StockMovement: t.Boolean(),
      CurrentMovement: t.Boolean(),
      Invoice: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardPriceListInclude = t.Partial(
  t.Object(
    {
      Current: t.Boolean(),
      StockMovement: t.Boolean(),
      CurrentMovement: t.Boolean(),
      Invoice: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardPriceListOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      priceListName: t.Union([t.Literal("asc"), t.Literal("desc")]),
      currency: t.Union([t.Literal("asc"), t.Literal("desc")]),
      isActive: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const StockCardPriceList = t.Composite(
  [StockCardPriceListPlain, StockCardPriceListRelations],
  { additionalProperties: true },
);

export const StockCardPriceListInputCreate = t.Composite(
  [StockCardPriceListPlainInputCreate, StockCardPriceListRelationsInputCreate],
  { additionalProperties: true },
);

export const StockCardPriceListInputUpdate = t.Composite(
  [StockCardPriceListPlainInputUpdate, StockCardPriceListRelationsInputUpdate],
  { additionalProperties: true },
);
