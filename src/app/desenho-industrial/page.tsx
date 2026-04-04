"use client";

import { useState } from "react";
import Link from "next/link";
import { ProgressBar, type ProgressStep } from "@/components/journey/ProgressBar";
import { StepCard, type StepStatus } from "@/components/journey/StepCard";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { ExplanationLayers } from "@/components/ui/ExplanationLayers";

// ── Step Data ──────────────────────────────────────────────────────────────

const diSteps = [
  {
    id: "entender-di",
    label: "O que é DI",
    shortLabel: "DI",
    stepNumber: 1,
    title: "Entenda o que é Desenho Industrial",
    whatToDo:
      "O Desenho Industrial (DI) protege a aparência visual de um produto — sua forma, padrão, linhas, cores ou combinação. Não protege função técnica (isso é patente).",
    whyNow:
      "Entender a diferença entre DI, marca e patente evita perda de tempo e dinheiro com o pedido errado.",
    requirements: ["Produto com forma visual original"],
    ctaLabel: "Saber mais",
    ctaHref: "#",
    estimatedTime: "10 min",
    commonMistake: "Tentar registrar como DI algo que tem função técnica. Isso é patente.",
  },
  {
    id: "pesquisa-anterioridade",
    label: "Pesquisa Prévia",
    shortLabel: "Pesq.",
    stepNumber: 2,
    title: "Pesquise desenhos industriais já registrados",
    whatToDo:
      "Busque no banco do INPI se já existe desenho industrial semelhante ao seu. Isso evita que seu pedido seja negado.",
    whyNow:
      "O requisito de novidade exige que seu design não tenha sido publicado antes em lugar nenhum do mundo.",
    requirements: ["Imagens do seu design", "Acesso ao banco de dados do INPI"],
    ctaLabel: "Iniciar pesquisa",
    ctaHref: "#",
    estimatedTime: "30-60 min",
    commonMistake: "Publicar o design em redes sociais antes de protocolar o pedido. Isso pode invalidar a novidade.",
    officialLink: { label: "Busca no INPI", href: "https://busca.inpi.gov.br/pePI/" },
  },
  {
    id: "representacoes-graficas",
    label: "Imagens",
    shortLabel: "Imgs",
    stepNumber: 3,
    title: "Prepare as representações gráficas",
    whatToDo:
      "Crie imagens (desenhos técnicos, fotos ou renders 3D) do seu design em diferentes ângulos, conforme as normas do INPI.",
    whyNow:
      "As representações gráficas são o coração do pedido de DI. Elas definem exatamente o que está sendo protegido.",
    requirements: [
      "Imagens em alta resolução",
      "Vistas de diferentes ângulos (frontal, lateral, superior, etc.)",
      "Formato conforme normas INPI",
    ],
    ctaLabel: "Ver requisitos de imagem",
    ctaHref: "#",
    estimatedTime: "2-5 horas",
    commonMistake: "Enviar imagens em baixa resolução ou sem ângulos suficientes para definir o design completo.",
  },
  {
    id: "documentacao",
    label: "Documentação",
    shortLabel: "Docs",
    stepNumber: 4,
    title: "Reúna a documentação necessária",
    whatToDo:
      "Prepare CPF/CNPJ, RG e procuração (se for o caso). Organize as representações gráficas finais.",
    whyNow:
      "Documentação incompleta gera exigências do INPI, atrasando o processo em meses.",
    requirements: ["CPF ou CNPJ", "Documento de identidade", "Imagens finalizadas"],
    ctaLabel: "Ver checklist",
    ctaHref: "#",
    estimatedTime: "15 min",
    commonMistake: "Usar documentos vencidos ou inconsistentes com os dados do e-INPI.",
  },
  {
    id: "cadastro-gru",
    label: "Cadastro e GRU",
    shortLabel: "GRU",
    stepNumber: 5,
    title: "Cadastre-se no e-INPI e pague a GRU",
    whatToDo:
      "Crie conta no e-INPI, gere a GRU de depósito de Desenho Industrial e pague.",
    whyNow:
      "A GRU paga é obrigatória para enviar o pedido.",
    requirements: ["Conta Gov.br (nível prata ou ouro)", "CPF ou CNPJ", "Dados bancários"],
    ctaLabel: "Ver taxas de DI",
    ctaHref: "#",
    estimatedTime: "20 min",
    commonMistake: "PF e MEI têm desconto de 60%. Verifique antes de pagar.",
    officialLink: {
      label: "Tabela de Taxas INPI",
      href: "https://www.gov.br/inpi/pt-br/servicos/tabelas-de-retribuicao",
    },
  },
  {
    id: "protocolar",
    label: "Protocolar",
    shortLabel: "Envio",
    stepNumber: 6,
    title: "Protocole o pedido no e-INPI",
    whatToDo:
      "Preencha o formulário de depósito de Desenho Industrial, anexe as representações gráficas e envie.",
    whyNow:
      "Com tudo pronto, formalize o pedido para garantir a data de prioridade do seu design.",
    requirements: ["GRU paga", "Representações gráficas", "Documentação pessoal"],
    ctaLabel: "Ver como preencher",
    ctaHref: "#",
    estimatedTime: "20-30 min",
    commonMistake: "Não salvar o número do protocolo. Você vai precisar dele para acompanhar o processo.",
  },
  {
    id: "acompanhamento",
    label: "Acompanhamento",
    shortLabel: "Acomp.",
    stepNumber: 7,
    title: "Acompanhe o processo",
    whatToDo:
      "Monitore a RPI semanalmente. O registro de DI costuma ser mais rápido que patente, mas exigências podem surgir.",
    whyNow:
      "Perder prazos de resposta pode levar ao arquivamento do pedido.",
    requirements: ["Número do processo", "Acesso ao sistema INPI"],
    ctaLabel: "Ver como acompanhar",
    ctaHref: "#",
    estimatedTime: "5 min/semana",
    commonMistake: "Achar que o registro é automático. Mesmo DI pode ter exigências.",
    officialLink: { label: "Revista do INPI", href: "http://revistas.inpi.gov.br/" },
  },
];

export default function DesenhoIndustrialPage() {
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>(
    () => {
      const statuses: Record<string, StepStatus> = {};
      diSteps.forEach((step, idx) => {
        statuses[step.id] = idx === 0 ? "atual" : "pendente";
      });
      return statuses;
    }
  );

  const handleStatusChange = (stepId: string, newStatus: StepStatus) => {
    setStepStatuses((prev) => {
      const next = { ...prev, [stepId]: newStatus };
      if (newStatus === "concluido") {
        const idx = diSteps.findIndex((s) => s.id === stepId);
        if (idx < diSteps.length - 1) {
          const nextStepId = diSteps[idx + 1].id;
          if (next[nextStepId] === "pendente") {
            next[nextStepId] = "atual";
          }
        }
      }
      return next;
    });
  };

  const progressSteps: ProgressStep[] = diSteps.map((step) => ({
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
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Voltar ao início
          </Link>
        </div>

        <div className="mb-10">
          <span className="inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            Desenho Industrial
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Passo a passo para registrar seu design no INPI
          </h1>
        </div>

        <div className="mb-10">
          <ExplanationLayers
            simpleText="O Desenho Industrial protege a aparência do seu produto — forma, cores, linhas e texturas. Ninguém poderá copiar o visual do que você criou."
            detailedText="O registro de DI no INPI garante exclusividade sobre a forma ornamental de um produto por 10 anos (renovável por mais 3 períodos de 5 anos, totalizando até 25 anos). Protege apenas a estética, não a funcionalidade técnica."
            technicalText="Fundamentado na Lei 9.279/96, artigos 94 a 121. Requisitos: novidade (art. 96) e originalidade (art. 97). A configuração aplicada a produto industrial deve servir de tipo de fabricação. Vigência: 10 anos + 3×5 anos."
          />
        </div>

        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6">
          <ProgressBar steps={progressSteps} />
        </div>

        <div className="space-y-6">
          {diSteps.map((step) => (
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
