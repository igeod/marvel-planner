import { and, ne, sql } from "drizzle-orm";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import type { Database } from "./db/client";
import * as schema from "./db/schema";
import type { Env } from "./env";

const MIN_PASSWORD_LENGTH = 10;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 30;

function normalizeName(name: unknown): string {
  const normalized = typeof name === "string" ? name.trim().replace(/\s+/g, " ") : "";
  if (normalized.length < MIN_NAME_LENGTH) {
    throw new APIError("BAD_REQUEST", { code: "INVALID_NAME", message: "Invalid name" });
  }
  return normalized.slice(0, MAX_NAME_LENGTH);
}

async function assertNameAvailable(db: Database, name: string, ownerId?: string) {
  const [taken] = await db
    .select({ id: schema.user.id })
    .from(schema.user)
    .where(
      and(
        sql`lower(${schema.user.name}) = lower(${name})`,
        ownerId ? ne(schema.user.id, ownerId) : undefined,
      ),
    );
  if (taken) {
    throw new APIError("BAD_REQUEST", { code: "NAME_TAKEN", message: "Name already taken" });
  }
}

export function createAuth(env: Env, db: Database) {
  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, { provider: "sqlite", schema }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: MIN_PASSWORD_LENGTH,
    },
    user: {
      deleteUser: { enabled: true },
      // Accounts are never email-verified, so the change applies at once.
      changeEmail: { enabled: true, updateEmailWithoutVerification: true },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const name = normalizeName(user.name);
            await assertNameAvailable(db, name);
            return { data: { ...user, name } };
          },
        },
        update: {
          before: async (user, context) => {
            if (!("name" in user)) return undefined;
            const name = normalizeName(user.name);
            await assertNameAvailable(db, name, context?.context.session?.user.id);
            return { data: { ...user, name } };
          },
        },
      },
    },
    rateLimit: {
      enabled: true,
      storage: "database",
    },
    advanced: {
      ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
export type SessionUser = Auth["$Infer"]["Session"]["user"];
