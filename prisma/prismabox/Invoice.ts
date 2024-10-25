import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const InvoicePlain = t.Object(
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
    genelIskontoTutar: __nullable__(t.Number({ additionalProperties: true })),
    genelIskontoOran: __nullable__(t.Number({ additionalProperties: true })),
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
);

export const InvoiceRelations = t.Object(
  {
    Current: __nullable__(
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
    company: __nullable__(
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
    warehouse: __nullable__(
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
    outBranch: __nullable__(
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
  },
  { additionalProperties: true },
);

export const InvoicePlainInputCreate = t.Object(
  {
    invoiceNo: t.String({ additionalProperties: true }),
    gibInvoiceNo: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    invoiceDate: t.Optional(
      __nullable__(t.Date({ additionalProperties: true })),
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
    currentCode: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    companyCode: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    branchCode: t.String({ additionalProperties: true }),
    outBranchCode: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    warehouseCode: t.String({ additionalProperties: true }),
    description: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    genelIskontoTutar: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    genelIskontoOran: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    paymentDate: t.Optional(
      __nullable__(t.Date({ additionalProperties: true })),
    ),
    paymentDay: t.Optional(
      __nullable__(t.Integer({ additionalProperties: true })),
    ),
    totalAmount: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    totalVat: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    totalDiscount: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    totalNet: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    totalDebt: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    totalBalance: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
    canceledAt: t.Optional(
      __nullable__(t.Date({ additionalProperties: true })),
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

export const InvoicePlainInputUpdate = t.Object(
  {
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
    genelIskontoTutar: __nullable__(t.Number({ additionalProperties: true })),
    genelIskontoOran: __nullable__(t.Number({ additionalProperties: true })),
    paymentDate: __nullable__(t.Date({ additionalProperties: true })),
    paymentDay: __nullable__(t.Integer({ additionalProperties: true })),
    totalAmount: __nullable__(t.Number({ additionalProperties: true })),
    totalVat: __nullable__(t.Number({ additionalProperties: true })),
    totalDiscount: __nullable__(t.Number({ additionalProperties: true })),
    totalNet: __nullable__(t.Number({ additionalProperties: true })),
    totalDebt: __nullable__(t.Number({ additionalProperties: true })),
    totalBalance: __nullable__(t.Number({ additionalProperties: true })),
    canceledAt: __nullable__(t.Date({ additionalProperties: true })),
    createdBy: __nullable__(t.String({ additionalProperties: true })),
    updatedBy: __nullable__(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const InvoiceRelationsInputCreate = t.Object(
  {
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
    company: t.Optional(
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
    warehouse: t.Optional(
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
    outBranch: t.Optional(
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
  },
  { additionalProperties: true },
);

export const InvoiceRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      company: t.Partial(
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
      warehouse: t.Partial(
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
      outBranch: t.Partial(
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
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const InvoiceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        invoiceNo: t.String(),
        gibInvoiceNo: t.String(),
        invoiceDate: t.Date(),
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
        currentCode: t.String(),
        companyCode: t.String(),
        branchCode: t.String(),
        outBranchCode: t.String(),
        warehouseCode: t.String(),
        description: t.String(),
        genelIskontoTutar: t.Number(),
        genelIskontoOran: t.Number(),
        paymentDate: t.Date(),
        paymentDay: t.Integer(),
        priceListId: t.String(),
        totalAmount: t.Number(),
        totalVat: t.Number(),
        totalDiscount: t.Number(),
        totalNet: t.Number(),
        totalPaid: t.Number(),
        totalDebt: t.Number(),
        totalBalance: t.Number(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
        canceledAt: t.Date(),
        createdBy: t.String(),
        updatedBy: t.String(),
      }),
    { $id: "Invoice" },
  ),
  { additionalProperties: true },
);

export const InvoiceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(t.Object({ id: t.String(), invoiceNo: t.String() })),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({ invoiceNo: t.String() }),
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
            invoiceNo: t.String(),
            gibInvoiceNo: t.String(),
            invoiceDate: t.Date(),
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
            currentCode: t.String(),
            companyCode: t.String(),
            branchCode: t.String(),
            outBranchCode: t.String(),
            warehouseCode: t.String(),
            description: t.String(),
            genelIskontoTutar: t.Number(),
            genelIskontoOran: t.Number(),
            paymentDate: t.Date(),
            paymentDay: t.Integer(),
            priceListId: t.String(),
            totalAmount: t.Number(),
            totalVat: t.Number(),
            totalDiscount: t.Number(),
            totalNet: t.Number(),
            totalPaid: t.Number(),
            totalDebt: t.Number(),
            totalBalance: t.Number(),
            createdAt: t.Date(),
            updatedAt: t.Date(),
            canceledAt: t.Date(),
            createdBy: t.String(),
            updatedBy: t.String(),
          },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "Invoice" },
);

export const InvoiceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      invoiceNo: t.Boolean(),
      gibInvoiceNo: t.Boolean(),
      invoiceDate: t.Boolean(),
      invoiceType: t.Boolean(),
      documentType: t.Boolean(),
      currentCode: t.Boolean(),
      companyCode: t.Boolean(),
      branchCode: t.Boolean(),
      outBranchCode: t.Boolean(),
      warehouseCode: t.Boolean(),
      description: t.Boolean(),
      genelIskontoTutar: t.Boolean(),
      genelIskontoOran: t.Boolean(),
      paymentDate: t.Boolean(),
      paymentDay: t.Boolean(),
      priceListId: t.Boolean(),
      totalAmount: t.Boolean(),
      totalVat: t.Boolean(),
      totalDiscount: t.Boolean(),
      totalNet: t.Boolean(),
      totalPaid: t.Boolean(),
      totalDebt: t.Boolean(),
      totalBalance: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      canceledAt: t.Boolean(),
      createdBy: t.Boolean(),
      updatedBy: t.Boolean(),
      Current: t.Boolean(),
      company: t.Boolean(),
      branch: t.Boolean(),
      warehouse: t.Boolean(),
      priceList: t.Boolean(),
      outBranch: t.Boolean(),
      InvoiceDetail: t.Boolean(),
      StockMovement: t.Boolean(),
      CurrentMovement: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const InvoiceInclude = t.Partial(
  t.Object(
    {
      invoiceType: t.Boolean(),
      documentType: t.Boolean(),
      Current: t.Boolean(),
      company: t.Boolean(),
      branch: t.Boolean(),
      warehouse: t.Boolean(),
      priceList: t.Boolean(),
      outBranch: t.Boolean(),
      InvoiceDetail: t.Boolean(),
      StockMovement: t.Boolean(),
      CurrentMovement: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const InvoiceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      invoiceNo: t.Union([t.Literal("asc"), t.Literal("desc")]),
      gibInvoiceNo: t.Union([t.Literal("asc"), t.Literal("desc")]),
      invoiceDate: t.Union([t.Literal("asc"), t.Literal("desc")]),
      currentCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      companyCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      branchCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      outBranchCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      warehouseCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      description: t.Union([t.Literal("asc"), t.Literal("desc")]),
      genelIskontoTutar: t.Union([t.Literal("asc"), t.Literal("desc")]),
      genelIskontoOran: t.Union([t.Literal("asc"), t.Literal("desc")]),
      paymentDate: t.Union([t.Literal("asc"), t.Literal("desc")]),
      paymentDay: t.Union([t.Literal("asc"), t.Literal("desc")]),
      priceListId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      totalAmount: t.Union([t.Literal("asc"), t.Literal("desc")]),
      totalVat: t.Union([t.Literal("asc"), t.Literal("desc")]),
      totalDiscount: t.Union([t.Literal("asc"), t.Literal("desc")]),
      totalNet: t.Union([t.Literal("asc"), t.Literal("desc")]),
      totalPaid: t.Union([t.Literal("asc"), t.Literal("desc")]),
      totalDebt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      totalBalance: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      canceledAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const Invoice = t.Composite([InvoicePlain, InvoiceRelations], {
  additionalProperties: true,
});

export const InvoiceInputCreate = t.Composite(
  [InvoicePlainInputCreate, InvoiceRelationsInputCreate],
  { additionalProperties: true },
);

export const InvoiceInputUpdate = t.Composite(
  [InvoicePlainInputUpdate, InvoiceRelationsInputUpdate],
  { additionalProperties: true },
);
