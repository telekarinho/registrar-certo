"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  category: string;
  required: boolean;
  checked: boolean;
}

interface ChecklistGeneratorProps {
  title: string;
  items: ChecklistItem[];
  onItemToggle: (itemId: string) => void;
  onSave?: () => void;
  onGeneratePdf?: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────

export function ChecklistGenerator({
  title,
  items,
  onItemToggle,
  onSave,
  onGeneratePdf,
}: ChecklistGeneratorProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const grouped = useMemo(() => {
    const groups: Record<string, ChecklistItem[]> = {};
    for (const item of items) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [items]);

  const checkedCount = items.filter((i) => i.checked).length;
  const progress = items.length > 0 ? (checkedCount / items.length) * 100 : 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="text-sm font-medium text-gray-500">
            {checkedCount}/{items.length}
          </span>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progresso</span>
            <span className="font-semibold text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                progress === 100 ? "bg-green-500" : "bg-blue-600"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grouped Items */}
      <div className="divide-y divide-gray-100">
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <div key={category} className="p-6">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              {category}
            </h4>
            <div className="space-y-3">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-xl border p-4 transition-all",
                    item.checked
                      ? "border-green-200 bg-green-50/50"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => onItemToggle(item.id)}
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                        item.checked
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-300 hover:border-blue-400"
                      )}
                      aria-label={`Marcar: ${item.label}`}
                    >
                      {item.checked && (
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            item.checked
                              ? "text-gray-500 line-through"
                              : "text-gray-900"
                          )}
                        >
                          {item.label}
                        </span>
                        {item.required && (
                          <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-600">
                            Obrigatório
                          </span>
                        )}
                      </div>

                      {/* Expandable description */}
                      <button
                        type="button"
                        onClick={() => toggleExpanded(item.id)}
                        className="mt-1 text-xs text-gray-400 hover:text-blue-500"
                      >
                        {expandedItems.has(item.id)
                          ? "Ocultar detalhes"
                          : "Ver detalhes"}
                      </button>
                      {expandedItems.has(item.id) && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-500">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-gray-100 p-6 sm:flex-row">
        <button
          type="button"
          onClick={onGeneratePdf}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          Gerar PDF
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
          Salvar
        </button>
      </div>
    </div>
  );
}
