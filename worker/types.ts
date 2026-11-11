import type { Auth, SessionUser } from "./auth";
import type { Database } from "./db/client";
import type { Env } from "./env";

export interface AppEnv {
  Bindings: Env;
  Variables: {
    db: Database;
    // Built on first use: most requests (images, releases) never need it.
    auth: () => Auth;
    user: SessionUser;
  };
}
