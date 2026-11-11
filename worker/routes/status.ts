import { Hono } from "hono";
import type { SiteStatus } from "../../shared/admin";
import { isAdminUser } from "../services/admin";
import { isMaintenanceOn } from "../services/siteSettings";
import type { AppEnv } from "../types";

export const statusRoutes = new Hono<AppEnv>().get("/", async (c) => {
  const session = await c.var.auth().api.getSession({ headers: c.req.raw.headers });
  const status: SiteStatus = {
    maintenance: await isMaintenanceOn(c.var.db),
    isAdmin: session !== null && isAdminUser(c.env, session.user.id),
  };
  c.header("Cache-Control", "no-store");
  return c.json(status);
});
