import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const CurrentMovementType = t.Union(
  [t.Literal("Borc"), t.Literal("Alacak")],
  { additionalProperties: true },
);
