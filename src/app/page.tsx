import Link from "next/link";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "Marca",
    description:
      "Proteja o nome, logo ou identidade visual do seu negócio. Garanta exclusividade no mercado.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 6h.008v.008H6V6z"
        />
      </svg>
    ),
    href: "/marca",
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Patente",
    description:
      "Registre sua invenção ou melhoria técnica. Proteja a inovação por até 20 anos.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
        />
      </svg>
    ),
    href: "/patente",
    color: "text-amber-600 bg-amber-50",
  },
  {
    title: "Desenho Industrial",
    description:
      "Proteja a aparência visual e o formato único do seu produto. Design é patrimônio.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
        />
      </svg>
    ),
    href: "/desenho-industrial",
    color: "text-emerald-600 bg-emerald-50",
  },
];

const steps = [
  {
    number: "01",
    title: "Faça a triagem",
    description:
      "Responda algumas perguntas simples e descubra qual tipo de proteção você precisa.",
  },
  {
    number: "02",
    title: "Siga o passo a passo",
    description:
      "Receba um roteiro personalizado com tudo o que precisa fazer, na ordem certa.",
  },
  {
    number: "03",
    title: "Prepare seus documentos",
    description:
      "Use nossos checklists para reunir tudo antes de dar entrada no pedido.",
  },
  {
    number: "04",
    title: "Registre no INPI",
    description:
      "Acesse o sistema oficial do INPI com confiança e finalize seu registro.",
  },
];

const faqs = [
  {
    question: "Preciso de um advogado para registrar minha marca?",
    answer:
      "Não obrigatoriamente. Pessoas físicas e jurídicas podem fazer o pedido diretamente no INPI. Nosso guia ajuda você em cada etapa.",
  },
  {
    question: "Quanto custa registrar uma marca no INPI?",
    answer:
      "As taxas do INPI variam. Pessoas físicas, MEIs e microempresas podem ter descontos de até 60%. Detalhamos todos os valores no passo a passo.",
  },
  {
    question: "Quanto tempo leva o processo de registro?",
    answer:
      "O processo de registro de marca no INPI pode levar de 6 a 12 meses em média. Patentes podem levar mais tempo. Explicamos cada fase no guia.",
  },
  {
    question: "Este site faz o registro para mim?",
    answer:
      "Não. Somos um guia educativo e operacional. O pedido oficial é feito nos sistemas do INPI. Nós te preparamos para fazer isso com segurança.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            Guia educativo independente — não somos o INPI
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Descubra o jeito certo de registrar sua marca, invenção ou visual de
            produto no INPI
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            Sem confusão. Sem juridiquês pesado. Com passo a passo simples e
            claro.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/ia"
              className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              🤖 Registrar com IA (5 perguntas)
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <Link
              href="/assistente"
              className="inline-flex w-full items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              🤖 Assistente IA Guiado
            </Link>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              O que você quer proteger?
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Escolha a categoria que mais se encaixa no seu caso
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
              >
                <div
                  className={cn(
                    "inline-flex rounded-xl p-3",
                    cat.color
                  )}
                >
                  {cat.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                  {cat.title}
                </h3>
                <p className="mt-2 leading-relaxed text-gray-600">
                  {cat.description}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Ver passo a passo
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Como funciona
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Quatro passos simples para proteger o que é seu
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative text-center lg:text-left">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white lg:mx-0">
                  {step.number}
                </div>
                {idx < steps.length - 1 && (
                  <div className="absolute left-1/2 top-7 hidden h-0.5 w-full -translate-x-0 bg-blue-200 lg:block" style={{ left: "calc(50% + 28px)", width: "calc(100% - 56px)" }} />
                )}
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Social Proof */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Confiado por empreendedores em todo o Brasil
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Milhares de pessoas já usaram nossos guias para proteger suas marcas
            e invenções
          </p>
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "5.000+", label: "Triagens realizadas" },
              { value: "98%", label: "Taxa de satisfação" },
              { value: "1.200+", label: "Registros orientados" },
              { value: "4.9/5", label: "Nota dos usuários" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-blue-600">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Perguntas frequentes
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Tire suas dúvidas antes de começar
            </p>
          </div>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-gray-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-left font-medium text-gray-900 hover:text-blue-600">
                  {faq.question}
                  <svg
                    className="ml-4 h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-gray-600">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Blog
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                Dicas e novidades sobre propriedade intelectual
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden text-sm font-medium text-blue-600 hover:text-blue-700 sm:inline-flex sm:items-center"
            >
              Ver todos
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "5 erros que atrasam o registro da sua marca no INPI",
                excerpt:
                  "Evite os problemas mais comuns que fazem empreendedores perderem tempo e dinheiro.",
                category: "Marca",
              },
              {
                title: "Patente de invenção vs. modelo de utilidade: qual a diferença?",
                excerpt:
                  "Entenda as diferenças e saiba qual tipo de patente se aplica ao seu caso.",
                category: "Patente",
              },
              {
                title: "O que é desenho industrial e quando você precisa registrar",
                excerpt:
                  "Descubra se o visual do seu produto pode e deve ser protegido no INPI.",
                category: "Desenho Industrial",
              },
            ].map((post) => (
              <article
                key={post.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
              >
                <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {post.category}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-blue-600">
                  Ler artigo
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="border-t border-gray-200 bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <h3 className="text-lg font-semibold text-amber-900">Aviso Importante</h3>
          <p className="mt-2 text-sm leading-relaxed text-amber-800">
            O <strong>Registrar Certo</strong> é um <strong>guia educativo independente</strong>.
            Não somos o INPI, não representamos nenhum órgão do governo e não realizamos registros.
            Todo pedido oficial deve ser feito diretamente nos{" "}
            <a href="https://www.gov.br/inpi" target="_blank" rel="noopener noreferrer" className="underline font-medium">
              sistemas oficiais do INPI (gov.br/inpi)
            </a>.
            Este conteúdo é apenas informativo e educacional.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-blue-600 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Fique por dentro das novidades
          </h2>
          <p className="mt-3 text-lg text-blue-100">
            Receba dicas, atualizações do INPI e novos guias direto no seu
            e-mail.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              required
              className="w-full rounded-xl border-0 bg-white/10 px-5 py-4 text-white placeholder-blue-200 backdrop-blur focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:max-w-sm"
            />
            <button
              type="submit"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
            >
              Inscrever-se
            </button>
          </form>
          <p className="mt-4 text-sm text-blue-200">
            Sem spam. Cancele quando quiser.
          </p>
        </div>
      </section>
    </div>
  );
}
