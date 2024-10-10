import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const CompanyPlain = t.Object(
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
);

export const CompanyRelations = t.Object(
  {
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
    Warehouse: t.Array(
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
          identityNo: __nullable__(t.String({ additionalProperties: true })),
          taxNumber: __nullable__(t.String({ additionalProperties: true })),
          taxOffice: __nullable__(t.String({ additionalProperties: true })),
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
    CurrentMovement: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: true }),
          currentCode: __nullable__(t.String({ additionalProperties: true })),
          dueDate: t.Date({ additionalProperties: true }),
          description: t.String({ additionalProperties: true }),
          debtAmount: t.Number({ additionalProperties: true }),
          creditAmount: t.Number({ additionalProperties: true }),
          balanceAmount: t.Number({ additionalProperties: true }),
          priceListId: __nullable__(t.String({ additionalProperties: true })),
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
          invoiceDate: t.Date({ additionalProperties: true }),
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
          branchCode: __nullable__(t.String({ additionalProperties: true })),
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

export const CompanyPlainInputCreate = t.Object(
  {
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
    createdBy: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
    updatedBy: t.Optional(
      __nullable__(t.String({ additionalProperties: true })),
    ),
  },
  { additionalProperties: true },
);

export const CompanyPlainInputUpdate = t.Object(
  {
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
    createdBy: __nullable__(t.String({ additionalProperties: true })),
    updatedBy: __nullable__(t.String({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const CompanyRelationsInputCreate = t.Object(
  {
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
    Warehouse: t.Optional(
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

export const CompanyRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      Warehouse: t.Partial(
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

export const CompanyWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        companyName: t.String(),
        companyCode: t.String(),
        taxNumber: t.String(),
        taxOffice: t.String(),
        address: t.String(),
        countryCode: t.String(),
        city: t.String(),
        district: t.String(),
        phone: t.String(),
        email: t.String(),
        website: t.String(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
        createdBy: t.String(),
        updatedBy: t.String(),
      }),
    { $id: "Company" },
  ),
  { additionalProperties: true },
);

export const CompanyWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object({
          id: t.String(),
          companyName: t.String(),
          companyCode: t.String(),
          taxNumber: t.String(),
        }),
      ),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({ companyName: t.String() }),
        t.Object({ companyCode: t.String() }),
        t.Object({ taxNumber: t.String() }),
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
            companyName: t.String(),
            companyCode: t.String(),
            taxNumber: t.String(),
            taxOffice: t.String(),
            address: t.String(),
            countryCode: t.String(),
            city: t.String(),
            district: t.String(),
            phone: t.String(),
            email: t.String(),
            website: t.String(),
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
  { $id: "Company" },
);

export const CompanySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      companyName: t.Boolean(),
      companyCode: t.Boolean(),
      taxNumber: t.Boolean(),
      taxOffice: t.Boolean(),
      address: t.Boolean(),
      countryCode: t.Boolean(),
      city: t.Boolean(),
      district: t.Boolean(),
      phone: t.Boolean(),
      email: t.Boolean(),
      website: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      createdBy: t.Boolean(),
      updatedBy: t.Boolean(),
      Branch: t.Boolean(),
      Warehouse: t.Boolean(),
      User: t.Boolean(),
      Current: t.Boolean(),
      StockCard: t.Boolean(),
      CurrentMovement: t.Boolean(),
      Invoice: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const CompanyInclude = t.Partial(
  t.Object(
    {
      Branch: t.Boolean(),
      Warehouse: t.Boolean(),
      User: t.Boolean(),
      Current: t.Boolean(),
      StockCard: t.Boolean(),
      CurrentMovement: t.Boolean(),
      Invoice: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const CompanyOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      companyName: t.Union([t.Literal("asc"), t.Literal("desc")]),
      companyCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      taxNumber: t.Union([t.Literal("asc"), t.Literal("desc")]),
      taxOffice: t.Union([t.Literal("asc"), t.Literal("desc")]),
      address: t.Union([t.Literal("asc"), t.Literal("desc")]),
      countryCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      city: t.Union([t.Literal("asc"), t.Literal("desc")]),
      district: t.Union([t.Literal("asc"), t.Literal("desc")]),
      phone: t.Union([t.Literal("asc"), t.Literal("desc")]),
      email: t.Union([t.Literal("asc"), t.Literal("desc")]),
      website: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
      createdBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
      updatedBy: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const Company = t.Composite([CompanyPlain, CompanyRelations], {
  additionalProperties: true,
});

export const CompanyInputCreate = t.Composite(
  [CompanyPlainInputCreate, CompanyRelationsInputCreate],
  { additionalProperties: true },
);

export const CompanyInputUpdate = t.Composite(
  [CompanyPlainInputUpdate, CompanyRelationsInputUpdate],
  { additionalProperties: true },
);
