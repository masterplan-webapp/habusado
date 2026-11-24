import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  DEFAULT_DEMO_VISIBILITY,
  getDemoVisibilitySettings,
  saveDemoVisibilitySettings,
  type DemoVisibilitySettings,
} from "@/lib/site-settings";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { SEED_TESTIMONIALS } from "@/data/seed-testimonials";
import { SEED_PROFESSIONALS } from "@/data/seed-professionals";
import type {
  Professional,
  Testimonial,
  TestimonialReply,
} from "@/lib/types";

export const runtime = "nodejs";

type AdminReplyRow = TestimonialReply & {
  testimonial_title?: string;
  moderation_flag?: string | null;
};

interface PatchModerationBody {
  type?: "testimonial" | "reply" | "professional";
  id?: string;
  action?: "approve" | "reject";
}

function buildPreviewData() {
  const pendingTestimonials: Testimonial[] = [
    {
      id: "preview-t-pending-1",
      pseudonym: "Henrique B.",
      title: "Anos sem poder ver minha família aos domingos",
      content:
        "Toda vez que eu combinava um almoço na casa dos meus pais, surgia uma briga horas antes. Só percebi o isolamento quando passei quase dois anos sem encontrar meu irmão.",
      status: "pending",
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      support_count: 0,
    },
    {
      id: "preview-t-pending-2",
      pseudonym: "Daniel F.",
      title: "Medo de abrir o celular perto de casa",
      content:
        "Passei a apagar conversas normais de trabalho porque qualquer mensagem virava interrogatório de madrugada. Voltar a dormir em paz está sendo um alívio.",
      status: "pending",
      created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      support_count: 0,
    },
    {
      id: "preview-t-pending-3",
      pseudonym: "Rodrigo L.",
      title: "Controlavam até o meu extrato bancário",
      content:
        "Eu trabalhava dois turnos e ainda precisava pedir permissão para comprar um café. Quando consegui organizar uma conta separada e procurar terapia, comecei a respirar de novo.",
      status: "pending",
      created_at: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
      support_count: 0,
    },
  ];

  const testimonials: Testimonial[] = [
    ...pendingTestimonials,
    ...SEED_TESTIMONIALS,
  ];

  const seedReplies: AdminReplyRow[] = SEED_TESTIMONIALS.flatMap((story) =>
    (story.replies ?? []).map((reply) => ({
      ...reply,
      testimonial_title: story.title,
      moderation_flag: null,
    }))
  );

  const pendingReplies: AdminReplyRow[] = [
    {
      id: "preview-r-pending-1",
      testimonial_id: SEED_TESTIMONIALS[0]?.id ?? "seed-1",
      testimonial_title:
        SEED_TESTIMONIALS[0]?.title ?? "Relato da comunidade",
      pseudonym: "Bruno T.",
      content:
        "Me vi em cada linha do que você escreveu. Reconhecer o padrão já tira um peso enorme das costas. Força nessa etapa.",
      status: "pending",
      moderation_flag: null,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "preview-r-pending-2",
      testimonial_id: SEED_TESTIMONIALS[1]?.id ?? "seed-2",
      testimonial_title:
        SEED_TESTIMONIALS[1]?.title ?? "Relato da comunidade",
      pseudonym: "Caio N.",
      content:
        "Obrigado por dividir sua experiência aqui. Procurar um psicólogo que entenda dinâmica de abuso emocional fez toda a diferença para mim.",
      status: "pending",
      moderation_flag: null,
      created_at: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    },
  ];

  const replies: AdminReplyRow[] = [...pendingReplies, ...seedReplies];

  const pendingProfessionals: Professional[] = [
    {
      id: "preview-p-pending-1",
      name: "Dr. Gustavo Almeida",
      specialty: "Psicologia",
      license_number: "CRP 06/148920",
      bio: "Psicólogo clínico com experiência no atendimento de homens em recuperação pós-relacionamento abusivo, ansiedade e reconstrução de limites.",
      city: "Campinas",
      state: "SP",
      is_online: true,
      contact_url: "https://example.org/gustavo-almeida",
      photo_url: null,
      status: "pending",
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: "preview-p-pending-2",
      name: "Dra. Fernanda Costa",
      specialty: "Direito",
      license_number: "OAB/MG 192410",
      bio: "Advogada de família com atuação em guarda compartilhada, convivência paterna e preservação lícita de provas digitais.",
      city: "Belo Horizonte",
      state: "MG",
      is_online: true,
      contact_url: "https://example.org/fernanda-costa",
      photo_url: null,
      status: "pending",
      created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    },
  ];

  const professionals: Professional[] = [
    ...pendingProfessionals,
    ...SEED_PROFESSIONALS,
  ];

  return {
    mode: "preview" as const,
    settings: DEFAULT_DEMO_VISIBILITY,
    stats: {
      pendingTestimonials: pendingTestimonials.length,
      pendingReplies: pendingReplies.length,
      pendingProfessionals: pendingProfessionals.length,
      subscribersCount: 42,
    },
    testimonials,
    replies,
    professionals,
  };
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(buildPreviewData(), { status: 200 });
  }

  try {
    const [testimonialsRes, repliesRes, professionalsRes, subscribersRes] =
      await Promise.all([
        supabase
          .from("testimonials")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("testimonial_replies")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("professionals")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("subscribers")
          .select("id", { count: "exact", head: true }),
      ]);

    if (
      testimonialsRes.error ||
      repliesRes.error ||
      professionalsRes.error ||
      subscribersRes.error
    ) {
      return NextResponse.json(
        { error: "Erro ao consultar registros de moderação no Supabase." },
        { status: 500 }
      );
    }

    const testimonials = (testimonialsRes.data ?? []) as Testimonial[];
    const titleByTestimonialId = new Map(
      testimonials.map((t) => [t.id, t.title])
    );

    const replies = ((repliesRes.data ?? []) as AdminReplyRow[]).map((r) => ({
      ...r,
      testimonial_title: titleByTestimonialId.get(r.testimonial_id),
    }));

    const professionals = (professionalsRes.data ?? []) as Professional[];
    const subscribersCount = subscribersRes.count ?? 0;
    const settings = await getDemoVisibilitySettings();

    return NextResponse.json(
      {
        mode: "supabase",
        settings,
        stats: {
          pendingTestimonials: testimonials.filter(
            (t) => t.status === "pending"
          ).length,
          pendingReplies: replies.filter((r) => r.status === "pending").length,
          pendingProfessionals: professionals.filter(
            (p) => p.status === "pending"
          ).length,
          subscribersCount,
        },
        testimonials,
        replies,
        professionals,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erro inesperado ao carregar dados de moderação." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let body: PatchModerationBody;
  try {
    body = (await request.json()) as PatchModerationBody;
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const { type, id, action } = body;
  if (
    (type !== "testimonial" &&
      type !== "reply" &&
      type !== "professional") ||
    typeof id !== "string" ||
    id.trim().length === 0 ||
    (action !== "approve" && action !== "reject")
  ) {
    return NextResponse.json(
      { error: "Parâmetros de moderação inválidos." },
      { status: 400 }
    );
  }

  const targetStatus = action === "approve" ? "approved" : "rejected";
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { ok: true, status: targetStatus, preview: true },
      { status: 200 }
    );
  }

  try {
    if (type === "testimonial") {
      const { error } = await supabase
        .from("testimonials")
        .update({ status: targetStatus })
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { error: "Não foi possível atualizar o relato." },
          { status: 500 }
        );
      }
    } else if (type === "reply") {
      const { error } = await supabase
        .from("testimonial_replies")
        .update({ status: targetStatus })
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { error: "Não foi possível atualizar a resposta." },
          { status: 500 }
        );
      }
    } else if (type === "professional") {
      if (action === "approve") {
        const { error } = await supabase
          .from("professionals")
          .update({ status: "approved" })
          .eq("id", id);

        if (error) {
          return NextResponse.json(
            { error: "Não foi possível aprovar o cadastro profissional." },
            { status: 500 }
          );
        }
      } else {
        const { error } = await supabase
          .from("professionals")
          .delete()
          .eq("id", id);

        if (error) {
          return NextResponse.json(
            { error: "Não foi possível rejeitar o cadastro profissional." },
            { status: 500 }
          );
        }
      }
    }

    revalidatePath("/relatos");
    revalidatePath("/profissionais");

    return NextResponse.json(
      { ok: true, status: targetStatus },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erro inesperado ao salvar decisão de moderação." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let body: { type?: "testimonial" | "reply" | "professional"; id?: string };
  try {
    body = (await request.json()) as {
      type?: "testimonial" | "reply" | "professional";
      id?: string;
    };
  } catch {
    return NextResponse.json(
      { error: "Requisição inválida." },
      { status: 400 }
    );
  }

  const { type, id } = body;
  if (
    !id ||
    typeof id !== "string" ||
    (type !== "testimonial" && type !== "reply" && type !== "professional")
  ) {
    return NextResponse.json(
      { error: "Parâmetros inválidos para exclusão." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, preview: true }, { status: 200 });
  }

  const tableMap = {
    testimonial: "testimonials",
    reply: "testimonial_replies",
    professional: "professionals",
  } as const;

  try {
    const { error } = await supabase.from(tableMap[type]).delete().eq("id", id);

    if (error) {
      console.error(`[api/admin/moderation] DELETE ${type} error:`, error);
      return NextResponse.json(
        { error: "Não foi possível excluir o registro no Supabase." },
        { status: 500 }
      );
    }

    revalidatePath("/relatos");
    revalidatePath("/profissionais");

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erro inesperado ao excluir registro." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let body: Partial<DemoVisibilitySettings>;
  try {
    body = (await request.json()) as Partial<DemoVisibilitySettings>;
  } catch {
    return NextResponse.json(
      { error: "Requisição inválida." },
      { status: 400 }
    );
  }

  const next: DemoVisibilitySettings = {
    showDemoTestimonials:
      typeof body.showDemoTestimonials === "boolean"
        ? body.showDemoTestimonials
        : true,
    showDemoProfessionals:
      typeof body.showDemoProfessionals === "boolean"
        ? body.showDemoProfessionals
        : true,
  };

  const result = await saveDemoVisibilitySettings(next);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Não foi possível salvar a preferência." },
      { status: 500 }
    );
  }

  revalidatePath("/relatos");
  revalidatePath("/profissionais");

  return NextResponse.json({ ok: true, settings: next }, { status: 200 });
}
