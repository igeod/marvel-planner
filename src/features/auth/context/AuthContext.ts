import { createContext } from "react";
import type { AuthStatus, Credentials, PasswordChange, Registration, User } from "../types";

export interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login(credentials: Credentials): Promise<void>;
  register(registration: Registration): Promise<void>;
  logout(): Promise<void>;
  updateName(name: string): Promise<void>;
  updateEmail(email: string): Promise<void>;
  changePassword(change: PasswordChange): Promise<void>;
  deleteAccount(password: string): Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
