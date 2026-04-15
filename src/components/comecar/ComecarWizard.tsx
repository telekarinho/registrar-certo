"use client"

import { useState, useEffect } from "react"
import { BUSINESS_PRESETS, NICE_CLASSES, detectNiceClasses } from "@/lib/nice-classes"
import { PacoteRegistro } from "./PacoteRegistro"

interface RegistroData {
  nomeMarca: string
  tipoMarca: "nominativa" | "figurativa" | "mista" | ""
  pessoa: "PF" | "PJ" | "MEI" | ""
  documento: string
  razaoSocial: string
  emailContato: string
  presetNegocio: string
  descricaoNegocio: string
  classesEscolhidas: number[]
  marcaJaUsada: boolean
}

const STORAGE_KEY = "registrar-certo:dados-registro"

const initialData: RegistroData = {
  nomeMarca: "",
  tipoMarca: "",
  pessoa: "",
  documento: "",
  razaoSocial: "",
  emailContato: "",
  presetNegocio: "",
  descricaoNegocio: "",
  classesEscolhidas: [],
  marcaJaUsada: false,
}

export function ComecarWizard() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<RegistroData>(initialData)
  const [showResult, setShowResult] = useState(false)

  // Carrega dados do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setData({ ...initialData, ...parsed })
      } catch {
        // ignora
      }
    }
  }, [])

  // Salva no localStorage a cada mudança
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const update = <K extends keyof RegistroData>(key: K, value: RegistroData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  const totalSteps = 4
  const progress = Math.round(((step - 1) / totalSteps) * 100)

  // Aplica preset de negócio
  const aplicarPreset = (presetKey: string) => {
    const preset = BUSINESS_PRESETS[presetKey]
    if (preset) {
      update("presetNegocio", presetKey)
      update("classesEscolhidas", preset.classes)
      update("descricaoNegocio", preset.description)
    }
  }

  // Sugerir classes pelo texto
  const sugerirPorTexto = () => {
    if (data.descricaoNegocio.length > 5) {
      const detectadas = detectNiceClasses(data.descricaoNegocio)
      const numeros = detectadas.slice(0, 4).map((c) => c.number)
      if (numeros.length > 0) update("classesEscolhidas", numeros)
    }
  }

  if (showResult) {
    return <PacoteRegistro data={data} onVoltar={() => setShowResult(false)} />
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-10">
      {/* Progresso */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-sm font-medium text-gray-600">
          <span>Passo {step} de {totalSteps}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* PASSO 1: Nome e tipo da marca */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Qual o nome da sua marca?
            </h2>
            <p className="mt-2 text-gray-600">
              Escreva exatamente como ela aparece (com letras maiúsculas e minúsculas).
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Nome da marca
            </label>
            <input
              type="text"
              value={data.nomeMarca}
              onChange={(e) => update("nomeMarca", e.target.value)}
              placeholder="Ex: MilkyPot"
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-4 text-lg focus:border-blue-500 focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Como sua marca é apresentada?
            </label>
            <div className="space-y-3">
              {[
                {
                  id: "nominativa",
                  emoji: "🔤",
                  title: "Só o nome",
                  desc: 'Só letras (ex: "MilkyPot" em texto)',
                },
                {
                  id: "figurativa",
                  emoji: "🎨",
                  title: "Só o desenho/logo",
                  desc: "Sem texto, só o símbolo visual",
                },
                {
                  id: "mista",
                  emoji: "🎯",
                  title: "Nome + logo juntos",
                  desc: "Recomendado para a maioria dos negócios",
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update("tipoMarca", opt.id as RegistroData["tipoMarca"])}
                  className={`flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                    data.tipoMarca === opt.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{opt.title}</div>
                    <div className="text-sm text-gray-600">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <BotaoProximo
            disabled={!data.nomeMarca || !data.tipoMarca}
            onClick={() => setStep(2)}
          />
        </div>
      )}

      {/* PASSO 2: Tipo de pessoa */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Quem vai ser o dono do registro?
            </h2>
            <p className="mt-2 text-gray-600">
              Isso decide o valor da taxa do INPI.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                id: "MEI",
                emoji: "💼",
                title: "MEI (Microempreendedor Individual)",
                desc: "Taxa: R$ 142 (60% de desconto)",
                badge: "Mais barato",
              },
              {
                id: "PF",
                emoji: "👤",
                title: "Pessoa Física (CPF)",
                desc: "Taxa: R$ 142 (60% de desconto)",
                badge: "Mais barato",
              },
              {
                id: "PJ",
                emoji: "🏢",
                title: "Empresa (CNPJ - LTDA, S.A., etc.)",
                desc: "Taxa: R$ 355 (valor cheio)",
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => update("pessoa", opt.id as RegistroData["pessoa"])}
                className={`flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                  data.pessoa === opt.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{opt.title}</span>
                    {opt.badge && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {data.pessoa && (
            <div className="space-y-3 rounded-xl border-2 border-gray-100 bg-gray-50 p-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  {data.pessoa === "PF" ? "Seu CPF" : "CNPJ"}
                </label>
                <input
                  type="text"
                  value={data.documento}
                  onChange={(e) => update("documento", e.target.value)}
                  placeholder={data.pessoa === "PF" ? "000.000.000-00" : "00.000.000/0000-00"}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
              {data.pessoa !== "PF" && (
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Razão social ou nome empresarial
                  </label>
                  <input
                    type="text"
                    value={data.razaoSocial}
                    onChange={(e) => update("razaoSocial", e.target.value)}
                    placeholder="Ex: MilkyPot Franquias LTDA"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  E-mail de contato
                </label>
                <input
                  type="email"
                  value={data.emailContato}
                  onChange={(e) => update("emailContato", e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <BotaoVoltar onClick={() => setStep(1)} />
            <BotaoProximo
              disabled={!data.pessoa || !data.documento || !data.emailContato}
              onClick={() => setStep(3)}
            />
          </div>
        </div>
      )}

      {/* PASSO 3: Tipo de negócio (categoria) */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Que tipo de negócio é o seu?
            </h2>
            <p className="mt-2 text-gray-600">
              Isso ajuda a escolher as <strong>classes Nice</strong> certas (categorias
              de proteção do INPI).
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(BUSINESS_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                type="button"
                onClick={() => aplicarPreset(key)}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  data.presetNegocio === key
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold text-gray-900">{preset.name}</div>
                <div className="mt-1 text-xs text-gray-500">{preset.description}</div>
                {preset.classes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {preset.classes.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700"
                      >
                        Classe {c}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>

          {(data.presetNegocio === "outro" || !data.presetNegocio) && (
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
              <label className="mb-1 block text-sm font-semibold text-amber-900">
                Descreva seu negócio em poucas palavras
              </label>
              <textarea
                value={data.descricaoNegocio}
                onChange={(e) => update("descricaoNegocio", e.target.value)}
                onBlur={sugerirPorTexto}
                placeholder="Ex: vendo cosméticos naturais online e em loja física"
                rows={3}
                className="w-full rounded-lg border border-amber-200 px-4 py-3 focus:border-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={sugerirPorTexto}
                className="mt-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
              >
                Sugerir classes automaticamente
              </button>
            </div>
          )}

          {data.classesEscolhidas.length > 0 && (
            <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
              <div className="mb-2 font-semibold text-emerald-900">
                ✅ Classes selecionadas para sua marca:
              </div>
              <ul className="space-y-2">
                {data.classesEscolhidas.map((classNum) => {
                  const niceClass = NICE_CLASSES.find((c) => c.number === classNum)
                  if (!niceClass) return null
                  return (
                    <li key={classNum} className="text-sm">
                      <strong className="text-emerald-700">Classe {classNum}:</strong>{" "}
                      {niceClass.title}
                      <div className="text-xs text-gray-600">{niceClass.shortDescription}</div>
                    </li>
                  )
                })}
              </ul>
              <div className="mt-3 text-xs text-emerald-800">
                💡 Cada classe tem uma taxa separada do INPI. Você pode registrar em quantas classes precisar.
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <BotaoVoltar onClick={() => setStep(2)} />
            <BotaoProximo
              disabled={data.classesEscolhidas.length === 0}
              onClick={() => setStep(4)}
            />
          </div>
        </div>
      )}

      {/* PASSO 4: Confirmar e gerar pacote */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Tudo certo? Vou montar seu pacote 📦
            </h2>
            <p className="mt-2 text-gray-600">
              Confirme os dados antes de gerar.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border-2 border-gray-100 bg-gray-50 p-5">
            <ResumoLinha label="Nome da marca" value={data.nomeMarca} />
            <ResumoLinha
              label="Tipo"
              value={
                data.tipoMarca === "nominativa"
                  ? "Só nome (nominativa)"
                  : data.tipoMarca === "figurativa"
                  ? "Só logo (figurativa)"
                  : "Nome + logo (mista)"
              }
            />
            <ResumoLinha label="Titular" value={data.pessoa} />
            <ResumoLinha
              label={data.pessoa === "PF" ? "CPF" : "CNPJ"}
              value={data.documento}
            />
            {data.razaoSocial && (
              <ResumoLinha label="Empresa" value={data.razaoSocial} />
            )}
            <ResumoLinha label="E-mail" value={data.emailContato} />
            <ResumoLinha
              label="Classes Nice"
              value={data.classesEscolhidas.map((c) => `Classe ${c}`).join(", ")}
            />
          </div>

          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <strong>⚠️ Importante:</strong> Esses dados ficam salvos só no seu navegador.
            Não enviamos para nenhum servidor. Você pode voltar a qualquer momento e continuar de onde parou.
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <BotaoVoltar onClick={() => setStep(3)} />
            <button
              type="button"
              onClick={() => setShowResult(true)}
              className="flex-1 rounded-xl bg-emerald-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl"
            >
              Gerar meu pacote completo →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function BotaoProximo({
  disabled,
  onClick,
}: {
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
    >
      Continuar →
    </button>
  )
}

function BotaoVoltar({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border-2 border-gray-200 px-6 py-4 font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50"
    >
      ← Voltar
    </button>
  )
}

function ResumoLinha({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-gray-200 pb-2 last:border-0 last:pb-0">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  )
}
