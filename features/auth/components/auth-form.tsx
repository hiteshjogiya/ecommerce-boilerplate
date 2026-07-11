"use client";

import { type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthFormProps {
  children: ReactNode;
  submitLabel: string;
  footer?: ReactNode;
  className?: string;
  isSubmitting?: boolean;
  statusMessage?: string | null;
  statusType?: "success" | "error";
}

export function AuthForm({
  children,
  submitLabel,
  footer,
  className,
  isSubmitting = false,
  statusMessage,
  statusType = "error",
}: AuthFormProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {statusMessage ? (
        <div className={cn("rounded-2xl border px-4 py-3 text-sm", statusType === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700")}>{statusMessage}</div>
      ) : null}
      {children}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {submitLabel}
      </Button>
      {footer ? <div className="pt-2 text-center text-sm text-slate-500">{footer}</div> : null}
    </div>
  );
}
