import Link from "next/link";

const footerLinks = {
  Produto: [
    { label: "Triagem Gratuita", href: "/triagem" },
    { label: "Registro de Marca", href: "/marca" },
    { label: "Patente", href: "/patente" },
    { label: "Desenho Industrial", href: "/desenho-industrial" },
    { label: "Preços", href: "/precos" },
  ],
  Recursos: [
    { label: "Blog", href: "/blog" },
    { label: "Guias Completos", href: "/guias" },
    { label: "Perguntas Frequentes", href: "/faq" },
    { label: "Glossário", href: "/glossario" },
    { label: "Links Úteis INPI", href: "/links-uteis" },
  ],
  Legal: [
    { label: "Termos de Uso", href: "/termos" },
    { label: "Política de Privacidade", href: "/privacidade" },
    { label: "Política de Cookies", href: "/cookies" },
    { label: "Aviso Legal", href: "/aviso-legal" },
  ],
  Contato: [
    { label: "Fale Conosco", href: "/contato" },
    { label: "Suporte", href: "/suporte" },
    { label: "Parcerias", href: "/parcerias" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      {/* Newsletter Strip */}
      <div className="border-b border-gray-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Receba atualizações do INPI e dicas
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Informação de qualidade direto no seu e-mail.
            </p>
          </div>
          <form className="flex w-full gap-2 sm:w-auto">
            <input
              type="email"
              placeholder="Seu e-mail"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Inscrever
            </button>
          </form>
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                  {title}
                </h4>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <svg
                className="h-5 w-5 shrink-0 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <p className="text-sm leading-relaxed text-amber-800">
                <strong>Aviso importante:</strong> Este site é um guia educativo
                e operacional. Não somos escritório de advocacia nem
                representantes do INPI. O pedido oficial de registro é feito
                diretamente nos sistemas do INPI. As informações aqui
                apresentadas são de caráter orientativo e não substituem
                consultoria jurídica especializada.
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">
                RegistrarCerto
              </span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} RegistrarCerto. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
