"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function createToastId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const iconClassName = "h-5 w-5";

  if (variant === "success") {
    return <CheckCircle2 className={iconClassName} />;
  }

  if (variant === "error") {
    return <AlertCircle className={iconClassName} />;
  }

  return <Info className={iconClassName} />;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const removeToast = useCallback((id: string) => {
    setMessages((current) => current.filter((message) => message.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const toast = useCallback((message: Omit<ToastMessage, "id">) => {
    const id = createToastId();
    const nextMessage: ToastMessage = { id, ...message };
    setMessages((current) => [nextMessage, ...current].slice(0, 3));

    const timer = window.setTimeout(() => removeToast(id), 3500);
    timersRef.current.set(id, timer);
  }, [removeToast]);

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="true" style={{ zIndex: 100 }} className="pointer-events-none fixed right-4 top-4 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-[22px] border bg-white p-4 shadow-lg ${message.variant === "success" ? "border-emerald-200" : message.variant === "error" ? "border-rose-200" : "border-slate-200"}`}
          >
            <div className={`mt-0.5 rounded-full p-2 ${message.variant === "success" ? "bg-emerald-50 text-emerald-600" : message.variant === "error" ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600"}`}>
              <ToastIcon variant={message.variant} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{message.title}</p>
              {message.description ? <p className="mt-1 text-sm leading-6 text-slate-600">{message.description}</p> : null}
            </div>
            <button type="button" className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" onClick={() => removeToast(message.id)} aria-label="Dismiss notification">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
