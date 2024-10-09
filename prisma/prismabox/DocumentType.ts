import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const DocumentType = t.Union(
  [
    t.Literal("Invoice"),
    t.Literal("Order"),
    t.Literal("Waybill"),
    t.Literal("Other"),
  ],
  { additionalProperties: true },
);
