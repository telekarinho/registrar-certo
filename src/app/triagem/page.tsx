import { TriageWizard } from "@/components/triage/TriageWizard";
import { Disclaimer } from "@/components/ui/Disclaimer";

export const metadata = {
  title: "Triagem Gratuita | RegistrarCerto",
  description:
    "Descubra qual tipo de proteção intelectual você precisa: marca, patente ou desenho industrial. Triagem gratuita em menos de 2 minutos.",
};

export default function TriagemPage() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            Triagem Gratuita
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Descubra o que você precisa registrar
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Responda algumas perguntas simples e descubra qual tipo de proteção
            intelectual é ideal para o seu caso. Leva menos de 2 minutos.
          </p>
        </div>

        {/* Wizard */}
        <TriageWizard />

        {/* Disclaimer */}
        <div className="mt-12">
          <Disclaimer
            variant="info"
            text="Esta triagem é uma orientação inicial gratuita. Para casos complexos, recomendamos consultar um profissional de propriedade intelectual."
          />
        </div>
      </div>
    </div>
  );
}
