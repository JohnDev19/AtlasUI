/**
 * useToast — fire toasts from anywhere without prop drilling.
 *
 * Pair this with <AtlasProvider> at the root of your app.
 * The context lives there and this hook just taps into it.
 *
 * @example
 *   const { toast } = useToast();
 *   toast({ title: "Saved!", variant: "success" });
 *   toast({ title: "Uh oh", description: "Something broke.", variant: "danger" });
 *
 * — Veloria UI, https://veloria-ui.vercel.app/
 */

"use client";

import * as React from "react";

export type ToastVariant = "default" | "success" | "warning" | "danger" | "info";

export interface ToastData {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  action?: React.ReactNode;
}

export type ToastInput = Omit<ToastData, "id">;

interface ToastContextValue {
  toasts: ToastData[];
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const toast = React.useCallback((input: ToastInput): string => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...input, id }]);
    return id;
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      "useToast must be called inside <AtlasProvider>. " +
      "Make sure you've wrapped your app root — see https://veloria-ui.vercel.app/docs/provider"
    );
  }
  return ctx;
}
