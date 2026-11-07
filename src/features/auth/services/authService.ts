import type { TranslationKey } from "../../../i18n/types";
import type { Credentials, PasswordChange, Registration, User } from "../types";

export interface AuthService {
  getCurrentUser(): Promise<User | null>;
  login(credentials: Credentials): Promise<User>;
  register(registration: Registration): Promise<User>;
  logout(): Promise<void>;
  updateName(name: string): Promise<User>;
  updateEmail(email: string): Promise<User>;
  changePassword(change: PasswordChange): Promise<void>;
  deleteAccount(password: string): Promise<void>;
  // The answer is the same whether or not the address has an account.
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}

export class AuthError extends Error {
  // Seconds the server asks to wait before trying again (429).
  constructor(
    readonly messageKey: TranslationKey,
    readonly retryAfter?: number,
  ) {
    super(messageKey);
    this.name = "AuthError";
  }
}
