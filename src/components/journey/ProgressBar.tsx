"use client";

import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ProgressStep {
  id: string;
  label: string;
  shortLabel?: string;
  status: "completed" | "current" | "upcoming";
}

interface ProgressBarProps {
  steps: ProgressStep[];
  onStepClick?: (stepId: string) => void;
}

// ── Component ──────────────────────────────────────────────────────────────

export function ProgressBar({ steps, onStepClick }: ProgressBarProps) {
  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className="w-full">
      {/* Progress Summary */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Progresso: {completedCount} de {steps.length} etapas
        </span>
        <span className="text-sm font-semibold text-blue-600">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-5 top-5 hidden h-0.5 w-[calc(100%-40px)] bg-gray-200 sm:block" />
        <div
          className="absolute left-5 top-5 hidden h-0.5 bg-blue-600 transition-all duration-700 sm:block"
          style={{
            width: `calc(${progress}% - ${progress > 0 ? 40 : 0}px)`,
            maxWidth: "calc(100% - 40px)",
          }}
        />

        <div className="flex justify-between">
          {steps.map((step, idx) => {
            const isClickable =
              step.status === "completed" && onStepClick;

            return (
              <div
                key={step.id}
                className="relative flex flex-col items-center"
              >
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(step.id)}
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all",
                    step.status === "completed" &&
                      "bg-blue-600 text-white hover:bg-blue-700",
                    step.status === "current" &&
                      "bg-blue-600 text-white ring-4 ring-blue-100",
                    step.status === "upcoming" &&
                      "bg-gray-200 text-gray-500",
                    isClickable && "cursor-pointer"
                  )}
                  aria-label={`Etapa ${idx + 1}: ${step.label}`}
                >
                  {step.status === "completed" ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </button>

                {/* Desktop Label */}
                <span
                  className={cn(
                    "mt-2 hidden max-w-[100px] text-center text-xs sm:block",
                    step.status === "current"
                      ? "font-semibold text-blue-600"
                      : step.status === "completed"
                      ? "font-medium text-gray-700"
                      : "text-gray-400"
                  )}
                >
                  {step.label}
                </span>

                {/* Mobile Number */}
                <span
                  className={cn(
                    "mt-1 text-xs sm:hidden",
                    step.status === "current"
                      ? "font-semibold text-blue-600"
                      : "text-gray-400"
                  )}
                >
                  {step.shortLabel || idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
