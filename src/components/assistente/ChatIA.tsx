"use client"

import { useState, useRef, useEffect } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Props {
  /** Contexto da etapa atual que é passado ao sistema (não aparece ao usuário). */
  contexto?: string
  /** Mensagem inicial do assistente. */
  mensagemInicial?: string
  /** Perguntas sugeridas que aparecem como botões antes da primeira mensagem. */
  sugestoes?: string[]
  /** Se true, abre o chat automaticamente quando carrega. */
  abrirAutomatico?: boolean
}

export function ChatIA({
  contexto,
  mensagemInicial = "Olá! Sou seu assistente para o registro de marca. No que posso ajudar?",
  sugestoes = [
    "Como emitir a GRU?",
    "O que é classe Nice 43?",
    "Como fazer login no e-Marcas?",
    "Meu logo está no formato certo?",
  ],
  abrirAutomatico = false,
}: Props) {
  const [aberto, setAberto] = useState(abrirAutomatico)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: mensagemInicial },
  ])
  const [input, setInput] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, carregando])

  const enviarMensagem = async (texto: string) => {
    if (!texto.trim() || carregando) return
    setErro(null)
    const novaMsg: Message = { role: "user", content: texto.trim() }
    const novasMensagens = [...messages, novaMsg]
    setMessages(novasMensagens)
    setInput("")
    setCarregando(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: novasMensagens.map((m) => ({ role: m.role, content: m.content })),
          context: contexto,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErro(data.error || "Erro ao consultar o assistente")
      } else {
        setMessages([...novasMensagens, { role: "assistant", content: data.reply }])
      }
    } catch {
      setErro("Não conseguimos conectar ao assistente. Tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      {/* Botão flutuante */}
      {!aberto && (
        <button
          onClick={() => setAberto(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-4 text-white shadow-2xl transition-all hover:bg-blue-700 hover:shadow-xl"
          aria-label="Abrir assistente IA"
        >
          <span className="text-xl">🤖</span>
          <span className="hidden font-semibold sm:inline">Assistente IA</span>
        </button>
      )}

      {/* Janela do chat */}
      {aberto && (
        <div className="fixed bottom-0 right-0 z-50 flex w-full flex-col bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:h-[600px] sm:max-h-[80vh] sm:w-[400px] sm:rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-blue-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <div className="font-semibold">Assistente IA</div>
                <div className="text-xs text-blue-100">Grátis • sempre disponível</div>
              </div>
            </div>
            <button
              onClick={() => setAberto(false)}
              className="rounded-lg p-2 text-white hover:bg-blue-700"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 shadow-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {carregando && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400 [animation-delay:200ms]" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400 [animation-delay:400ms]" />
                    </div>
                  </div>
                </div>
              )}
              {erro && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  {erro}
                </div>
              )}

              {/* Sugestões aparecem só na primeira mensagem */}
              {messages.length === 1 && sugestoes.length > 0 && (
                <div className="mt-4">
                  <div className="mb-2 text-xs font-semibold text-gray-500">
                    Perguntas frequentes:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sugestoes.map((s) => (
                      <button
                        key={s}
                        onClick={() => enviarMensagem(s)}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              enviarMensagem(input)
            }}
            className="border-t border-gray-200 bg-white p-3"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua pergunta..."
                disabled={carregando}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || carregando}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {carregando ? "..." : "Enviar"}
              </button>
            </div>
            <div className="mt-2 text-center text-xs text-gray-400">
              Respostas geradas por IA. Confirme dados importantes em gov.br/inpi
            </div>
          </form>
        </div>
      )}
    </>
  )
}
