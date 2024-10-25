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
    CurrentMovement: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          currentCode: __nullable__(t.String({ additionalProperties: true })),
          dueDate: __nullable__(t.Date({ additionalProperties: true })),
          description: __nullable__(t.String({ additionalProperties: true })),
          debtAmount: __nullable__(t.Number({ additionalProperties: true })),
          creditAmount: __nullable__(t.Number({ additionalProperties: true })),
          balanceAmount: __nullable__(t.Number({ additionalProperties: true })),
          priceListId: __nullable__(t.String({ additionalProperties: true })),
          movementType: t.Union([t.Literal("Borc"), t.Literal("Alacak")], {
            additionalProperties: true,
          }),
          documentType: __nullable__(
            t.Union(
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
          ),
          documentNo: __nullable__(t.String({ additionalProperties: true })),
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
