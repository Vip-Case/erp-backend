import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const BanksPlain = t.Object(
  {
    id: t.String({ additionalProperties: true }),
    iban: t.String({ additionalProperties: true }),
    bankName: t.String({ additionalProperties: true }),
    bankBranchName: t.String({ additionalProperties: true }),
    bankBranchCode: t.String({ additionalProperties: true }),
    accountNo: __nullable__(t.Number({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const BanksRelations = t.Object({}, { additionalProperties: true });

export const BanksPlainInputCreate = t.Object(
  {
    iban: t.String({ additionalProperties: true }),
    bankName: t.String({ additionalProperties: true }),
    bankBranchName: t.String({ additionalProperties: true }),
    bankBranchCode: t.String({ additionalProperties: true }),
    accountNo: t.Optional(
      __nullable__(t.Number({ additionalProperties: true })),
    ),
  },
  { additionalProperties: true },
);

export const BanksPlainInputUpdate = t.Object(
  {
    iban: t.String({ additionalProperties: true }),
    bankName: t.String({ additionalProperties: true }),
    bankBranchName: t.String({ additionalProperties: true }),
    bankBranchCode: t.String({ additionalProperties: true }),
    accountNo: __nullable__(t.Number({ additionalProperties: true })),
  },
  { additionalProperties: true },
);

export const BanksRelationsInputCreate = t.Object(
  {},
  { additionalProperties: true },
);

export const BanksRelationsInputUpdate = t.Partial(
  t.Object({}, { additionalProperties: true }),
  { additionalProperties: true },
);

export const BanksWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        iban: t.String(),
        bankName: t.String(),
        bankBranchName: t.String(),
        bankBranchCode: t.String(),
        accountNo: t.Number(),
      }),
    { $id: "Banks" },
  ),
  { additionalProperties: true },
);

export const BanksWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(t.Object({ id: t.String(), iban: t.String() })),
      t.Union([t.Object({ id: t.String() }), t.Object({ iban: t.String() })]),
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
            iban: t.String(),
            bankName: t.String(),
            bankBranchName: t.String(),
            bankBranchCode: t.String(),
            accountNo: t.Number(),
          },
          { additionalProperties: true },
        ),
        { additionalProperties: true },
      ),
    ]),
  { $id: "Banks" },
);

export const BanksSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      iban: t.Boolean(),
      bankName: t.Boolean(),
      bankBranchName: t.Boolean(),
      bankBranchCode: t.Boolean(),
      accountNo: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const BanksInclude = t.Partial(
  t.Object({ _count: t.Boolean() }, { additionalProperties: true }),
  { additionalProperties: true },
);

export const BanksOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      iban: t.Union([t.Literal("asc"), t.Literal("desc")]),
      bankName: t.Union([t.Literal("asc"), t.Literal("desc")]),
      bankBranchName: t.Union([t.Literal("asc"), t.Literal("desc")]),
      bankBranchCode: t.Union([t.Literal("asc"), t.Literal("desc")]),
      accountNo: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: true },
  ),
  { additionalProperties: true },
);

export const Banks = t.Composite([BanksPlain, BanksRelations], {
  additionalProperties: true,
});

export const BanksInputCreate = t.Composite(
  [BanksPlainInputCreate, BanksRelationsInputCreate],
  { additionalProperties: true },
);

export const BanksInputUpdate = t.Composite(
  [BanksPlainInputUpdate, BanksRelationsInputUpdate],
  { additionalProperties: true },
);
