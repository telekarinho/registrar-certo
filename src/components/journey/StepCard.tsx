"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────

export type StepStatus = "pendente" | "atual" | "concluido";

export interface StepCardProps {
  stepNumber: number;
  title: string;
  whatToDo: string;
  whyNow: string;
  requirements: string[];
  ctaLabel: string;
  ctaHref: string;
  estimatedTime: string;
  commonMistake: string;
  officialLink?: { label: string; href: string };
  status: StepStatus;
  onStatusChange?: (status: StepStatus) => void;
  onHelpClick?: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────

export function StepCard({
  stepNumber,
  title,
  whatToDo,
  whyNow,
  requirements,
  ctaLabel,
  ctaHref,
  estimatedTime,
  commonMistake,
  officialLink,
  status,
  onStatusChange,
  onHelpClick,
}: StepCardProps) {
  const [whyExpanded, setWhyExpanded] = useState(false);

  const statusConfig = {
    pendente: {
      badge: "Pendente",
      badgeClass: "bg-gray-100 text-gray-600",
      borderClass: "border-gray-200",
    },
    atual: {
      badge: "Seu Próximo Passo",
      badgeClass: "bg-blue-100 text-blue-700",
      borderClass: "border-blue-300 ring-1 ring-blue-100",
    },
    concluido: {
      badge: "Concluído",
      badgeClass: "bg-green-100 text-green-700",
      borderClass: "border-green-200",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-6 transition-all sm:p-8",
        config.borderClass,
        status === "atual" && "shadow-md"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
              status === "concluido"
                ? "bg-green-100 text-green-600"
                : status === "atual"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-500"
            )}
          >
            {status === "concluido" ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              stepNumber
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <span className="mt-1 inline-flex items-center gap-1 text-sm text-gray-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {estimatedTime}
            </span>
          </div>
        </div>
        <span className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-medium", config.badgeClass)}>
          {config.badge}
        </span>
      </div>

      {/* What to do */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          O que fazer agora
        </h4>
        <p className="mt-2 leading-relaxed text-gray-700">{whatToDo}</p>
      </div>

      {/* Why now - Collapsible */}
      <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50">
        <button
          type="button"
          onClick={() => setWhyExpanded(!whyExpanded)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          Por que isso vem agora?
          <svg
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform",
              whyExpanded && "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {whyExpanded && (
          <div className="border-t border-gray-100 px-4 pb-3 pt-2 text-sm leading-relaxed text-gray-600">
            {whyNow}
          </div>
        )}
      </div>

      {/* Requirements */}
      <div className="mt-5">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          O que precisa em mãos
        </h4>
        <ul className="mt-2 space-y-2">
          {requirements.map((req) => (
            <li key={req} className="flex items-start gap-2 text-sm text-gray-700">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Common Mistake Warning */}
      <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
        <div className="flex gap-3">
          <svg
            className="h-5 w-5 shrink-0 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-800">
              Erro comum para evitar
            </p>
            <p className="mt-1 text-sm text-red-700">{commonMistake}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href={ctaHref}
          className={cn(
            "inline-flex flex-1 items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold transition-all",
            status === "atual"
              ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl"
              : status === "concluido"
              ? "bg-green-50 text-green-700 hover:bg-green-100"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {status === "concluido" ? "Revisar" : ctaLabel}
        </Link>
        {officialLink && (
          <a
            href={officialLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
          >
            {officialLink.label}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onHelpClick}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          Preciso de ajuda
        </button>
        {status !== "concluido" && (
          <button
            type="button"
            onClick={() => onStatusChange?.("concluido")}
            className="text-sm font-medium text-gray-500 hover:text-blue-600"
          >
            Continuar depois
          </button>
        )}
      </div>
    </div>
  );
}
