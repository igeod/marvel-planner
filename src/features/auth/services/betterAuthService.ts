import { createAuthClient } from "better-auth/client";
import type { TranslationKey } from "../../../i18n/types";
import type { User } from "../types";
import { AuthError, type AuthService } from "./authService";

const client = createAuthClient({
  baseURL: window.location.origin,
  basePath: "/api/auth",
});

const ERROR_KEYS: Record<string, TranslationKey> = {
  INVALID_EMAIL_OR_PASSWORD: "auth.errors.invalidCredentials",
  INVALID_EMAIL: "auth.errors.invalidEmail",
  INVALID_PASSWORD: "auth.errors.wrongPassword",
  INVALID_NAME: "auth.errors.invalidName",
  NAME_TAKEN: "auth.errors.nameTaken",
  USER_ALREADY_EXISTS: "auth.errors.userExists",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "auth.errors.userExists",
  PASSWORD_TOO_SHORT: "auth.errors.passwordShort",
  PASSWORD_TOO_LONG: "auth.errors.passwordLong",
  SESSION_EXPIRED: "auth.errors.reauthenticate",
  SESSION_NOT_FRESH: "auth.errors.reauthenticate",
};

interface ClientError {
  code?: string;
  status: number;
}

function toAuthError({ code, status }: ClientError): AuthError {
  if (status === 429) return new AuthError("auth.errors.tooManyRequests");
  return new AuthError((code && ERROR_KEYS[code]) || "auth.errors.generic");
}

function toUser({ id, email, name }: User): User {
  return { id, email, name };
}

async function requireCurrentUser(): Promise<User> {
  const { data, error } = await client.getSession();
  if (error || !data) throw new AuthError("auth.errors.reauthenticate");
  return toUser(data.user);
}

export const betterAuthService: AuthService = {
  async getCurrentUser() {
    const { data } = await client.getSession();
    return data ? toUser(data.user) : null;
  },

  async login(credentials) {
    const { data, error } = await client.signIn.email(credentials);
    if (error) throw toAuthError(error);
    return toUser(data.user);
  },

  async register(registration) {
    const { data, error } = await client.signUp.email(registration);
    if (error) throw toAuthError(error);
    return toUser(data.user);
  },

  async logout() {
    await client.signOut();
  },

  async updateName(name) {
    const { error } = await client.updateUser({ name });
    if (error) throw toAuthError(error);
    return requireCurrentUser();
  },

  async updateEmail(email) {
    const { error } = await client.changeEmail({ newEmail: email });
    if (error) throw toAuthError(error);
    const user = await requireCurrentUser();
    // The server answers 200 without changing anything when the address belongs to someone else.
    if (user.email.toLowerCase() !== email.toLowerCase()) {
      throw new AuthError("auth.errors.userExists");
    }
    return user;
  },

  async changePassword(change) {
    const { error } = await client.changePassword({ ...change, revokeOtherSessions: true });
    if (error) throw toAuthError(error);
  },

  async deleteAccount(password) {
    const { error } = await client.deleteUser({ password });
    if (error) throw toAuthError(error);
  },
};
