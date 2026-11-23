import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, HeartHandshake } from "lucide-react";
import { HaroldoChat } from "@/components/haroldo/HaroldoChat";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "H.Aroldo, Conversa Sigilosa",
  description:
    "Converse com o H.Aroldo em modo efêmero e sigiloso para organizar pensamentos, reconhecer sinais de abuso emocional e encontrar próximos passos.",
};

interface HaroldoPageProps {
  searchParams: Promise<{ context?: string }>;
}

export default async function HaroldoPage({ searchParams }: HaroldoPageProps) {
  const params = await searchParams;
  const initialContext =
    typeof params.context === "string" ? params.context : undefined;

  return (
    <div className="bg-[#021729] py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2DD4BF]">
            Apoio confidencial
          </p>
          <h1 className="text-white">Converse com o H.Aroldo</h1>
          <p className="max-w-2xl text-base leading-relaxed text-[#CBD5E1]">
            Um espaço de escuta calma para colocar em palavras o que você está
            vivendo. Sem cadastro, sem julgamento e com opção de apagar tudo em
            um clique.
          </p>
        </header>

        <HaroldoChat initialContext={initialContext} />

        <section
          aria-label="Como funciona a privacidade no H.Aroldo"
          className="mt-10 grid gap-4 md:grid-cols-3"
        >
          <Card className="p-5">
            <Lock
              className="mb-3 h-5 w-5 text-[#2DD4BF]"
              aria-hidden="true"
            />
            <h2 className="text-base font-semibold text-white">
              Conversa efêmera
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
              As mensagens ficam apenas na memória do seu navegador enquanto
              esta aba estiver aberta.
            </p>
          </Card>

          <Card className="p-5">
            <Shield
              className="mb-3 h-5 w-5 text-[#2DD4BF]"
              aria-hidden="true"
            />
            <h2 className="text-base font-semibold text-white">
              Saída rápida com ESC
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
              Se precisar sair da tela imediatamente, pressione a tecla ESC ou
              clique em Saída Rápida no topo.
            </p>
          </Card>

          <Card className="p-5">
            <HeartHandshake
              className="mb-3 h-5 w-5 text-[#2DD4BF]"
              aria-hidden="true"
            />
            <h2 className="text-base font-semibold text-white">
              Apoio humano real
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
              Quando se sentir pronto para falar com um especialista, consulte o{" "}
              <Link
                href="/profissionais"
                className="text-[#2DD4BF] underline underline-offset-3 hover:text-white"
              >
                diretório de profissionais
              </Link>
              .
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
