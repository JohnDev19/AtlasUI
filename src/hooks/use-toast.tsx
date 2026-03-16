import * as React from "react";
export interface ToastMessage { id: string; title: string; description?: string; variant?: "default"|"success"|"warning"|"danger"; duration?: number; }
const listeners: Array<(t: ToastMessage) => void> = [];
export function useToast() {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
  React.useEffect(() => {
    const handler = (t: ToastMessage) => setToasts(prev => [...prev, t]);
    listeners.push(handler);
    return () => { const i = listeners.indexOf(handler); if (i > -1) listeners.splice(i,1); };
  }, []);
  const toast = (t: Omit<ToastMessage,"id">) => {
    const msg = { ...t, id: Math.random().toString(36).slice(2) };
    listeners.forEach(l => l(msg));
  };
  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));
  return { toasts, toast, dismiss };
}
