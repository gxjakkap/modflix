import { t } from "elysia";

export const ErrorModel = t.Object({
  code: t.Number(),
  message: t.String(),
  details: t.Optional(t.Any()),
});
