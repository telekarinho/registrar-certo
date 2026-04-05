import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Registrar Certo | Guia educativo sobre propriedade industrial",
  description:
    "Guia educativo independente sobre registro de marcas, patentes e desenhos industriais. Este site NÃO é do governo e NÃO representa o INPI. Conteúdo apenas informativo.",
  keywords: [
    "guia registro de marca",
    "como registrar patente",
    "desenho industrial",
    "propriedade industrial guia",
  ],
  openGraph: {
    title: "Registrar Certo | Guia educativo independente",
    description:
      "Guia educativo independente sobre propriedade industrial. NÃO é site do governo.",
    locale: "pt_BR",
    type: "website",
    siteName: "Registrar Certo - Guia Educativo",
  },
  other: {
    "classification": "Educational",
    "category": "Education",
    "rating": "General",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          {/* Banner de disclaimer - NÃO é site governamental */}
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-800">
            <strong>Aviso:</strong> Este é um guia educativo independente. Não somos o INPI e não representamos nenhum órgão do governo.{" "}
            <a href="https://www.gov.br/inpi" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-amber-900">
              Site oficial do INPI →
            </a>
          </div>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
