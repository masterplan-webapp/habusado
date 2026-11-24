import type { Metadata } from "next";
import { TestimonialsMural } from "@/components/testimonials/TestimonialsMural";
import { SEED_TESTIMONIALS } from "@/data/seed-testimonials";
import { getDemoVisibilitySettings } from "@/lib/site-settings";
import { getSupabaseClient } from "@/lib/supabase";
import type { Testimonial, TestimonialReply } from "@/lib/types";

export const metadata: Metadata = {
  title: "Mural de Relatos",
  description:
    "Relatos anônimos de homens que viveram ou estão superando relacionamentos abusivos. Espaço moderado e respeitoso.",
};

export const dynamic = "force-dynamic";

async function loadApprovedTestimonials(): Promise<Testimonial[]> {
  const [supabase, settings] = [
    getSupabaseClient(),
    await getDemoVisibilitySettings(),
  ];

  let dbItems: Testimonial[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select(
          "id, pseudonym, title, content, status, support_count, created_at"
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const { data: repliesData } = await supabase
          .from("testimonial_replies")
          .select("id, testimonial_id, pseudonym, content, status, created_at")
          .eq("status", "approved")
          .order("created_at", { ascending: true });

        const repliesByStory = new Map<string, TestimonialReply[]>();
        if (Array.isArray(repliesData)) {
          for (const reply of repliesData as TestimonialReply[]) {
            const list = repliesByStory.get(reply.testimonial_id) ?? [];
            list.push(reply);
            repliesByStory.set(reply.testimonial_id, list);
          }
        }

        dbItems = (data as Testimonial[]).map((item) => ({
          ...item,
          support_count: item.support_count ?? 0,
          replies: repliesByStory.get(item.id) ?? [],
        }));
      }
    } catch {
      // Fallback gracefully when Supabase is unavailable.
    }
  }

  if (!settings.showDemoTestimonials) {
    return dbItems;
  }

  const seenIds = new Set(dbItems.map((item) => item.id));
  return [
    ...dbItems,
    ...SEED_TESTIMONIALS.filter((item) => !seenIds.has(item.id)),
  ];
}

export default async function RelatosPage() {
  const testimonials = await loadApprovedTestimonials();

  return (
    <div className="bg-[#021729] py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl border-b border-[#1E3A52] pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2DD4BF]">
            Comunidade anônima
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Mural de Relatos
          </h1>
          <p className="mt-4 text-base leading-[1.7] text-[#CBD5E1]">
            Ler histórias reais ajuda a enxergar padrões que pareciam isolados.
            Cada relato e mensagem de apoio abaixo passa por triagem de
            segurança e revisão humana para preservar a privacidade de todos.
          </p>
        </header>

        <TestimonialsMural initialTestimonials={testimonials} />
      </div>
    </div>
  );
}
