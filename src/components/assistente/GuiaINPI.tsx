"use client"

import { useState, useEffect } from "react"
import { ChatIA } from "./ChatIA"

/**
 * Guia interativo PÓS-LOGIN do INPI.
 * Cada tela corresponde a uma etapa real que o usuário vai ver no sistema do INPI.
 * O usuário avança manualmente conforme faz no site do INPI.
 */

interface Etapa {
  id: string
  icone: string
  titulo: string
  onde: string
  oQueFazer: string[]
  camposPreenchidos?: { label: string; valor: string }[]
  dicaCritica: string
  link: string
  linkLabel: string
  contextoIA: string
}

const ETAPAS: Etapa[] = [
  {
    id: "gru-login",
    icone: "🔐",
    titulo: "Login no sistema de GRU",
    onde: "Você está em: gru.inpi.gov.br → 'Entrar com Gov.br'",
    oQueFazer: [
      "Clique em 'Entrar com Gov.br'",
      "Faça login com seu CPF e senha do Gov.br",
      "Autorize o acesso do INPI aos seus dados",
      "Você será redirecionado para a tela de peticionamento",
    ],
    dicaCritica:
      "Se aparecer 'nível insuficiente' ou algo assim, sua conta Gov.br precisa ser PRATA ou OURO. Suba pelo app Meu Gov.br.",
    link: "https://gru.inpi.gov.br/",
    linkLabel: "Abrir sistema de GRU",
    contextoIA:
      "Usuário está fazendo login no sistema de GRU do INPI via Gov.br. Pergunte sobre níveis de conta, problemas de autenticação, ou próximos passos.",
  },
  {
    id: "gru-guia",
    icone: "💰",
    titulo: "Gerar a GRU (R$ 142)",
    onde: "Você está em: peticionamento eletrônico → 'Não possui sua GRU? Gere sua guia aqui'",
    oQueFazer: [
      "Clique em 'Não possui sua GRU? Gere sua guia aqui'",
      "Na tela seguinte, escolha o serviço código 389 (Pedido de Registro de Marca - Eletrônico)",
      "Selecione 'Pessoa Física com redução' (taxa reduzida)",
      "Preencha os dados solicitados",
      "Gere o boleto GRU em PDF e guarde o 'Nosso Número'",
    ],
    camposPreenchidos: [
      { label: "Código do serviço", valor: "389" },
      { label: "Categoria", valor: "Pessoa Física" },
      { label: "Valor", valor: "R$ 142,00" },
      { label: "CPF", valor: "047.547.649-27" },
    ],
    dicaCritica:
      "ATENÇÃO: o valor R$ 142 é para PF com redução. Se aparecer R$ 355, você selecionou a categoria errada — volte e mude para 'com redução'.",
    link: "https://gru.inpi.gov.br/peticionamentoeletronico/gru",
    linkLabel: "Gerar GRU agora",
    contextoIA:
      "Usuário está gerando a GRU (boleto) para pagar a taxa de registro de marca. Código do serviço: 389. Categoria correta para PF: 'Pessoa Física com redução' = R$ 142. Sem redução = R$ 355.",
  },
  {
    id: "pagar",
    icone: "🏦",
    titulo: "Pagar o boleto da GRU",
    onde: "No seu banco (app, internet banking ou caixa)",
    oQueFazer: [
      "Abra o app do seu banco",
      "Vá em 'Pagar boleto'",
      "Escaneie o QR code ou digite o código de barras da GRU",
      "Confirme o valor (R$ 142,00) e pague",
      "Guarde o comprovante de pagamento",
    ],
    dicaCritica:
      "Aguarde 1 a 2 dias úteis para o pagamento aparecer como 'confirmado' no sistema do INPI. Só depois disso dá para depositar o pedido.",
    link: "",
    linkLabel: "",
    contextoIA:
      "Usuário está pagando o boleto GRU pelo banco. Aguardar 1-2 dias úteis para o sistema do INPI reconhecer o pagamento.",
  },
  {
    id: "emarcas-login",
    icone: "📝",
    titulo: "Entrar no e-Marcas",
    onde: "Você está em: gov.br/inpi/marcas → 'Peticionamento Eletrônico de Marca'",
    oQueFazer: [
      "Clique em 'Acessar o e-Marcas'",
      "Faça login com Gov.br (mesmo do passo 1)",
      "Na tela inicial, clique em 'Novo Pedido de Registro de Marca'",
      "Informe o número da GRU paga (Nosso Número) quando pedir",
    ],
    dicaCritica:
      "Se o sistema disser 'GRU não localizada' ou 'não paga', espere mais 24h. O INPI só reconhece o pagamento depois da compensação bancária.",
    link: "https://www.gov.br/inpi/pt-br/servicos/marcas/peticionamento-eletronico-de-marca",
    linkLabel: "Abrir e-Marcas",
    contextoIA:
      "Usuário está entrando no e-Marcas para depositar o pedido de registro. Precisa ter a GRU paga e reconhecida pelo sistema (1-2 dias úteis após pagamento).",
  },
  {
    id: "emarcas-formulario",
    icone: "📋",
    titulo: "Preencher o formulário do pedido",
    onde: "Você está em: e-Marcas → Novo Pedido",
    oQueFazer: [
      "Dados do depositante: use seu CPF 047.547.649-27 e seu e-mail",
      "Apresentação: selecione 'Mista' (nome + logo)",
      "Nome da marca: digite 'MilkyPot' exatamente",
      "Classificação Nice: selecione classe 43",
      "Especificação dos serviços: use o texto abaixo (copiar e colar)",
      "Faça upload do logo em JPG",
      "Revise tudo e envie",
    ],
    camposPreenchidos: [
      { label: "Nome da marca", valor: "MilkyPot" },
      { label: "Apresentação", valor: "Mista (nome + logo)" },
      { label: "Classe Nice (NCL)", valor: "43" },
      {
        label: "Especificação dos serviços",
        valor:
          "Sorveteria; lanchonete; serviços de fornecimento de sorvetes, açaí e milkshakes; serviços de café; serviços de bares e lanchonetes",
      },
      { label: "Formato do logo", valor: "JPG, fundo branco, 100x100 a 945x945 px, máx 2MB" },
    ],
    dicaCritica:
      "REVISE TUDO antes de enviar. Depois de enviado, qualquer correção vira 'exigência' e pode atrasar ou até impedir o registro.",
    link: "",
    linkLabel: "",
    contextoIA:
      "Usuário está preenchendo o formulário do e-Marcas. Marca MilkyPot, mista, classe 43, sorveteria/açaiteria/milkshake. Logo em JPG fundo branco, 100x100 a 945x945px, máx 2MB.",
  },
  {
    id: "acompanhar",
    icone: "🔔",
    titulo: "Acompanhar seu processo",
    onde: "Você está em: Revista da Propriedade Industrial (RPI)",
    oQueFazer: [
      "Anote o número do processo que aparece depois de enviar o pedido",
      "Toda terça-feira, acesse a RPI do INPI",
      "Procure pelo seu número de processo",
      "Se aparecer 'publicação para oposição': ninguém pode contestar por 60 dias",
      "Depois do prazo de oposição sem problemas: aguarde o exame de mérito",
      "Se aparecer 'exigência': você tem 60 dias para responder",
    ],
    dicaCritica:
      "Ative alertas de e-mail no e-INPI. Se perder um prazo, o pedido pode ser arquivado e você perde a taxa.",
    link: "https://revistas.inpi.gov.br/rpi/",
    linkLabel: "Abrir Revista RPI",
    contextoIA:
      "Usuário está acompanhando o processo na RPI. Prazos críticos: 60 dias para responder exigência ou oposição. Processo completo: 6-12 meses em média.",
  },
]

const STORAGE_KEY = "registrar-certo:guia-inpi:progresso"

export function GuiaINPI() {
  const [etapaAtual, setEtapaAtual] = useState(0)
  const [feitas, setFeitas] = useState<Set<string>>(new Set())

  // Carrega progresso salvo
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setEtapaAtual(parsed.etapaAtual ?? 0)
        setFeitas(new Set(parsed.feitas ?? []))
      }
    } catch {
      // ignora
    }
  }, [])

  // Salva progresso
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ etapaAtual, feitas: Array.from(feitas) })
    )
  }, [etapaAtual, feitas])

  const etapa = ETAPAS[etapaAtual]
  const marcarFeita = (id: string) => {
    const novo = new Set(feitas)
    novo.add(id)
    setFeitas(novo)
  }

  const copiar = (texto: string) => {
    navigator.clipboard.writeText(texto)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Progresso das etapas */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Guia interativo do INPI
          </h1>
          <span className="text-sm font-medium text-gray-500">
            {etapaAtual + 1}/{ETAPAS.length}
          </span>
        </div>
        <p className="text-gray-600">
          Vou te guiar pelo sistema do INPI, tela por tela. Avance aqui conforme for fazendo lá.
        </p>

        <div className="mt-6 grid grid-cols-6 gap-2">
          {ETAPAS.map((e, idx) => (
            <button
              key={e.id}
              onClick={() => setEtapaAtual(idx)}
              className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-xs transition-all ${
                idx === etapaAtual
                  ? "border-blue-600 bg-blue-50"
                  : feitas.has(e.id)
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="text-lg">{feitas.has(e.id) ? "✅" : e.icone}</span>
              <span className="font-semibold text-gray-700">{idx + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Etapa atual */}
      <div className="rounded-2xl border-2 border-blue-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{etapa.icone}</span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{etapa.titulo}</h2>
            <div className="mt-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 inline-block">
              📍 {etapa.onde}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 font-semibold text-gray-900">📝 O que fazer nessa tela:</h3>
          <ol className="space-y-2">
            {etapa.oQueFazer.map((p, i) => (
              <li key={i} className="flex gap-3 rounded-lg bg-gray-50 p-3 text-gray-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  {i + 1}
                </span>
                <span className="flex-1">{p}</span>
              </li>
            ))}
          </ol>
        </div>

        {etapa.camposPreenchidos && (
          <div className="mt-6">
            <h3 className="mb-3 font-semibold text-gray-900">
              ✨ Copie e cole esses valores:
            </h3>
            <div className="space-y-2">
              {etapa.camposPreenchidos.map((c, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border-2 border-blue-100 bg-blue-50 p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-blue-700">{c.label}</div>
                    <div className="mt-0.5 break-words font-mono text-sm text-gray-900">
                      {c.valor}
                    </div>
                  </div>
                  <button
                    onClick={() => copiar(c.valor)}
                    className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    📋 Copiar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <div className="font-semibold text-amber-900">Atenção</div>
              <div className="mt-1 text-sm text-amber-800">{etapa.dicaCritica}</div>
            </div>
          </div>
        </div>

        {etapa.link && (
          <a
            href={etapa.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {etapa.linkLabel} ↗
          </a>
        )}

        {/* Navegação */}
        <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-100 pt-6">
          {etapaAtual > 0 && (
            <button
              onClick={() => setEtapaAtual(etapaAtual - 1)}
              className="rounded-xl border-2 border-gray-200 px-5 py-2.5 font-semibold text-gray-700 hover:border-gray-300"
            >
              ← Anterior
            </button>
          )}
          <button
            onClick={() => {
              marcarFeita(etapa.id)
              if (etapaAtual < ETAPAS.length - 1) setEtapaAtual(etapaAtual + 1)
            }}
            className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            {feitas.has(etapa.id) ? "✅ Já fiz — " : ""}
            {etapaAtual < ETAPAS.length - 1 ? "Próxima etapa →" : "Finalizar guia"}
          </button>
        </div>
      </div>

      {/* Chat com contexto da etapa atual */}
      <ChatIA
        contexto={etapa.contextoIA}
        mensagemInicial={`Estou na etapa "${etapa.titulo}". Posso te ajudar com algo nessa tela?`}
        sugestoes={[
          `O que significa "${etapa.titulo}"?`,
          "E se der erro nessa tela?",
          "Próximo passo?",
          "Posso pular essa etapa?",
        ]}
      />
    </div>
  )
}
