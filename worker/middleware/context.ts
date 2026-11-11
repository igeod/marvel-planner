import { createMiddleware } from "hono/factory";
import { createAuth, type Auth } from "../auth";
import { createDb } from "../db/client";
import type { AppEnv } from "../types";

export const withContext = createMiddleware<AppEnv>(async (c, next) => {
  const db = createDb(c.env.DB);
  c.set("db", db);
  let auth: Auth | undefined;
  c.set("auth", () => (auth ??= createAuth(c.env, db)));
  await next();
});
