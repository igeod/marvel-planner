import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthService } from "../services/authService";
import { betterAuthService } from "../services/betterAuthService";
import type { AuthStatus, Credentials, PasswordChange, Registration, User } from "../types";
import { AuthContext, type AuthContextValue } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
  service?: AuthService;
}

export function AuthProvider({ children, service = betterAuthService }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const applyUser = useCallback((nextUser: User | null) => {
    setUser(nextUser);
    setStatus(nextUser ? "authenticated" : "anonymous");
  }, []);

  useEffect(() => {
    let isActive = true;
    service
      .getCurrentUser()
      .catch(() => null)
      .then((currentUser) => isActive && applyUser(currentUser));
    return () => {
      isActive = false;
    };
  }, [service, applyUser]);

  const login = useCallback(
    async (credentials: Credentials) => applyUser(await service.login(credentials)),
    [service, applyUser],
  );

  const register = useCallback(
    async (registration: Registration) => applyUser(await service.register(registration)),
    [service, applyUser],
  );

  const logout = useCallback(async () => {
    await service.logout();
    applyUser(null);
  }, [service, applyUser]);

  const updateName = useCallback(
    async (name: string) => applyUser(await service.updateName(name)),
    [service, applyUser],
  );

  const updateEmail = useCallback(
    async (email: string) => applyUser(await service.updateEmail(email)),
    [service, applyUser],
  );

  const changePassword = useCallback(
    (change: PasswordChange) => service.changePassword(change),
    [service],
  );

  const deleteAccount = useCallback(
    async (password: string) => {
      await service.deleteAccount(password);
      applyUser(null);
    },
    [service, applyUser],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      login,
      register,
      logout,
      updateName,
      updateEmail,
      changePassword,
      deleteAccount,
    }),
    [user, status, login, register, logout, updateName, updateEmail, changePassword, deleteAccount],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
