import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const CurrentMovementDocumentType = t.Union(
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
);
