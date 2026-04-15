"use client"

import { useState, useEffect } from "react"

interface Dados {
  nomeMarca: string
  descricaoNegocio: string
  pessoa: "PF" | "PJ" | "MEI" | ""
  documento: string
  email: string
}

interface Classe {
  numero: number
  titulo: string
  motivo: string
  especificacao: string
}

interface Pacote {
  tipoMarcaRecomendado: "mista" | "nominativa" | "figurativa"
  motivoTipo: string
  classes: Classe[]
  valorTotalGRU: number
  quantidadeGRUs: number
  alertas: string[]
  passosPersonalizados: string[]
  dicaLogoFinal: string
}

const STORAGE_KEY = "registrar-certo:conversa-ia"

const PERGUNTAS = [
  {
    campo: "nomeMarca",
    texto: "Qual o nome da sua marca?",
    placeholder: "Ex: MilkyPot",
    tipo: "text",
  },
  {
    campo: "descricaoNegocio",
    texto: "Em poucas palavras, o que sua marca faz?",
    placeholder: "Ex: Franquia de sorveteria que vende milkshake, açaí e sorvete na hora",
    tipo: "textarea",
  },
  {
    campo: "pessoa",
    texto: "Quem vai ser o dono do registro?",
    placeholder: "",
    tipo: "escolha",
    opcoes: [
      { valor: "PF", label: "Pessoa Física (CPF)", sub: "R$ 142 por classe (com desconto)" },
      { valor: "MEI", label: "MEI", sub: "R$ 142 por classe (com desconto)" },
      { valor: "PJ", label: "Empresa (CNPJ)", sub: "R$ 355 por classe (valor cheio)" },
    ],
  },
  {
    campo: "documento",
    texto: "Qual o CPF ou CNPJ do titular?",
    placeholder: "000.000.000-00 ou 00.000.000/0000-00",
    tipo: "text",
  },
  {
    campo: "email",
    texto: "Qual seu e-mail?",
    placeholder: "seu@email.com",
    tipo: "email",
  },
] as const

export function ConversaIA() {
  const [dados, setDados] = useState<Dados>({
    nomeMarca: "",
    descricaoNegocio: "",
    pessoa: "",
    documento: "",
    email: "",
  })
  const [etapa, setEtapa] = useState(0)
  const [input, setInput] = useState("")
  const [pacote, setPacote] = useState<Pacote | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [copiado, setCopiado] = useState<string | null>(null)

  // Carrega dados salvos
  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      if (s) {
        const p = JSON.parse(s)
        if (p.dados) setDados(p.dados)
        if (p.pacote) setPacote(p.pacote)
        if (p.etapa !== undefined) setEtapa(p.etapa)
      }
    } catch {}
  }, [])

  // Salva
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ dados, pacote, etapa }))
  }, [dados, pacote, etapa])

  const perguntaAtual = PERGUNTAS[etapa]

  const responder = (valor: string) => {
    if (!valor.trim()) return
    const novosDados = { ...dados, [perguntaAtual.campo]: valor }
    setDados(novosDados)
    setInput("")

    if (etapa < PERGUNTAS.length - 1) {
      setEtapa(etapa + 1)
    } else {
      // Última pergunta respondida — gera pacote
      gerarPacote(novosDados)
    }
  }

  const gerarPacote = async (d: Dados) => {
    setCarregando(true)
    setErro(null)
    try {
      const res = await fetch("/api/agente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeMarca: d.nomeMarca,
          descricaoNegocio: d.descricaoNegocio,
          pessoa: d.pessoa,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErro(data.error || "Erro ao gerar pacote")
      } else {
        setPacote(data)
      }
    } catch {
      setErro("Não conseguimos conectar à IA. Tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  const reiniciar = () => {
    setDados({ nomeMarca: "", descricaoNegocio: "", pessoa: "", documento: "", email: "" })
    setEtapa(0)
    setPacote(null)
    setInput("")
    setErro(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const copiar = (texto: string, label: string) => {
    navigator.clipboard.writeText(texto)
    setCopiado(label)
    setTimeout(() => setCopiado(null), 2000)
  }

  // === TELA FINAL: PACOTE PRONTO ===
  if (pacote) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-700 p-6 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎁</span>
            <div>
              <h1 className="text-2xl font-bold">Seu pacote está pronto!</h1>
              <p className="text-emerald-100">
                Marca <strong>{dados.nomeMarca}</strong> — IA gerou tudo que você precisa colar no INPI
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="rounded-lg bg-white/20 px-4 py-2 backdrop-blur">
              <div className="text-xs">Taxa total</div>
              <div className="text-2xl font-bold">R$ {pacote.valorTotalGRU},00</div>
            </div>
            <div className="rounded-lg bg-white/20 px-4 py-2 backdrop-blur">
              <div className="text-xs">GRUs a gerar</div>
              <div className="text-2xl font-bold">{pacote.quantidadeGRUs}</div>
            </div>
            <div className="rounded-lg bg-white/20 px-4 py-2 backdrop-blur">
              <div className="text-xs">Tipo de marca</div>
              <div className="text-2xl font-bold capitalize">{pacote.tipoMarcaRecomendado}</div>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {pacote.alertas?.length > 0 && (
          <div className="mb-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
            <div className="font-semibold text-amber-900">⚠️ Atenção antes de começar:</div>
            <ul className="mt-2 space-y-1 text-sm text-amber-800">
              {pacote.alertas.map((a, i) => <li key={i}>• {a}</li>)}
            </ul>
          </div>
        )}

        {/* Tipo de marca */}
        <Bloco titulo="🎨 Tipo de marca recomendado">
          <p className="text-gray-700">
            <strong className="capitalize">{pacote.tipoMarcaRecomendado}</strong> — {pacote.motivoTipo}
          </p>
        </Bloco>

        {/* Classes */}
        {pacote.classes?.map((c, i) => (
          <Bloco key={i} titulo={`📋 Classe ${c.numero} — ${c.titulo}`}>
            <p className="mb-3 text-sm text-gray-600"><strong>Por quê:</strong> {c.motivo}</p>
            <div className="rounded-lg border-2 border-blue-100 bg-blue-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-blue-700">
                  Especificação (copie e cole no e-Marcas)
                </span>
                <button
                  onClick={() => copiar(c.especificacao, `esp-${i}`)}
                  className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                >
                  {copiado === `esp-${i}` ? "✓ Copiado!" : "📋 Copiar"}
                </button>
              </div>
              <p className="whitespace-pre-wrap font-mono text-sm text-gray-900">
                {c.especificacao}
              </p>
            </div>
          </Bloco>
        ))}

        {/* Logo */}
        <Bloco titulo="🖼️ Sobre o logo">
          <p className="text-gray-700">{pacote.dicaLogoFinal}</p>
          <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            <strong>Requisitos técnicos:</strong> JPG, fundo branco, entre 100x100 e 945x945 pixels, máximo 2MB.
          </div>
        </Bloco>

        {/* Passos personalizados */}
        {pacote.passosPersonalizados?.length > 0 && (
          <Bloco titulo="🎯 Seus próximos passos">
            <ol className="space-y-2">
              {pacote.passosPersonalizados.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-gray-700">{p}</span>
                </li>
              ))}
            </ol>
          </Bloco>
        )}

        {/* Seus dados */}
        <Bloco titulo="👤 Seus dados">
          <div className="space-y-2 text-sm">
            <DataLine label="Nome da marca" valor={dados.nomeMarca} onCopy={copiar} />
            <DataLine label={dados.pessoa === "PJ" ? "CNPJ" : "CPF"} valor={dados.documento} onCopy={copiar} />
            <DataLine label="E-mail" valor={dados.email} onCopy={copiar} />
          </div>
          {copiado && copiado.startsWith("data-") && (
            <div className="mt-2 text-xs text-emerald-600">✓ Copiado!</div>
          )}
        </Bloco>

        {/* Botões finais */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://gru.inpi.gov.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl bg-blue-600 px-6 py-4 text-center font-bold text-white hover:bg-blue-700"
          >
            Ir pagar a GRU agora →
          </a>
          <a
            href="/assistente"
            className="rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-center font-semibold text-gray-700 hover:border-gray-300"
          >
            🤖 Guia tela por tela
          </a>
          <button
            onClick={reiniciar}
            className="rounded-xl border-2 border-gray-200 bg-white px-6 py-4 font-semibold text-gray-700 hover:border-red-300 hover:text-red-600"
          >
            🔄 Reiniciar
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          Tudo gerado por IA. Revise os textos antes de colar no INPI. O pedido oficial é feito em gov.br/inpi.
        </div>
      </div>
    )
  }

  // === TELA DE CARREGAMENTO ===
  if (carregando) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mb-6 text-6xl animate-bounce">🤖</div>
        <h2 className="text-2xl font-bold text-gray-900">A IA está montando seu pacote...</h2>
        <p className="mt-2 text-gray-600">
          Analisando seu negócio, escolhendo as classes Nice certas e escrevendo as especificações.
        </p>
        <div className="mx-auto mt-8 flex w-fit gap-2">
          <span className="h-3 w-3 animate-pulse rounded-full bg-blue-400" />
          <span className="h-3 w-3 animate-pulse rounded-full bg-blue-400 [animation-delay:200ms]" />
          <span className="h-3 w-3 animate-pulse rounded-full bg-blue-400 [animation-delay:400ms]" />
        </div>
      </div>
    )
  }

  // === TELA DE PERGUNTAS ===
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 text-center">
        <div className="text-5xl">🤖</div>
        <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
          Registrar marca com IA
        </h1>
        <p className="mt-2 text-gray-600">
          5 perguntas rápidas. A IA gera tudo pra você.
        </p>
      </div>

      {/* Progresso */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs font-semibold text-gray-500">
          <span>Pergunta {etapa + 1} de {PERGUNTAS.length}</span>
          <span>{Math.round(((etapa) / PERGUNTAS.length) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${(etapa / PERGUNTAS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Mensagens anteriores (resumo) */}
      {etapa > 0 && (
        <div className="mb-6 space-y-2">
          {PERGUNTAS.slice(0, etapa).map((p) => {
            const valor = dados[p.campo as keyof Dados] as string
            return (
              <div key={p.campo} className="flex items-start gap-2 text-sm">
                <span className="text-emerald-500">✓</span>
                <div className="flex-1 text-gray-600">
                  <span className="font-medium">{p.texto}</span>{" "}
                  <span className="text-gray-900">{valor}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pergunta atual */}
      <div className="rounded-2xl border-2 border-blue-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex items-start gap-3">
          <span className="text-2xl">💬</span>
          <h2 className="text-xl font-bold text-gray-900">{perguntaAtual.texto}</h2>
        </div>

        {perguntaAtual.tipo === "escolha" && perguntaAtual.opcoes ? (
          <div className="space-y-3">
            {perguntaAtual.opcoes.map((opt) => (
              <button
                key={opt.valor}
                onClick={() => responder(opt.valor)}
                className="w-full rounded-xl border-2 border-gray-200 p-4 text-left hover:border-blue-600 hover:bg-blue-50"
              >
                <div className="font-semibold text-gray-900">{opt.label}</div>
                <div className="text-sm text-gray-600">{opt.sub}</div>
              </button>
            ))}
          </div>
        ) : perguntaAtual.tipo === "textarea" ? (
          <form
            onSubmit={(e) => { e.preventDefault(); responder(input) }}
            className="space-y-3"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={perguntaAtual.placeholder}
              rows={4}
              autoFocus
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300"
            >
              Continuar →
            </button>
          </form>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); responder(input) }}
            className="space-y-3"
          >
            <input
              type={perguntaAtual.tipo}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={perguntaAtual.placeholder}
              autoFocus
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-4 text-lg focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300"
            >
              {etapa === PERGUNTAS.length - 1 ? "✨ Gerar pacote com IA" : "Continuar →"}
            </button>
          </form>
        )}

        {etapa > 0 && (
          <button
            onClick={() => setEtapa(etapa - 1)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            ← Voltar
          </button>
        )}
      </div>

      {erro && (
        <div className="mt-4 rounded-xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <strong>Erro:</strong> {erro}
          <button
            onClick={() => gerarPacote(dados)}
            className="ml-2 underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="mt-8 text-center text-xs text-gray-500">
        Seus dados ficam só no seu navegador. Não enviamos para nenhum servidor além da IA (Groq).
      </div>
    </div>
  )
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded-xl border-2 border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-3 font-bold text-gray-900">{titulo}</h3>
      {children}
    </div>
  )
}

function DataLine({
  label,
  valor,
  onCopy,
}: {
  label: string
  valor: string
  onCopy: (v: string, k: string) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
      <div>
        <span className="text-xs text-gray-500">{label}:</span>{" "}
        <span className="font-mono text-sm text-gray-900">{valor}</span>
      </div>
      <button
        onClick={() => onCopy(valor, `data-${label}`)}
        className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
      >
        📋
      </button>
    </div>
  )
}
