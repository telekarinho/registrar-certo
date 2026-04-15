import type { Metadata } from "next"
import { ConversaIA } from "@/components/assistente/ConversaIA"

export const metadata: Metadata = {
  title: "Registro de Marca com IA | Registrar Certo",
  description:
    "A IA pergunta só o essencial e gera o pacote pronto do seu registro de marca no INPI. Você só copia e cola.",
}

export default function IAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ConversaIA />
    </div>
  )
}
