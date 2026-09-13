import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-[11px] font-medium uppercase tracking-[0.14em] text-muted", className)}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-[var(--radius-sm)] border border-border bg-bg px-3 text-sm text-fg placeholder:text-subtle outline-none focus:ring-2 focus:ring-primary/50",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-[var(--radius-sm)] border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-subtle outline-none focus:ring-2 focus:ring-primary/50",
        className,
      )}
      {...props}
    />
  );
}
