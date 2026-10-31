import { Hono } from "hono";
import { getPasswordPolicy } from "../services/siteSettings";
import type { AppEnv } from "../types";

export const passwordPolicyRoutes = new Hono<AppEnv>().get("/", async (c) => {
  c.header("Cache-Control", "no-store");
  return c.json(await getPasswordPolicy(c.var.db));
});
