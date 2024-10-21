import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const ReceiptType = t.Union(
  [
    t.Literal("Devir"),
    t.Literal("Sayim"),
    t.Literal("Nakil"),
    t.Literal("Giris"),
    t.Literal("Cikis"),
    t.Literal("Fire"),
  ],
  { additionalProperties: true },
);
