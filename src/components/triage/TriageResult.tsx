"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { TriageOutcome } from "./TriageWizard";

// ── Outcome Data ───────────────────────────────────────────────────────────

interface OutcomeInfo {
  title: string;
  subtitle: string;
  explanation: string;
  whatIsIt: string;
  href: string;
  ctaLabel: string;
  color: string;
  iconBg: string;
  confidence: number;
  icon: React.ReactNode;
}

const outcomeData: Record<TriageOutcome, OutcomeInfo> = {
  MARCA: {
    title: "Registro de Marca",
    subtitle:
      "Proteja o nome, logo ou identidade visual do seu negócio no INPI.",
    explanation:
      "Com base nas suas respostas, você precisa registrar uma marca. Isso garante que ninguém mais use o mesmo nome ou logo no seu segmento de mercado.",
    whatIsIt:
      "Marca é um sinal visualmente perceptível que identifica e distingue produtos ou serviços. O registro no INPI confere ao titular o uso exclusivo em todo o território nacional, pelo prazo de 10 anos, renovável por períodos iguais e sucessivos.",
    href: "/marca",
    ctaLabel: "Começar o passo a passo de Marca",
    color: "text-blue-600",
    iconBg: "bg-blue-100",
    confidence: 95,
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  },
  PATENTE_INVENCAO: {
    title: "Patente de Invenção (PI)",
    subtitle:
      "Proteja sua invenção original com uma patente de invenção no INPI.",
    explanation:
      "Sua inovação parece ser algo totalmente novo. A patente de invenção protege produtos ou processos inéditos que representam um avanço técnico.",
    whatIsIt:
      "A patente de invenção protege criações que apresentam novidade, atividade inventiva e aplicação industrial. A proteção dura até 20 anos a partir da data do depósito, e confere ao titular o direito de impedir que terceiros produzam, usem ou vendam a invenção sem autorização.",
    href: "/patente",
    ctaLabel: "Começar o passo a passo de Patente",
    color: "text-amber-600",
    iconBg: "bg-amber-100",
    confidence: 85,
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  PATENTE_MODELO_UTILIDADE: {
    title: "Patente de Modelo de Utilidade (MU)",
    subtitle:
      "Proteja sua melhoria prática com um modelo de utilidade no INPI.",
    explanation:
      "Sua inovação parece ser uma melhoria funcional em algo existente. O modelo de utilidade protege melhorias práticas de uso ou fabricação.",
    whatIsIt:
      "O modelo de utilidade protege melhorias funcionais em objetos de uso prático. A proteção dura até 15 anos a partir da data do depósito. É ideal para aperfeiçoamentos que tornam algo mais eficiente ou funcional, sem necessariamente ser uma invenção totalmente nova.",
    href: "/patente",
    ctaLabel: "Começar o passo a passo de Patente",
    color: "text-orange-600",
    iconBg: "bg-orange-100",
    confidence: 80,
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L12 4.37m-5.68 5.7h11.8M4.26 19.72l15.48-15.48" />
      </svg>
    ),
  },
  DESENHO_INDUSTRIAL: {
    title: "Registro de Desenho Industrial (DI)",
    subtitle:
      "Proteja a aparência visual do seu produto no INPI.",
    explanation:
      "O desenho industrial protege a forma estética, o padrão ornamental ou a configuração visual de um objeto. Ideal para designs de produtos.",
    whatIsIt:
      "Desenho Industrial é a forma plástica ornamental de um objeto ou o conjunto ornamental de linhas e cores que possa ser aplicado a um produto. A proteção dura até 25 anos (10 anos + 3 prorrogações de 5 anos) e garante exclusividade sobre o visual do produto.",
    href: "/desenho-industrial",
    ctaLabel: "Começar o passo a passo de Desenho Industrial",
    color: "text-emerald-600",
    iconBg: "bg-emerald-100",
    confidence: 85,
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
      </svg>
    ),
  },
  INCONCLUSIVO: {
    title: "Resultado Inconclusivo",
    subtitle:
      "Não conseguimos determinar com certeza qual proteção você precisa.",
    explanation:
      "Com base nas suas respostas, recomendamos que você converse com um especialista para definir a melhor estratégia de proteção.",
    whatIsIt:
      "A propriedade intelectual abrange diversas formas de proteção. Às vezes, um mesmo ativo pode se enquadrar em mais de uma categoria, ou pode não se encaixar claramente em nenhuma. Um especialista pode ajudar a identificar a melhor abordagem.",
    href: "/triagem",
    ctaLabel: "Refazer a triagem",
    color: "text-gray-600",
    iconBg: "bg-gray-100",
    confidence: 40,
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
};

// ── Component ──────────────────────────────────────────────────────────────

interface TriageResultProps {
  outcome: TriageOutcome;
  personType: string | null;
  usageStatus: string | null;
  onReset: () => void;
}

export function TriageResult({
  outcome,
  onReset,
}: TriageResultProps) {
  const [expandedWhatIs, setExpandedWhatIs] = useState(false);
  const info = outcomeData[outcome];

  return (
    <div className="mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Result Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-start gap-5">
          <div
            className={cn(
              "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl",
              info.iconBg,
              info.color
            )}
          >
            {info.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Pelo que você descreveu, você precisa de:
            </p>
            <h2 className={cn("mt-1 text-2xl font-bold", info.color)}>
              {info.title}
            </h2>
          </div>
        </div>

        {/* Confidence */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                info.confidence >= 80
                  ? "bg-green-500"
                  : info.confidence >= 60
                  ? "bg-amber-500"
                  : "bg-red-400"
              )}
              style={{ width: `${info.confidence}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600">
            {info.confidence}% de confiança
          </span>
        </div>

        {/* Explanation */}
        <p className="mt-6 leading-relaxed text-gray-700">{info.explanation}</p>

        {/* What is it? - Expandable */}
        <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={() => setExpandedWhatIs(!expandedWhatIs)}
            className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            O que é isso?
            <svg
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform",
                expandedWhatIs && "rotate-180"
              )}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
          {expandedWhatIs && (
            <div className="border-t border-gray-100 px-5 pb-4 pt-3 text-sm leading-relaxed text-gray-600">
              {info.whatIsIt}
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={info.href}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
          >
            {info.ctaLabel}
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
          <Link
            href="/contato"
            className="inline-flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-6 py-4 text-base font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50"
          >
            Quero falar com especialista
          </Link>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
            />
          </svg>
          Refazer triagem
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex gap-3">
          <svg
            className="h-5 w-5 shrink-0 text-amber-600"
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
          <p className="text-sm leading-relaxed text-amber-800">
            Esta triagem é uma orientação inicial com base nas suas respostas.
            Para casos complexos, recomendamos consultar um profissional de
            propriedade intelectual. O pedido oficial é feito diretamente no INPI.
          </p>
        </div>
      </div>
    </div>
  );
}
