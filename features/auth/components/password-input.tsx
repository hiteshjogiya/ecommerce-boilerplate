"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function PasswordInput({ label, error, className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      {label ? <label className="text-sm font-medium text-slate-700">{label}</label> : null}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-12", className)}
          aria-invalid={Boolean(error)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          className="absolute inset-y-0 right-3 flex items-center text-slate-500"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
