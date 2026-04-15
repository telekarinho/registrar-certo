"use client"

import { useState } from "react"
import { NICE_CLASSES } from "@/lib/nice-classes"

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

interface Props {
  data: RegistroData
  onVoltar: () => void
}

export function PacoteRegistro({ data, onVoltar }: Props) {
  const [tarefasFeitas, setTarefasFeitas] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`registrar-certo:tarefas:${data.nomeMarca}`)
      if (saved) try { return new Set(JSON.parse(saved)) } catch {}
    }
    return new Set()
  })

  const toggleTarefa = (id: string) => {
    const novo = new Set(tarefasFeitas)
    if (novo.has(id)) novo.delete(id)
    else novo.add(id)
    setTarefasFeitas(novo)
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `registrar-certo:tarefas:${data.nomeMarca}`,
        JSON.stringify(Array.from(novo))
      )
    }
  }

  // Calcula valor total da GRU
  const valorPorClasse = data.pessoa === "PJ" ? 355 : 142
  const valorTotal = valorPorClasse * data.classesEscolhidas.length

  // Define URL de busca prévia pré-preenchida
  const urlBuscaINPI = `https://busca.inpi.gov.br/pePI/jsp/marcas/Pesquisa_classe_basica.jsp`

  // Etapas do pacote
  const etapas = [
    {
      id: "busca",
      numero: 1,
      titulo: "Pesquisar se sua marca já existe",
      tempo: "15 minutos",
      descricao: `Verifique se já existe alguma marca igual ou parecida com "${data.nomeMarca}" registrada nas classes ${data.classesEscolhidas.join(", ")}.`,
      acao: "Abrir busca do INPI",
      url: urlBuscaINPI,
      dica: `Pesquise por "${data.nomeMarca}" e variações como "${data.nomeMarca.toLowerCase()}", "${data.nomeMarca.toUpperCase()}".`,
    },
    {
      id: "govbr",
      numero: 2,
      titulo: "Criar conta Gov.br nível PRATA ou OURO",
      tempo: "10 minutos",
      descricao:
        "Você precisa de conta Gov.br PRATA ou OURO (a BRONZE não funciona no INPI). Se já tem, pule essa etapa.",
      acao: "Acessar Gov.br",
      url: "https://www.gov.br/governodigital/pt-br/conta-gov-br",
      dica: "Use o app Meu Gov.br para subir de nível através do Banco do Brasil, Caixa, ou validação facial.",
    },
    {
      id: "einpi",
      numero: 3,
      titulo: "Cadastrar-se no e-INPI",
      tempo: "10 minutos",
      descricao: `Crie sua conta no sistema e-INPI usando seu Gov.br. Use o ${data.pessoa === "PF" ? "CPF" : "CNPJ"} ${data.documento} e o e-mail ${data.emailContato}.`,
      acao: "Acessar e-INPI",
      url: "https://gru.inpi.gov.br/peticionamentoeletronico/",
      dica: "Guarde bem o login e senha — você vai usar várias vezes.",
    },
    {
      id: "gru",
      numero: 4,
      titulo: "Emitir GRU para cada classe",
      tempo: "5 min por classe",
      descricao: `Você precisa de ${data.classesEscolhidas.length} GRU(s), uma para cada classe.`,
      acao: "Emitir GRU",
      url: "https://gru.inpi.gov.br/",
      dica: `Código do serviço: 389 (pedido de marca eletrônico). Valor: R$ ${valorPorClasse} por classe.`,
      detalhes: data.classesEscolhidas.map((c) => `GRU 389 — Classe ${c} — R$ ${valorPorClasse}`),
    },
    {
      id: "pagar",
      numero: 5,
      titulo: `Pagar a GRU (R$ ${valorTotal.toFixed(2).replace(".", ",")} no total)`,
      tempo: "Depende do banco",
      descricao: "Pague a(s) GRU(s) pelo seu banco (transferência, internet banking ou caixa).",
      acao: "Ver instruções de pagamento",
      url: "https://www.gov.br/inpi/pt-br/servicos/marcas/arquivos/legislacao/Resolucao_PR_n_265-2021_e_Anexo_I.pdf",
      dica: "Aguarde 1 a 2 dias úteis para o pagamento aparecer no sistema do INPI.",
    },
    {
      id: "logo",
      numero: 6,
      titulo: "Preparar o arquivo do logo (se for marca mista ou figurativa)",
      tempo: "30 minutos",
      descricao:
        data.tipoMarca === "nominativa"
          ? "Sua marca é só nome — não precisa de logo. Pode pular essa etapa."
          : "Prepare o logo em formato JPG, fundo branco, dimensões mínimas 100x100 e máximas 945x945 pixels, máximo 2MB.",
      acao: "Ver guia de imagem",
      url: "https://manualdemarcas.inpi.gov.br/projects/manual/wiki/05_Pedido_de_registro#52-imagem-da-marca",
      dica: "Se não tem logo profissional, considere pagar um designer no Fiverr ou 99designs.",
      pular: data.tipoMarca === "nominativa",
    },
    {
      id: "depositar",
      numero: 7,
      titulo: "Depositar o pedido no e-Marcas",
      tempo: "20 minutos por classe",
      descricao: `Acesse o e-Marcas, faça login com seu Gov.br, e preencha um pedido para cada classe (${data.classesEscolhidas.length} pedido(s) no total).`,
      acao: "Acessar e-Marcas",
      url: "https://www.gov.br/inpi/pt-br/servicos/marcas/peticionamento-eletronico-de-marca",
      dica: "Tenha o número da GRU paga em mãos. Use a especificação padrão do INPI quando possível.",
    },
    {
      id: "acompanhar",
      numero: 8,
      titulo: "Acompanhar o processo na Revista da PI (RPI)",
      tempo: "5 min/semana",
      descricao:
        "Toda terça-feira sai a RPI com decisões. Acompanhe seu processo para saber se houve oposição ou exigência.",
      acao: "Acessar RPI",
      url: "https://revistas.inpi.gov.br/rpi/",
      dica:
        "Ative alertas de e-mail no e-INPI para receber notificações automáticas sobre seu processo.",
    },
  ].filter((e) => !e.pular)

  const totalEtapas = etapas.length
  const etapasFeitas = etapas.filter((e) => tarefasFeitas.has(e.id)).length
  const progresso = Math.round((etapasFeitas / totalEtapas) * 100)

  const baixarResumo = () => {
    const conteudo = gerarResumoTexto(data, etapas, valorPorClasse, valorTotal)
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `registro-${data.nomeMarca.toLowerCase().replace(/\s+/g, "-")}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const imprimir = () => window.print()

  return (
    <div className="space-y-6">
      {/* Header com nome da marca */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-blue-100">Pacote de Registro</div>
            <h2 className="mt-1 text-3xl font-bold">{data.nomeMarca}</h2>
            <p className="mt-1 text-blue-100">
              {data.classesEscolhidas.length} classe(s) ·{" "}
              {data.tipoMarca === "mista"
                ? "Marca mista"
                : data.tipoMarca === "nominativa"
                ? "Marca nominativa"
                : "Marca figurativa"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-blue-100">Total da GRU</div>
            <div className="text-3xl font-bold">R$ {valorTotal.toFixed(2).replace(".", ",")}</div>
          </div>
        </div>

        {/* Progresso */}
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm">
            <span>Progresso: {etapasFeitas} de {totalEtapas} etapas</span>
            <span className="font-bold">{progresso}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-blue-900/40">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={baixarResumo}
          className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 hover:border-gray-300"
        >
          📥 Baixar resumo (.txt)
        </button>
        <button
          onClick={imprimir}
          className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 hover:border-gray-300"
        >
          🖨️ Imprimir
        </button>
        <button
          onClick={onVoltar}
          className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 hover:border-gray-300"
        >
          ← Editar dados
        </button>
      </div>

      {/* Resumo dos dados */}
      <div className="rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-3 font-bold text-gray-900">📋 Seus dados (já preenchidos)</h3>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div><strong>Marca:</strong> {data.nomeMarca}</div>
          <div><strong>Titular:</strong> {data.razaoSocial || data.pessoa}</div>
          <div><strong>{data.pessoa === "PF" ? "CPF" : "CNPJ"}:</strong> {data.documento}</div>
          <div><strong>E-mail:</strong> {data.emailContato}</div>
          <div className="sm:col-span-2">
            <strong>Classes Nice:</strong>{" "}
            {data.classesEscolhidas.map((c) => (
              <span key={c} className="ml-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {c} - {NICE_CLASSES.find(n => n.number === c)?.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Etapas */}
      <div>
        <h3 className="mb-4 text-xl font-bold text-gray-900">
          🎯 Faça uma etapa por vez:
        </h3>
        <div className="space-y-3">
          {etapas.map((etapa) => {
            const feita = tarefasFeitas.has(etapa.id)
            return (
              <div
                key={etapa.id}
                className={`rounded-xl border-2 transition-all ${
                  feita
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTarefa(etapa.id)}
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                        feita
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-gray-300 text-gray-500 hover:border-blue-500"
                      }`}
                    >
                      {feita ? "✓" : etapa.numero}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h4 className={`text-lg font-bold ${feita ? "text-emerald-700 line-through decoration-2" : "text-gray-900"}`}>
                          {etapa.titulo}
                        </h4>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          ⏱ {etapa.tempo}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700">{etapa.descricao}</p>

                      {etapa.detalhes && (
                        <ul className="mt-3 space-y-1 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                          {etapa.detalhes.map((d, i) => (
                            <li key={i}>• {d}</li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                        💡 <strong>Dica:</strong> {etapa.dica}
                      </div>

                      <a
                        href={etapa.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                      >
                        {etapa.acao} ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Disclaimer final */}
      <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <strong>⚠️ Lembre-se:</strong> Este guia é educativo. O Registrar Certo NÃO faz o
        registro por você. Todo pagamento e envio é feito diretamente nos sistemas oficiais
        do INPI (gov.br/inpi). Para casos complexos ou se houver oposição, considere
        contratar um agente da propriedade industrial.
      </div>
    </div>
  )
}

function gerarResumoTexto(
  data: RegistroData,
  etapas: { numero: number; titulo: string; descricao: string; url: string; dica: string }[],
  valorPorClasse: number,
  valorTotal: number
): string {
  const linhas: string[] = []
  linhas.push(`==============================================`)
  linhas.push(`PACOTE DE REGISTRO DE MARCA — ${data.nomeMarca}`)
  linhas.push(`==============================================`)
  linhas.push("")
  linhas.push(`DADOS DO TITULAR`)
  linhas.push(`Marca: ${data.nomeMarca}`)
  linhas.push(`Tipo: ${data.tipoMarca}`)
  linhas.push(`Pessoa: ${data.pessoa}`)
  linhas.push(`Documento: ${data.documento}`)
  if (data.razaoSocial) linhas.push(`Razão social: ${data.razaoSocial}`)
  linhas.push(`E-mail: ${data.emailContato}`)
  linhas.push(`Classes Nice: ${data.classesEscolhidas.join(", ")}`)
  linhas.push("")
  linhas.push(`CUSTOS`)
  linhas.push(`R$ ${valorPorClasse} por classe × ${data.classesEscolhidas.length} classe(s) = R$ ${valorTotal}`)
  linhas.push("")
  linhas.push(`PASSO A PASSO`)
  linhas.push("")

  for (const etapa of etapas) {
    linhas.push(`-----`)
    linhas.push(`PASSO ${etapa.numero}: ${etapa.titulo}`)
    linhas.push(etapa.descricao)
    linhas.push(`Link: ${etapa.url}`)
    linhas.push(`Dica: ${etapa.dica}`)
    linhas.push("")
  }

  linhas.push(`==============================================`)
  linhas.push(`Gerado por Registrar Certo — registrar-certo.vercel.app`)
  linhas.push(`Este é um guia educativo. NÃO somos o INPI.`)
  linhas.push(`==============================================`)

  return linhas.join("\n")
}
