/**
 * API /api/agente
 * Recebe os dados mínimos do usuário (nome da marca + descrição do negócio + tipo de pessoa)
 * e devolve um PACOTE COMPLETO em JSON estruturado:
 * - classes Nice sugeridas (com motivo)
 * - especificação de produtos/serviços pronta para colar no e-Marcas
 * - tipo de marca (nominativa/figurativa/mista)
 * - valor total da GRU
 * - alertas importantes
 * - passos personalizados
 */
export const runtime = "edge"

const SYSTEM_PROMPT = `Você é um agente especialista em registro de marca no INPI brasileiro.

Sua tarefa: com base nos dados mínimos do usuário, gerar um PACOTE COMPLETO pronto para ser colado nos campos do sistema e-Marcas do INPI.

REGRAS:
- Responda APENAS com JSON válido, sem texto antes ou depois, sem markdown.
- Use português brasileiro formal (o INPI exige isso nos textos técnicos).
- A especificação de serviços/produtos deve seguir a redação padrão da Classificação de Nice.
- Valores da GRU: PF/MEI = R$ 142 por classe; PJ = R$ 355 por classe.
- Tipos de marca: "nominativa" (só texto), "figurativa" (só imagem), "mista" (texto+imagem).
- Sugira no máximo 3 classes (só as essenciais).
- Seja direto, sem floreios.

FORMATO JSON OBRIGATÓRIO:
{
  "tipoMarcaRecomendado": "mista" | "nominativa" | "figurativa",
  "motivoTipo": "frase curta explicando por que esse tipo",
  "classes": [
    {
      "numero": 43,
      "titulo": "título curto da classe",
      "motivo": "por que essa classe faz sentido para o negócio",
      "especificacao": "texto completo em linguagem do INPI, pronto para colar no campo 'Especificação dos produtos/serviços'"
    }
  ],
  "valorTotalGRU": 142,
  "quantidadeGRUs": 1,
  "alertas": [
    "frase curta sobre algo crítico a lembrar"
  ],
  "passosPersonalizados": [
    "passo específico para esse caso"
  ],
  "dicaLogoFinal": "dica específica para o logo desse negócio"
}`

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return jsonError(503, "IA não configurada. Configure GROQ_API_KEY na Vercel.")
    }

    const { nomeMarca, descricaoNegocio, pessoa } = await req.json()

    if (!nomeMarca || !descricaoNegocio || !pessoa) {
      return jsonError(400, "Dados incompletos. Preciso do nome, descrição e tipo de pessoa.")
    }

    const userMsg = `Dados do usuário:
- Nome da marca: "${nomeMarca}"
- Descrição do negócio: "${descricaoNegocio}"
- Tipo de pessoa: ${pessoa} (PF=Pessoa Física, PJ=Empresa com CNPJ, MEI=Microempreendedor)

Gere o pacote completo em JSON seguindo exatamente o formato especificado no sistema.`

    const body = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMsg },
      ],
      temperature: 0.2,
      max_tokens: 1500,
      response_format: { type: "json_object" },
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
      const txt = await groqRes.text()
      console.error("Groq error:", txt)
      return jsonError(502, "Falha ao consultar a IA. Tente novamente.")
    }

    const data = await groqRes.json()
    const content = data.choices?.[0]?.message?.content?.trim() ?? ""

    let pacote
    try {
      pacote = JSON.parse(content)
    } catch {
      return jsonError(500, "A IA respondeu em formato inválido. Tente novamente.")
    }

    // Valida valor da GRU pela quantidade de classes e tipo de pessoa
    const numClasses = pacote.classes?.length ?? 0
    const valorUnit = pessoa === "PJ" ? 355 : 142
    pacote.valorTotalGRU = valorUnit * numClasses
    pacote.quantidadeGRUs = numClasses

    return new Response(JSON.stringify(pacote), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (e) {
    console.error("Agente error:", e)
    return jsonError(500, "Erro interno ao gerar pacote.")
  }
}

function jsonError(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}
