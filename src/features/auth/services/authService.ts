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
}

export class AuthError extends Error {
  constructor(readonly messageKey: TranslationKey) {
    super(messageKey);
    this.name = "AuthError";
  }
}
