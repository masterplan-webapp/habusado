import type { Metadata } from "next";
import { PrivateJournal } from "@/components/journal/PrivateJournal";

export const metadata: Metadata = {
  title: "Diário Privado de Episódios",
  description:
    "Espaço 100% local no navegador para registrar fatos objetivos com data e hora, sem enviar nenhum dado para servidores.",
};

export default function DiarioPage() {
  return (
    <div className="bg-[#021729] py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl border-b border-[#1E3A52] pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2DD4BF]">
            Ferramenta local de clareza
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Diário Privado de Episódios
          </h1>
          <p className="mt-4 text-base leading-[1.7] text-[#CBD5E1]">
            Quando discussões e distorções se repetem, fica difícil confiar na
            própria memória. Use este espaço para anotar fatos concretos com
            data e hora e exportar um arquivo de texto para guardar em segurança
            ou levar à terapia e à orientação jurídica.
          </p>
        </header>

        <PrivateJournal />
      </div>
    </div>
  );
}
