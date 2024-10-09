import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const InvoiceType = t.Union(
  [
    t.Literal("Purchase"),
    t.Literal("Sales"),
    t.Literal("Return"),
    t.Literal("Cancel"),
    t.Literal("Other"),
  ],
  { additionalProperties: true },
);
