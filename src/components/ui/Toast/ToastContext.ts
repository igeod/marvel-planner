import { createContext } from "react";

export interface ToastAction {
  label: string;
  onClick: () => void | Promise<void>;
}

export interface ToastOptions {
  // Same id again updates the toast in place instead of stacking a duplicate.
  id?: string;
  tone: "error" | "info";
  title: string;
  message?: string;
  action?: ToastAction;
  persistent?: boolean;
  duration?: number;
}

export interface ToastContextValue {
  show(options: ToastOptions): () => void;
  dismiss(id: string): void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
