import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Registrar Certo | Guia completo para registro no INPI",
  description:
    "Descubra o jeito certo de registrar sua marca, invenção ou visual de produto no INPI. Sem confusão, sem juridiquês pesado, com passo a passo simples e claro.",
  keywords: [
    "registro de marca",
    "INPI",
    "patente",
    "desenho industrial",
    "propriedade intelectual",
    "registro de marca no INPI",
  ],
  openGraph: {
    title: "Registrar Certo | Guia completo para registro no INPI",
    description:
      "Descubra o jeito certo de registrar sua marca, invenção ou visual de produto no INPI.",
    locale: "pt_BR",
    type: "website",
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
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
