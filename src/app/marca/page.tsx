"use client";

import { useState } from "react";
import Link from "next/link";
import { ProgressBar, type ProgressStep } from "@/components/journey/ProgressBar";
import { StepCard, type StepStatus } from "@/components/journey/StepCard";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { ExplanationLayers } from "@/components/ui/ExplanationLayers";

// ── Step Data ──────────────────────────────────────────────────────────────

interface MarcaStep {
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

const marcaSteps: MarcaStep[] = [
  {
    id: "pesquisa",
    label: "Pesquisa Prévia",
    shortLabel: "Pesq.",
    stepNumber: 1,
    title: "Pesquise se sua marca já existe",
    whatToDo:
      "Acesse o sistema de busca do INPI e verifique se já existe marca igual ou semelhante à sua na mesma classe de atividade.",
    whyNow:
      "Antes de gastar tempo e dinheiro, é fundamental saber se sua marca tem chance de ser aprovada. Marcas iguais ou muito semelhantes serão recusadas.",
    requirements: [
      "Nome ou logo que deseja registrar",
      "Classe NCL (Nice) da sua atividade",
      "Acesso à internet",
    ],
    ctaLabel: "Iniciar pesquisa",
    ctaHref: "/marca/pesquisa",
    estimatedTime: "15-30 min",
    commonMistake:
      "Buscar apenas o nome exato. Busque também variações, nomes parecidos e na mesma classe NCL.",
    officialLink: {
      label: "Busca no INPI",
      href: "https://busca.inpi.gov.br/pePI/",
    },
  },
  {
    id: "cadastro-inpi",
    label: "Cadastro e-INPI",
    shortLabel: "Cad.",
    stepNumber: 2,
    title: "Crie sua conta no sistema do INPI",
    whatToDo:
      "Cadastre-se no sistema e-INPI (sistema eletrônico do INPI) com seus dados pessoais ou da empresa. Você vai precisar de um login Gov.br.",
    whyNow:
      "Todo o processo de registro é feito online pelo sistema do INPI. Sem cadastro, você não consegue dar entrada no pedido.",
    requirements: [
      "CPF ou CNPJ",
      "Conta Gov.br (nível prata ou ouro)",
      "Dados pessoais ou da empresa",
      "E-mail válido",
    ],
    ctaLabel: "Ver como cadastrar",
    ctaHref: "/marca/cadastro",
    estimatedTime: "20-40 min",
    commonMistake:
      "Usar conta Gov.br nível bronze. O INPI exige nível prata ou ouro para operar no sistema.",
    officialLink: {
      label: "e-INPI",
      href: "https://www.gov.br/inpi/pt-br/servicos/sistemas/e-inpi",
    },
  },
  {
    id: "gru",
    label: "Pagamento GRU",
    shortLabel: "GRU",
    stepNumber: 3,
    title: "Emita e pague a GRU (taxa do INPI)",
    whatToDo:
      "Gere a Guia de Recolhimento da União (GRU) no site do INPI e efetue o pagamento. O valor depende se você é PF, MEI, ME ou empresa normal.",
    whyNow:
      "O comprovante de pagamento é obrigatório para dar entrada no pedido. Sem ele, o sistema não permite o envio.",
    requirements: [
      "Cadastro no e-INPI ativo",
      "CPF/CNPJ",
      "Dados bancários para pagamento",
    ],
    ctaLabel: "Ver taxas e como pagar",
    ctaHref: "/marca/pagamento",
    estimatedTime: "10-15 min",
    commonMistake:
      "Pagar a GRU errada. Existem códigos diferentes para cada tipo de pedido. Confira o código antes de pagar.",
    officialLink: {
      label: "Tabela de Taxas INPI",
      href: "https://www.gov.br/inpi/pt-br/servicos/tabelas-de-retribuicao",
    },
  },
  {
    id: "pedido",
    label: "Envio do Pedido",
    shortLabel: "Pedido",
    stepNumber: 4,
    title: "Preencha e envie o pedido de registro",
    whatToDo:
      "Acesse o e-INPI, preencha o formulário de pedido de registro de marca com todas as informações necessárias e envie.",
    whyNow:
      "Com a pesquisa feita, o cadastro ativo e a GRU paga, você já tem tudo para enviar o pedido oficial.",
    requirements: [
      "Comprovante de pagamento da GRU",
      "Marca (nome e/ou imagem em JPG)",
      "Classe NCL correta",
      "Especificação dos produtos/serviços",
    ],
    ctaLabel: "Ver como preencher",
    ctaHref: "/marca/pedido",
    estimatedTime: "30-45 min",
    commonMistake:
      "Escolher a classe NCL errada. Cada classe protege um segmento diferente. Verifique a classificação correta.",
  },
  {
    id: "acompanhamento",
    label: "Acompanhamento",
    shortLabel: "Acomp.",
    stepNumber: 5,
    title: "Acompanhe o andamento do seu pedido",
    whatToDo:
      "Após o envio, acompanhe semanalmente a Revista da Propriedade Industrial (RPI) para verificar o status do seu pedido e responder a eventuais exigências.",
    whyNow:
      "O INPI publica todas as decisões na RPI. Se houver exigência e você não responder no prazo, perde o pedido.",
    requirements: [
      "Número do processo",
      "Acesso ao sistema de busca do INPI",
      "Atenção aos prazos legais",
    ],
    ctaLabel: "Ver como acompanhar",
    ctaHref: "/marca/acompanhamento",
    estimatedTime: "5 min/semana",
    commonMistake:
      "Esquecer de acompanhar a RPI. Se perder um prazo de resposta a exigência, seu pedido pode ser arquivado.",
    officialLink: {
      label: "Revista do INPI (RPI)",
      href: "http://revistas.inpi.gov.br/",
    },
  },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function MarcaPage() {
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>(
    () => {
      const statuses: Record<string, StepStatus> = {};
      marcaSteps.forEach((step, idx) => {
        statuses[step.id] = idx === 0 ? "atual" : "pendente";
      });
      return statuses;
    }
  );

  const handleStatusChange = (stepId: string, newStatus: StepStatus) => {
    setStepStatuses((prev) => {
      const next = { ...prev, [stepId]: newStatus };

      // Auto-advance: mark the next step as "atual"
      if (newStatus === "concluido") {
        const idx = marcaSteps.findIndex((s) => s.id === stepId);
        if (idx < marcaSteps.length - 1) {
          const nextStepId = marcaSteps[idx + 1].id;
          if (next[nextStepId] === "pendente") {
            next[nextStepId] = "atual";
          }
        }
      }

      return next;
    });
  };

  const progressSteps: ProgressStep[] = marcaSteps.map((step) => ({
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

  const currentStepIndex = marcaSteps.findIndex(
    (s) => stepStatuses[s.id] === "atual"
  );

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
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
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Voltar ao início
          </Link>
        </div>

        <div className="mb-10">
          <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            Registro de Marca
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Passo a passo para registrar sua marca no INPI
          </h1>
        </div>

        {/* Explanation Layers */}
        <div className="mb-10">
          <ExplanationLayers
            simpleText="O registro de marca garante que ninguém mais use o nome ou logo do seu negócio no seu segmento. É como reservar seu lugar no mercado."
            detailedText="Ao registrar sua marca no INPI, você obtém exclusividade de uso em todo o território nacional por 10 anos (renovável). Isso impede que concorrentes usem nomes ou logos iguais ou parecidos na mesma classe de atividade, protegendo sua identidade comercial."
            technicalText="Fundamentado na Lei 9.279/96 (Lei de Propriedade Industrial), artigos 122 a 175. O registro confere direito de uso exclusivo em todo o território nacional, em seu ramo de atividade econômica (Princípio da Especialidade)."
          />
        </div>

        {/* Progress Bar */}
        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6">
          <ProgressBar steps={progressSteps} />
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {marcaSteps.map((step) => (
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
              onStatusChange={(newStatus) =>
                handleStatusChange(step.id, newStatus)
              }
              onHelpClick={() => {
                /* TODO: open help modal */
              }}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-10">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
