"use client";

import { useState } from "react";
import Link from "next/link";
import { ProgressBar, type ProgressStep } from "@/components/journey/ProgressBar";
import { StepCard, type StepStatus } from "@/components/journey/StepCard";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { ExplanationLayers } from "@/components/ui/ExplanationLayers";

// ── Step Data ──────────────────────────────────────────────────────────────

interface PatenteStep {
  id: string;
  label: string;
  shortLabel: string;
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
}

const patenteSteps: PatenteStep[] = [
  {
    id: "entender-tipos",
    label: "Tipos de Patente",
    shortLabel: "Tipos",
    stepNumber: 1,
    title: "Entenda os tipos de patente",
    whatToDo:
      "Descubra se sua invenção se encaixa como Patente de Invenção (PI) ou Modelo de Utilidade (MU). A PI protege criações totalmente novas; o MU protege melhorias funcionais em objetos existentes.",
    whyNow:
      "O tipo de patente determina os requisitos, prazos e custos. Escolher errado pode levar à recusa do pedido.",
    requirements: [
      "Descrição básica da sua invenção",
      "Entendimento se é algo novo ou uma melhoria",
    ],
    ctaLabel: "Comparar PI vs MU",
    ctaHref: "#",
    estimatedTime: "15 min",
    commonMistake:
      "Confundir Modelo de Utilidade com Desenho Industrial. MU protege função, DI protege aparência.",
  },
  {
    id: "pesquisa-estado-tecnica",
    label: "Estado da Técnica",
    shortLabel: "Pesq.",
    stepNumber: 2,
    title: "Pesquise o estado da técnica",
    whatToDo:
      "Busque patentes já existentes no Brasil e no mundo para verificar se sua invenção é realmente nova. Use o banco de patentes do INPI e bases internacionais como Espacenet.",
    whyNow:
      "A novidade é um dos três requisitos obrigatórios. Se já existe patente igual, seu pedido será negado.",
    requirements: [
      "Acesso à internet",
      "Palavras-chave da sua invenção",
      "Classificação IPC (se souber)",
    ],
    ctaLabel: "Iniciar pesquisa",
    ctaHref: "#",
    estimatedTime: "1-3 horas",
    commonMistake:
      "Buscar apenas no Brasil. Patentes publicadas em qualquer país do mundo invalidam a novidade.",
    officialLink: {
      label: "Base de Patentes INPI",
      href: "https://busca.inpi.gov.br/pePI/",
    },
  },
  {
    id: "documentacao-tecnica",
    label: "Documentação",
    shortLabel: "Docs",
    stepNumber: 3,
    title: "Prepare a documentação técnica",
    whatToDo:
      "Redija o relatório descritivo, as reivindicações, o resumo e prepare os desenhos técnicos. Esses documentos descrevem sua invenção em detalhes e definem o escopo de proteção.",
    whyNow:
      "Documentação bem feita é o que define a abrangência da sua proteção. Reivindicações mal escritas deixam brechas.",
    requirements: [
      "Relatório descritivo completo",
      "Reivindicações (escopo de proteção)",
      "Resumo (máx. 200 palavras)",
      "Desenhos técnicos (se aplicável)",
    ],
    ctaLabel: "Ver modelo de documentação",
    ctaHref: "#",
    estimatedTime: "5-20 horas",
    commonMistake:
      "Reivindicações muito amplas (serão recusadas) ou muito restritas (proteção limitada). Busque equilíbrio.",
  },
  {
    id: "classificacao-ipc",
    label: "Classificação IPC",
    shortLabel: "IPC",
    stepNumber: 4,
    title: "Classifique pela IPC",
    whatToDo:
      "Identifique a Classificação Internacional de Patentes (IPC) da sua invenção. É um código que categoriza o campo tecnológico.",
    whyNow:
      "A classificação IPC é obrigatória no formulário do INPI e ajuda os examinadores a avaliarem seu pedido corretamente.",
    requirements: [
      "Documentação técnica pronta",
      "Acesso ao sistema de classificação IPC",
    ],
    ctaLabel: "Consultar classificação IPC",
    ctaHref: "#",
    estimatedTime: "30 min",
    commonMistake:
      "Usar classificação genérica demais. Seja o mais específico possível para facilitar o exame.",
    officialLink: {
      label: "Classificação IPC - WIPO",
      href: "https://ipcpub.wipo.int/",
    },
  },
  {
    id: "cadastro-gru",
    label: "Cadastro e GRU",
    shortLabel: "GRU",
    stepNumber: 5,
    title: "Cadastre-se no e-INPI e pague a GRU",
    whatToDo:
      "Crie sua conta no e-INPI (se ainda não tiver), gere a GRU específica para pedido de patente e efetue o pagamento.",
    whyNow:
      "Sem o pagamento da GRU, o sistema não permite o envio do pedido.",
    requirements: [
      "Conta Gov.br (nível prata ou ouro)",
      "CPF ou CNPJ",
      "Dados bancários para pagamento",
    ],
    ctaLabel: "Ver taxas de patente",
    ctaHref: "#",
    estimatedTime: "20-30 min",
    commonMistake:
      "PF, MEI e ME têm desconto de 60% nas taxas. Verifique se você se enquadra antes de pagar.",
    officialLink: {
      label: "Tabela de Taxas INPI",
      href: "https://www.gov.br/inpi/pt-br/servicos/tabelas-de-retribuicao",
    },
  },
  {
    id: "protocolar-pedido",
    label: "Protocolar Pedido",
    shortLabel: "Envio",
    stepNumber: 6,
    title: "Protocole o pedido de patente",
    whatToDo:
      "Acesse o e-INPI, preencha o formulário de depósito de patente, anexe toda a documentação técnica e envie.",
    whyNow:
      "Com toda a documentação pronta e a GRU paga, é hora de formalizar o pedido junto ao INPI.",
    requirements: [
      "GRU paga",
      "Relatório descritivo, reivindicações, resumo",
      "Desenhos (se houver)",
      "Classificação IPC",
    ],
    ctaLabel: "Ver como preencher",
    ctaHref: "#",
    estimatedTime: "30-60 min",
    commonMistake:
      "Não verificar se todos os arquivos foram anexados corretamente. Revise antes de enviar.",
  },
  {
    id: "acompanhar-exame",
    label: "Acompanhamento",
    shortLabel: "Acomp.",
    stepNumber: 7,
    title: "Acompanhe o exame técnico",
    whatToDo:
      "Após o depósito, acompanhe a Revista da Propriedade Industrial (RPI) semanalmente. O exame de patente pode levar anos, mas é fundamental responder exigências dentro dos prazos.",
    whyNow:
      "Perder um prazo de resposta a exigência pode resultar no arquivamento definitivo do pedido.",
    requirements: [
      "Número do pedido/processo",
      "Acesso ao sistema de busca INPI",
    ],
    ctaLabel: "Ver como acompanhar",
    ctaHref: "#",
    estimatedTime: "5 min/semana",
    commonMistake:
      "Ignorar o pedido após protocolar. O processo de patente exige acompanhamento ativo por anos.",
    officialLink: {
      label: "Revista do INPI (RPI)",
      href: "http://revistas.inpi.gov.br/",
    },
  },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function PatentePage() {
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>(
    () => {
      const statuses: Record<string, StepStatus> = {};
      patenteSteps.forEach((step, idx) => {
        statuses[step.id] = idx === 0 ? "atual" : "pendente";
      });
      return statuses;
    }
  );

  const handleStatusChange = (stepId: string, newStatus: StepStatus) => {
    setStepStatuses((prev) => {
      const next = { ...prev, [stepId]: newStatus };
      if (newStatus === "concluido") {
        const idx = patenteSteps.findIndex((s) => s.id === stepId);
        if (idx < patenteSteps.length - 1) {
          const nextStepId = patenteSteps[idx + 1].id;
          if (next[nextStepId] === "pendente") {
            next[nextStepId] = "atual";
          }
        }
      }
      return next;
    });
  };

  const progressSteps: ProgressStep[] = patenteSteps.map((step) => ({
    id: step.id,
    label: step.label,
    shortLabel: step.shortLabel,
    status:
      stepStatuses[step.id] === "concluido"
        ? "completed"
        : stepStatuses[step.id] === "atual"
        ? "current"
        : "upcoming",
  }));

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Voltar ao início
          </Link>
        </div>

        <div className="mb-10">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
            Pedido de Patente
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Passo a passo para solicitar sua patente no INPI
          </h1>
        </div>

        <div className="mb-10">
          <ExplanationLayers
            simpleText="A patente protege sua invenção. Com ela, ninguém pode fabricar, usar ou vender sua criação sem sua autorização por até 20 anos."
            detailedText="Existem dois tipos: Patente de Invenção (PI), que protege criações totalmente novas, e Modelo de Utilidade (MU), que protege melhorias funcionais em objetos já existentes. O processo envolve documentação técnica detalhada e um exame que pode levar anos."
            technicalText="Fundamentado na Lei 9.279/96, artigos 6 a 93. Requisitos: novidade (art. 11), atividade inventiva (art. 13) e aplicação industrial (art. 15). PI: proteção de 20 anos; MU: 15 anos, ambos a partir do depósito."
          />
        </div>

        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6">
          <ProgressBar steps={progressSteps} />
        </div>

        <div className="space-y-6">
          {patenteSteps.map((step) => (
            <StepCard
              key={step.id}
              stepNumber={step.stepNumber}
              title={step.title}
              whatToDo={step.whatToDo}
              whyNow={step.whyNow}
              requirements={step.requirements}
              ctaLabel={step.ctaLabel}
              ctaHref={step.ctaHref}
              estimatedTime={step.estimatedTime}
              commonMistake={step.commonMistake}
              officialLink={step.officialLink}
              status={stepStatuses[step.id]}
              onStatusChange={(newStatus) => handleStatusChange(step.id, newStatus)}
              onHelpClick={() => {}}
            />
          ))}
        </div>

        <div className="mt-10">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
