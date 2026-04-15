import type { Metadata } from "next"
import { ComecarWizard } from "@/components/comecar/ComecarWizard"

export const metadata: Metadata = {
  title: "Comece seu registro de marca | Registrar Certo",
  description:
    "Wizard prático que monta o pacote completo do seu registro de marca. Funciona até para quem nunca registrou nada na vida.",
}

export default function ComecarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Vamos preparar tudo? 🚀
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Em 4 perguntas, montamos o pacote completo do seu registro de marca.
            <br />
            <span className="font-medium text-blue-600">Você só vai precisar pagar a GRU no final.</span>
          </p>
        </div>
        <ComecarWizard />
      </div>
    </div>
  )
}
