import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const StokManagementType = t.Union(
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
);
