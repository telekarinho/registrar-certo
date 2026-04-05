import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre o Registrar Certo | Guia Educativo Independente",
  description:
    "O Registrar Certo é um guia educativo independente sobre propriedade industrial. NÃO somos o INPI e NÃO representamos nenhum órgão do governo.",
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Sobre o Registrar Certo</h1>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-6">
          <h2 className="text-lg font-bold text-amber-900">Aviso Fundamental</h2>
          <p className="mt-2 text-amber-800">
            O <strong>Registrar Certo</strong> é um <strong>guia educativo independente</strong>.
            <strong> NÃO somos o INPI</strong>, NÃO representamos nenhum órgão do governo brasileiro
            e NÃO realizamos registros de marca, patente ou desenho industrial.
          </p>
          <p className="mt-2 text-amber-800">
            Para realizar qualquer registro oficial, acesse diretamente o site do INPI:{" "}
            <a
              href="https://www.gov.br/inpi"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline"
            >
              www.gov.br/inpi
            </a>
          </p>
        </div>

        <h2 className="text-xl font-semibold text-gray-900">O que somos</h2>
        <p>
          Somos um projeto educacional que nasceu para simplificar o acesso à informação sobre
          propriedade industrial no Brasil. Nosso objetivo é ajudar empreendedores, inventores
          e designers a entenderem os processos de registro de marcas, patentes e desenhos
          industriais de forma clara e sem complicação.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">O que fazemos</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Explicamos a diferença entre marca, patente e desenho industrial</li>
          <li>Oferecemos um passo a passo educativo sobre cada tipo de registro</li>
          <li>Traduzimos termos técnicos e jurídicos para linguagem simples</li>
          <li>Fornecemos links para os sistemas oficiais do INPI</li>
          <li>Ajudamos a organizar documentos com checklists educativos</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900">O que NÃO fazemos</h2>
        <ul className="list-disc pl-6 space-y-2 text-red-700">
          <li>NÃO realizamos registros de marca, patente ou desenho industrial</li>
          <li>NÃO cobramos taxas de registro (as taxas são pagas diretamente ao INPI)</li>
          <li>NÃO prestamos assessoria jurídica</li>
          <li>NÃO representamos o INPI ou qualquer órgão governamental</li>
          <li>NÃO garantimos resultado de processos de registro</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900">Site oficial do INPI</h2>
        <p>
          Para acessar os serviços oficiais do INPI (Instituto Nacional da Propriedade Industrial),
          acesse exclusivamente:{" "}
          <a
            href="https://www.gov.br/inpi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold underline"
          >
            www.gov.br/inpi
          </a>
        </p>

        <div className="pt-8 border-t border-gray-200">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
