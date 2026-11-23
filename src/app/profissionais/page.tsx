import type { Metadata } from "next";
import { ProfessionalsDirectory } from "@/components/professionals/ProfessionalsDirectory";
import { SEED_PROFESSIONALS } from "@/data/seed-professionals";
import { getSupabaseClient } from "@/lib/supabase";
import type { Professional } from "@/lib/types";

export const metadata: Metadata = {
  title: "Rede de Profissionais",
  description:
    "Encontre psicólogos, advogados, psiquiatras e terapeutas preparados para atender homens em relacionamentos abusivos.",
};

export const dynamic = "force-dynamic";

async function loadApprovedProfessionals(): Promise<Professional[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("professionals")
        .select(
          "id, name, specialty, license_number, bio, city, state, is_online, contact_url, photo_url, status, created_at"
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const dbItems = data as Professional[];
        const seenIds = new Set(dbItems.map((item) => item.id));
        return [
          ...dbItems,
          ...SEED_PROFESSIONALS.filter((item) => !seenIds.has(item.id)),
        ];
      }
    } catch {
      // Fallback gracefully to seed professionals.
    }
  }

  return SEED_PROFESSIONALS;
}

export default async function ProfissionaisPage() {
  const professionals = await loadApprovedProfessionals();

  return (
    <div className="bg-[#021729] py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl border-b border-[#1E3A52] pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2DD4BF]">
            Apoio especializado
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Rede de Profissionais
          </h1>
          <p className="mt-4 text-base leading-[1.7] text-[#CBD5E1]">
            Profissionais de saúde mental e direito com registro ativo e
            disposição para escutar homens sem julgamento. O contato é feito
            diretamente com o especialista escolhido.
          </p>
        </header>

        <ProfessionalsDirectory professionals={professionals} />
      </div>
    </div>
  );
}
