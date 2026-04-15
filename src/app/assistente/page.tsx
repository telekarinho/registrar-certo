import type { Metadata } from "next"
import { GuiaINPI } from "@/components/assistente/GuiaINPI"

export const metadata: Metadata = {
  title: "Assistente IA Guiado | Registrar Certo",
  description:
    "Guia interativo passo a passo com assistente de IA para registro de marca no INPI. Cada tela do sistema explicada na hora.",
}

export default function AssistentePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <GuiaINPI />
    </div>
  )
}
