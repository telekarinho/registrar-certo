import Link from "next/link";

const faqItems = [
  {
    question: "O que o Registrar Certo faz?",
    answer: "O Registrar Certo é um guia gratuito passo a passo para registrar sua marca, patente ou desenho industrial no INPI. Não somos escritório de advocacia — somos uma ferramenta educacional.",
  },
  {
    question: "Preciso pagar para usar o Registrar Certo?",
    answer: "Não! O guia é totalmente gratuito. As únicas taxas que você vai pagar são as do próprio INPI (GRU), que são obrigatórias para qualquer pedido de registro.",
  },
  {
    question: "Vocês fazem o registro para mim?",
    answer: "Não. O Registrar Certo orienta você a fazer o registro por conta própria no site do INPI. Se preferir contratar um profissional, recomendamos buscar um advogado especializado em Propriedade Intelectual.",
  },
  {
    question: "Qual a diferença entre marca, patente e desenho industrial?",
    answer: "Marca protege nomes, logos e slogans. Patente protege invenções técnicas. Desenho Industrial protege a aparência/forma de um produto. Use nossa triagem para descobrir qual é o certo para você.",
  },
  {
    question: "Quanto tempo demora o registro de marca?",
    answer: "O INPI leva em média 6 a 12 meses para analisar um pedido de marca. Pode ser mais rápido ou demorar mais dependendo de exigências e oposições.",
  },
  {
    question: "E se minha marca for recusada?",
    answer: "Você pode recorrer da decisão dentro do prazo legal (60 dias). O Registrar Certo vai te ajudar a entender os motivos e as opções disponíveis.",
  },
  {
    question: "Preciso de advogado para registrar marca?",
    answer: "Não é obrigatório. Pessoas físicas e jurídicas podem fazer o registro diretamente no INPI. Porém, um advogado pode ajudar em casos complexos.",
  },
  {
    question: "O registro vale em outros países?",
    answer: "Não. O registro no INPI vale apenas no Brasil. Para proteção internacional, é necessário fazer pedidos em cada país ou usar o Protocolo de Madri.",
  },
];

export default function AjudaPage() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Central de Ajuda</h1>
          <p className="mt-4 text-lg text-gray-600">
            Perguntas frequentes sobre o Registrar Certo e sobre registro de propriedade intelectual no INPI.
          </p>
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-gray-200 bg-white transition-all open:shadow-md"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-left font-medium text-gray-900 hover:text-blue-600 [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <svg
                  className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="border-t border-gray-100 px-6 pb-5 pt-4 text-sm leading-relaxed text-gray-600">
                {item.answer}
              </div>
            </details>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900">Não encontrou o que procurava?</h2>
          <p className="mt-2 text-gray-600">
            Entre em contato conosco e teremos prazer em ajudar.
          </p>
          <a
            href="mailto:contato@registrarcerto.com.br"
            className="mt-4 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Enviar e-mail
          </a>
        </div>

        {/* Useful Links */}
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Links úteis</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Site oficial do INPI", href: "https://www.gov.br/inpi", desc: "Portal do Instituto Nacional da Propriedade Industrial" },
              { label: "e-INPI (sistema eletrônico)", href: "https://www.gov.br/inpi/pt-br/servicos/sistemas/e-inpi", desc: "Sistema para protocolar pedidos" },
              { label: "Busca de marcas", href: "https://busca.inpi.gov.br/pePI/", desc: "Pesquise marcas já registradas" },
              { label: "Tabela de taxas", href: "https://www.gov.br/inpi/pt-br/servicos/tabelas-de-retribuicao", desc: "Valores atualizados das GRUs" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow"
              >
                <div className="font-medium text-blue-600">{link.label} ↗</div>
                <div className="mt-1 text-sm text-gray-500">{link.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
