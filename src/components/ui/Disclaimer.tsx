import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────

type DisclaimerVariant = "info" | "warning" | "legal";

interface DisclaimerProps {
  variant?: DisclaimerVariant;
  text?: string;
  className?: string;
}

// ── Config ─────────────────────────────────────────────────────────────────

const variantStyles: Record<
  DisclaimerVariant,
  { container: string; icon: string; text: string }
> = {
  info: {
    container: "border-blue-200 bg-blue-50",
    icon: "text-blue-500",
    text: "text-blue-800",
  },
  warning: {
    container: "border-amber-200 bg-amber-50",
    icon: "text-amber-500",
    text: "text-amber-800",
  },
  legal: {
    container: "border-gray-200 bg-gray-50",
    icon: "text-gray-500",
    text: "text-gray-700",
  },
};

const icons: Record<DisclaimerVariant, React.ReactNode> = {
  info: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  legal: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  ),
};

const defaultText =
  "Este site é um guia educativo e operacional. O pedido oficial é feito nos sistemas do INPI.";

// ── Component ──────────────────────────────────────────────────────────────

export function Disclaimer({
  variant = "warning",
  text = defaultText,
  className,
}: DisclaimerProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        styles.container,
        className
      )}
      role="note"
    >
      <div className="flex gap-3">
        <div className={cn("shrink-0", styles.icon)}>{icons[variant]}</div>
        <p className={cn("text-sm leading-relaxed", styles.text)}>{text}</p>
      </div>
    </div>
  );
}
