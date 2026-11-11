import { createMiddleware } from "hono/factory";
import { isAdminUser } from "../services/admin";
import { isMaintenanceOn } from "../services/siteSettings";
import type { AppEnv } from "../types";

const RETRY_AFTER_SECONDS = 3600;
const OPEN_DURING_MAINTENANCE = [
  /^\/api\/auth\/sign-in\/email$/,
  /^\/api\/auth\/sign-out$/,
  /^\/api\/auth\/get-session$/,
  /^\/api\/status$/,
];

export const maintenance = createMiddleware<AppEnv>(async (c, next) => {
  if (!(await isMaintenanceOn(c.var.db))) return next();
  if (OPEN_DURING_MAINTENANCE.some((pattern) => pattern.test(c.req.path))) return next();

  const session = await c.var.auth().api.getSession({ headers: c.req.raw.headers });
  if (session && isAdminUser(c.env, session.user.id)) return next();

  c.header("Retry-After", String(RETRY_AFTER_SECONDS));
  return c.json({ error: "maintenance" }, 503);
});
