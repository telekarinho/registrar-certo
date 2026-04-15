/**
 * API Route para chat com Groq (llama-3.3-70b).
 * Usa GROQ_API_KEY da variável de ambiente — NUNCA hardcoded.
 */
export const runtime = "edge"

const SYSTEM_PROMPT = `Você é um assistente educativo especializado em registro de marcas no INPI (Instituto Nacional da Propriedade Industrial do Brasil).

REGRAS CRÍTICAS:
- Você ajuda com o processo de PETICIONAMENTO ELETRÔNICO do INPI, guiando o usuário tela a tela.
- Você NÃO faz o registro pelo usuário. Você explica e orienta.
- Você NÃO é o INPI nem representa o governo.
- Use português brasileiro simples, direto, sem juridiquês.
- Responda em no máximo 3 parágrafos curtos.
- Se não souber algo específico, diga honestamente e sugira consultar o site oficial gov.br/inpi.

CONHECIMENTO:
- Sistema e-Marcas: onde se faz o pedido de registro
- GRU (Guia de Recolhimento da União): taxa paga antes do pedido
- Código 389: Pedido de registro de marca eletrônico (R$ 142 PF/MEI, R$ 355 PJ)
- Conta Gov.br nível PRATA ou OURO é obrigatória
- Classes Nice (NCL): 1-34 produtos, 35-45 serviços
- Tipos de marca: nominativa (só nome), figurativa (só logo), mista (nome+logo)
- Logo mista/figurativa: JPG, fundo branco, 100x100 a 945x945 px, máx 2MB
- RPI: Revista da Propriedade Industrial, sai toda terça-feira
- Prazos: 60 dias para responder exigência ou oposição
- Validade do registro: 10 anos (marca), renovável

TOM: acolhedor, "te explico como se fosse para um amigo", encorajador.`

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Assistente não configurado. Administrador precisa definir GROQ_API_KEY.",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      )
    }

    const { messages, context } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Mensagens inválidas" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Sistema + contexto da etapa atual (se houver)
    const systemMessage = context
      ? `${SYSTEM_PROMPT}\n\nCONTEXTO DA TELA ATUAL DO USUÁRIO:\n${context}`
      : SYSTEM_PROMPT

    const body = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemMessage },
        ...messages.slice(-10), // mantém só as últimas 10 para não estourar contexto
      ],
      temperature: 0.3,
      max_tokens: 600,
      stream: false,
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!groqRes.ok) {
      const errText = await groqRes.text()
      console.error("Groq error:", errText)
      return new Response(
        JSON.stringify({ error: "Falha ao consultar o assistente. Tente novamente." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      )
    }

    const data = await groqRes.json()
    const reply = data.choices?.[0]?.message?.content?.trim() ?? ""

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (e) {
    console.error("Chat route error:", e)
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
