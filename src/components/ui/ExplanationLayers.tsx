"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────

interface ExplanationLayersProps {
  simpleText: string;
  detailedText: string;
  technicalText: string;
  className?: string;
}

// ── Component ──────────────────────────────────────────────────────────────

export function ExplanationLayers({
  simpleText,
  detailedText,
  technicalText,
  className,
}: ExplanationLayersProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Layer 1: Simple (always visible) */}
      <p className="leading-relaxed text-gray-700">{simpleText}</p>

      {/* Layer 2: Detailed (expandable) */}
      <div>
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <svg
            className={cn(
              "h-4 w-4 transition-transform",
              showDetails && "rotate-90"
            )}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
          {showDetails ? "Ocultar detalhes" : "Ver mais detalhes"}
        </button>

        {showDetails && (
          <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <p className="text-sm leading-relaxed text-gray-700">
              {detailedText}
            </p>

            {/* Layer 3: Technical (expandable inside layer 2) */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowTechnical(!showTechnical)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
              >
                <svg
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    showTechnical && "rotate-90"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
                {showTechnical
                  ? "Ocultar base legal"
                  : "Base legal / observação técnica"}
              </button>

              {showTechnical && (
                <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-200 rounded-lg border border-gray-200 bg-white p-3">
                  <div className="flex gap-2">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                      />
                    </svg>
                    <p className="text-xs leading-relaxed text-gray-600">
                      {technicalText}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
