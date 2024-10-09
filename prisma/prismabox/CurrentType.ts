import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const CurrentType = t.Union(
  [
    t.Literal("Customer"),
    t.Literal("Supplier"),
    t.Literal("Manufacturer"),
    t.Literal("Buyer"),
    t.Literal("Seller"),
    t.Literal("Other"),
  ],
  { additionalProperties: true },
);
