import Link from "next/link";

const articles = [
  {
    slug: "como-registrar-marca-inpi",
    title: "Como registrar uma marca no INPI: guia completo 2025",
    excerpt: "Tudo que você precisa saber para proteger o nome do seu negócio, passo a passo, sem juridiquês.",
    category: "Marca",
    date: "15 Mar 2025",
    readTime: "8 min",
  },
  {
    slug: "diferenca-marca-patente",
    title: "Marca vs. Patente vs. Desenho Industrial: qual a diferença?",
    excerpt: "Entenda de vez qual tipo de proteção é ideal para o que você quer proteger.",
    category: "Conceitos",
    date: "10 Mar 2025",
    readTime: "5 min",
  },
  {
    slug: "classificacao-nice-ncl",
    title: "Classificação Nice (NCL): como escolher a classe certa",
    excerpt: "As 45 classes de Nice explicadas de forma simples, com exemplos práticos para cada uma.",
    category: "Marca",
    date: "05 Mar 2025",
    readTime: "10 min",
  },
  {
    slug: "quanto-custa-registrar-marca",
    title: "Quanto custa registrar uma marca no INPI em 2025?",
    excerpt: "Valores atualizados das taxas, descontos para PF/MEI/ME, e custos extras que ninguém conta.",
    category: "Custos",
    date: "28 Fev 2025",
    readTime: "6 min",
  },
  {
    slug: "pesquisa-anterioridade-marca",
    title: "Pesquisa de anterioridade: como saber se sua marca já existe",
    excerpt: "Tutorial passo a passo para usar o sistema de busca do INPI e evitar conflitos.",
    category: "Marca",
    date: "20 Fev 2025",
    readTime: "7 min",
  },
  {
    slug: "o-que-e-gru-inpi",
    title: "GRU do INPI: o que é, como gerar e como pagar",
    excerpt: "Guia prático sobre a Guia de Recolhimento da União, obrigatória em todos os pedidos no INPI.",
    category: "Processos",
    date: "15 Fev 2025",
    readTime: "4 min",
  },
];

const categoryColors: Record<string, string> = {
  Marca: "bg-blue-100 text-blue-700",
  Conceitos: "bg-purple-100 text-purple-700",
  Custos: "bg-amber-100 text-amber-700",
  Processos: "bg-emerald-100 text-emerald-700",
};

export default function BlogPage() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Blog</h1>
          <p className="mt-4 text-lg text-gray-600">
            Artigos práticos sobre registro de marca, patente e desenho industrial no INPI.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${categoryColors[article.category] ?? "bg-gray-100 text-gray-700"}`}>
                  {article.category}
                </span>
                <span className="text-xs text-gray-400">{article.date}</span>
              </div>
              <h2 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">⏱ {article.readTime} de leitura</span>
                <span className="text-sm font-medium text-blue-600 group-hover:underline">
                  Em breve →
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Quer receber novos artigos?</h2>
          <p className="mt-2 text-blue-100">
            Cadastre-se para receber conteúdo sobre propriedade intelectual direto no seu e-mail.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="rounded-xl px-5 py-3 text-gray-900 placeholder:text-gray-400 sm:w-72"
            />
            <button className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition-colors hover:bg-blue-50">
              Inscrever-se
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
