"use client";

import { useReducer, useCallback } from "react";
import { cn } from "@/lib/utils";
import { TriageResult } from "./TriageResult";

// ── Types ──────────────────────────────────────────────────────────────────

type ProtectionType = "nome_logo" | "invencao" | "visual" | "nao_sei" | null;
type BrandType = "nome" | "logo" | "ambos" | null;
type InventionType = "processo_novo" | "melhoria_pratica" | null;
type VisualConfirm = "sim" | "funcional" | null;
type UsageStatus = "sim" | "nao" | "em_desenvolvimento" | null;
type PersonType = "pf" | "pj" | "mei" | null;

export type TriageOutcome =
  | "MARCA"
  | "PATENTE_INVENCAO"
  | "PATENTE_MODELO_UTILIDADE"
  | "DESENHO_INDUSTRIAL"
  | "INCONCLUSIVO";

interface TriageState {
  currentStep: number;
  protectionType: ProtectionType;
  brandType: BrandType;
  inventionType: InventionType;
  visualConfirm: VisualConfirm;
  usageStatus: UsageStatus;
  personType: PersonType;
  outcome: TriageOutcome | null;
  isComplete: boolean;
}

type TriageAction =
  | { type: "SET_PROTECTION_TYPE"; payload: ProtectionType }
  | { type: "SET_BRAND_TYPE"; payload: BrandType }
  | { type: "SET_INVENTION_TYPE"; payload: InventionType }
  | { type: "SET_VISUAL_CONFIRM"; payload: VisualConfirm }
  | { type: "SET_USAGE_STATUS"; payload: UsageStatus }
  | { type: "SET_PERSON_TYPE"; payload: PersonType }
  | { type: "GO_BACK" }
  | { type: "RESET" };

// ── Helpers ────────────────────────────────────────────────────────────────

function getNextStep(state: TriageState, action: TriageAction): number {
  const step = state.currentStep;

  if (action.type === "SET_PROTECTION_TYPE") {
    switch (action.payload) {
      case "nome_logo":
        return 2; // brand type question
      case "invencao":
        return 3; // invention type question
      case "visual":
        return 4; // visual confirm question
      case "nao_sei":
        return 5; // skip to usage
      default:
        return step + 1;
    }
  }

  if (action.type === "SET_BRAND_TYPE") return 5;
  if (action.type === "SET_INVENTION_TYPE") return 5;
  if (action.type === "SET_VISUAL_CONFIRM") {
    if (action.payload === "funcional") return 3; // redirect to invention
    return 5;
  }
  if (action.type === "SET_USAGE_STATUS") return 6;
  if (action.type === "SET_PERSON_TYPE") return 7; // complete

  return step + 1;
}

function getPreviousStep(state: TriageState): number {
  const step = state.currentStep;

  if (step === 2 || step === 3 || step === 4) return 1;
  if (step === 5) {
    if (state.protectionType === "nome_logo") return 2;
    if (state.protectionType === "invencao") return 3;
    if (state.protectionType === "visual") {
      return state.visualConfirm === "funcional" ? 3 : 4;
    }
    return 1;
  }
  if (step === 6) return 5;

  return Math.max(1, step - 1);
}

function determineOutcome(state: TriageState): TriageOutcome {
  const { protectionType, inventionType, visualConfirm } = state;

  if (protectionType === "nome_logo") return "MARCA";

  if (protectionType === "invencao" || (protectionType === "visual" && visualConfirm === "funcional")) {
    if (inventionType === "processo_novo") return "PATENTE_INVENCAO";
    if (inventionType === "melhoria_pratica") return "PATENTE_MODELO_UTILIDADE";
    return "PATENTE_INVENCAO";
  }

  if (protectionType === "visual" && visualConfirm === "sim") return "DESENHO_INDUSTRIAL";

  return "INCONCLUSIVO";
}

// ── Reducer ────────────────────────────────────────────────────────────────

const initialState: TriageState = {
  currentStep: 1,
  protectionType: null,
  brandType: null,
  inventionType: null,
  visualConfirm: null,
  usageStatus: null,
  personType: null,
  outcome: null,
  isComplete: false,
};

function triageReducer(state: TriageState, action: TriageAction): TriageState {
  switch (action.type) {
    case "SET_PROTECTION_TYPE": {
      const nextStep = getNextStep(state, action);
      return {
        ...state,
        protectionType: action.payload,
        brandType: null,
        inventionType: null,
        visualConfirm: null,
        currentStep: nextStep,
      };
    }
    case "SET_BRAND_TYPE":
      return {
        ...state,
        brandType: action.payload,
        currentStep: getNextStep(state, action),
      };
    case "SET_INVENTION_TYPE":
      return {
        ...state,
        inventionType: action.payload,
        currentStep: getNextStep(state, action),
      };
    case "SET_VISUAL_CONFIRM": {
      const nextStep = getNextStep(state, action);
      return {
        ...state,
        visualConfirm: action.payload,
        currentStep: nextStep,
      };
    }
    case "SET_USAGE_STATUS":
      return {
        ...state,
        usageStatus: action.payload,
        currentStep: getNextStep(state, action),
      };
    case "SET_PERSON_TYPE": {
      const outcome = determineOutcome({
        ...state,
        personType: action.payload,
      });
      return {
        ...state,
        personType: action.payload,
        outcome,
        isComplete: true,
        currentStep: 7,
      };
    }
    case "GO_BACK":
      return {
        ...state,
        currentStep: getPreviousStep(state),
        isComplete: false,
        outcome: null,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────

interface OptionCardProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

function OptionCard({ label, description, icon, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-4 rounded-xl border-2 p-5 text-left transition-all",
        "hover:border-blue-300 hover:bg-blue-50/50",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        selected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white"
      )}
    >
      {icon && (
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          selected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
        )}>
          {icon}
        </div>
      )}
      <div>
        <span className="text-base font-medium text-gray-900">{label}</span>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </button>
  );
}

function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Pergunta {current} de {total}</span>
        <span>{Math.round((current / total) * 100)}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export function TriageWizard() {
  const [state, dispatch] = useReducer(triageReducer, initialState);

  const handleReset = useCallback(() => dispatch({ type: "RESET" }), []);
  const handleBack = useCallback(() => dispatch({ type: "GO_BACK" }), []);

  const totalSteps = 6;

  if (state.isComplete && state.outcome) {
    return (
      <TriageResult
        outcome={state.outcome}
        personType={state.personType}
        usageStatus={state.usageStatus}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <StepProgress current={state.currentStep} total={totalSteps} />

      <div className="relative min-h-[400px]">
        {/* Step 1: What do you want to protect? */}
        {state.currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900">
              O que você quer proteger?
            </h2>
            <p className="mt-2 text-gray-600">
              Selecione a opção que melhor descreve o que você tem em mente.
            </p>
            <div className="mt-8 space-y-3">
              <OptionCard
                label="Um nome, logo ou identidade visual"
                description="Ex.: nome da sua empresa, logomarca, slogan"
                selected={state.protectionType === "nome_logo"}
                onClick={() =>
                  dispatch({ type: "SET_PROTECTION_TYPE", payload: "nome_logo" })
                }
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  </svg>
                }
              />
              <OptionCard
                label="Uma invenção ou inovação técnica"
                description="Ex.: novo mecanismo, processo, fórmula ou dispositivo"
                selected={state.protectionType === "invencao"}
                onClick={() =>
                  dispatch({ type: "SET_PROTECTION_TYPE", payload: "invencao" })
                }
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                }
              />
              <OptionCard
                label="O visual / formato de um produto"
                description="Ex.: design de uma embalagem, formato de um móvel, padrão decorativo"
                selected={state.protectionType === "visual"}
                onClick={() =>
                  dispatch({ type: "SET_PROTECTION_TYPE", payload: "visual" })
                }
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                  </svg>
                }
              />
              <OptionCard
                label="Não sei bem o que preciso"
                description="Vamos te ajudar a descobrir com base nas suas respostas"
                selected={state.protectionType === "nao_sei"}
                onClick={() =>
                  dispatch({ type: "SET_PROTECTION_TYPE", payload: "nao_sei" })
                }
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                }
              />
            </div>
          </div>
        )}

        {/* Step 2: Brand type (if nome_logo) */}
        {state.currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900">
              É um nome, um símbolo visual ou os dois?
            </h2>
            <p className="mt-2 text-gray-600">
              Isso ajuda a definir o tipo exato de registro de marca.
            </p>
            <div className="mt-8 space-y-3">
              <OptionCard
                label="Apenas o nome (marca nominativa)"
                description="Ex.: 'RegistrarCerto' escrito de qualquer forma"
                selected={state.brandType === "nome"}
                onClick={() =>
                  dispatch({ type: "SET_BRAND_TYPE", payload: "nome" })
                }
              />
              <OptionCard
                label="Apenas o símbolo/logo (marca figurativa)"
                description="Ex.: um ícone ou desenho sem texto"
                selected={state.brandType === "logo"}
                onClick={() =>
                  dispatch({ type: "SET_BRAND_TYPE", payload: "logo" })
                }
              />
              <OptionCard
                label="Nome + logo juntos (marca mista)"
                description="Ex.: o nome estilizado com um ícone ao lado"
                selected={state.brandType === "ambos"}
                onClick={() =>
                  dispatch({ type: "SET_BRAND_TYPE", payload: "ambos" })
                }
              />
            </div>
          </div>
        )}

        {/* Step 3: Invention type (if invencao) */}
        {state.currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900">
              O que melhor descreve sua inovação?
            </h2>
            <p className="mt-2 text-gray-600">
              Isso determina se você precisa de uma patente de invenção ou modelo
              de utilidade.
            </p>
            <div className="mt-8 space-y-3">
              <OptionCard
                label="Um processo, mecanismo ou produto totalmente novo"
                description="Algo que não existia antes e resolve um problema técnico de forma inédita"
                selected={state.inventionType === "processo_novo"}
                onClick={() =>
                  dispatch({
                    type: "SET_INVENTION_TYPE",
                    payload: "processo_novo",
                  })
                }
              />
              <OptionCard
                label="Uma melhoria prática em algo que já existe"
                description="Uma modificação que torna algo existente mais funcional ou eficiente"
                selected={state.inventionType === "melhoria_pratica"}
                onClick={() =>
                  dispatch({
                    type: "SET_INVENTION_TYPE",
                    payload: "melhoria_pratica",
                  })
                }
              />
            </div>
          </div>
        )}

        {/* Step 4: Visual confirm (if visual) */}
        {state.currentStep === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900">
              Você quer proteger a aparência/formato visual do produto?
            </h2>
            <p className="mt-2 text-gray-600">
              Desenho industrial protege a forma estética, não a função.
            </p>
            <div className="mt-8 space-y-3">
              <OptionCard
                label="Sim, quero proteger o visual/design"
                description="A aparência, formato ou padrão ornamental do produto"
                selected={state.visualConfirm === "sim"}
                onClick={() =>
                  dispatch({ type: "SET_VISUAL_CONFIRM", payload: "sim" })
                }
              />
              <OptionCard
                label="Na verdade, é mais funcional do que estético"
                description="O diferencial está em como funciona, não em como se parece"
                selected={state.visualConfirm === "funcional"}
                onClick={() =>
                  dispatch({ type: "SET_VISUAL_CONFIRM", payload: "funcional" })
                }
              />
            </div>
          </div>
        )}

        {/* Step 5: Usage status */}
        {state.currentStep === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900">
              Você já tem esse produto/marca em uso?
            </h2>
            <p className="mt-2 text-gray-600">
              Isso influencia a estratégia e o momento ideal para registrar.
            </p>
            <div className="mt-8 space-y-3">
              <OptionCard
                label="Sim, já está em uso"
                description="Já uso comercialmente ou publicamente"
                selected={state.usageStatus === "sim"}
                onClick={() =>
                  dispatch({ type: "SET_USAGE_STATUS", payload: "sim" })
                }
              />
              <OptionCard
                label="Não, ainda é só uma ideia"
                description="Ainda não comecei a usar ou produzir"
                selected={state.usageStatus === "nao"}
                onClick={() =>
                  dispatch({ type: "SET_USAGE_STATUS", payload: "nao" })
                }
              />
              <OptionCard
                label="Em desenvolvimento"
                description="Estou em fase de criação ou protótipo"
                selected={state.usageStatus === "em_desenvolvimento"}
                onClick={() =>
                  dispatch({
                    type: "SET_USAGE_STATUS",
                    payload: "em_desenvolvimento",
                  })
                }
              />
            </div>
          </div>
        )}

        {/* Step 6: Person type */}
        {state.currentStep === 6 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900">
              Você é pessoa física ou jurídica?
            </h2>
            <p className="mt-2 text-gray-600">
              Isso afeta as taxas e o fluxo de cadastro no INPI.
            </p>
            <div className="mt-8 space-y-3">
              <OptionCard
                label="Pessoa Física (CPF)"
                description="Registro em nome pessoal"
                selected={state.personType === "pf"}
                onClick={() =>
                  dispatch({ type: "SET_PERSON_TYPE", payload: "pf" })
                }
              />
              <OptionCard
                label="Pessoa Jurídica (CNPJ)"
                description="Empresa de qualquer porte com CNPJ"
                selected={state.personType === "pj"}
                onClick={() =>
                  dispatch({ type: "SET_PERSON_TYPE", payload: "pj" })
                }
              />
              <OptionCard
                label="MEI (Microempreendedor Individual)"
                description="Pode ter desconto nas taxas do INPI"
                selected={state.personType === "mei"}
                onClick={() =>
                  dispatch({ type: "SET_PERSON_TYPE", payload: "mei" })
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      {state.currentStep > 1 && (
        <div className="mt-8">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
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
            Voltar
          </button>
        </div>
      )}
    </div>
  );
}
