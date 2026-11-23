import { NextResponse } from "next/server";
import { SEED_PROFESSIONALS } from "@/data/seed-professionals";
import { notifyAdminSafe } from "@/lib/resend";
import { getSupabaseClient } from "@/lib/supabase";
import type { Professional, ProfessionalSpecialty } from "@/lib/types";

const VALID_SPECIALTIES: ProfessionalSpecialty[] = [
  "Psicologia",
  "Direito",
  "Psiquiatria",
  "Terapia",
];

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeContactUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  if (
    value.startsWith("https://") ||
    value.startsWith("http://") ||
    value.startsWith("mailto:")
  ) {
    return value;
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return `mailto:${value}`;
  }

  return null;
}

function isValidPhotoUrl(raw: string): boolean {
  if (!raw) return true;
  return (
    raw.startsWith("https://") ||
    raw.startsWith("http://") ||
    raw.startsWith("/")
  );
}

export async function GET() {
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
        const merged = [
          ...dbItems,
          ...SEED_PROFESSIONALS.filter((item) => !seenIds.has(item.id)),
        ];
        return NextResponse.json({ professionals: merged });
      }
    } catch {
      // Fallback gracefully to seed professionals.
    }
  }

  return NextResponse.json({ professionals: SEED_PROFESSIONALS });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const payload = body as Record<string, unknown>;
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const specialty =
    typeof payload.specialty === "string" ? payload.specialty.trim() : "";
  const licenseNumber =
    typeof payload.license_number === "string"
      ? payload.license_number.trim()
      : "";
  const city = typeof payload.city === "string" ? payload.city.trim() : "";
  const state =
    typeof payload.state === "string" ? payload.state.trim().toUpperCase() : "";
  const isOnline = Boolean(payload.is_online);
  const rawContactUrl =
    typeof payload.contact_url === "string" ? payload.contact_url.trim() : "";
  const bio = typeof payload.bio === "string" ? payload.bio.trim() : "";
  const photoUrl =
    typeof payload.photo_url === "string" ? payload.photo_url.trim() : "";

  if (name.length < 3 || name.length > 120) {
    return NextResponse.json(
      { error: "Informe seu nome completo (3 a 120 caracteres)." },
      { status: 400 }
    );
  }

  if (!VALID_SPECIALTIES.includes(specialty as ProfessionalSpecialty)) {
    return NextResponse.json(
      { error: "Selecione uma especialidade válida." },
      { status: 400 }
    );
  }

  if (licenseNumber.length < 3 || licenseNumber.length > 50) {
    return NextResponse.json(
      { error: "Informe seu número de registro profissional (CRP, OAB ou CRM)." },
      { status: 400 }
    );
  }

  if (city.length < 2 || city.length > 80) {
    return NextResponse.json(
      { error: "Informe sua cidade." },
      { status: 400 }
    );
  }

  if (!/^[A-Z]{2}$/.test(state)) {
    return NextResponse.json(
      { error: "Selecione um estado (UF) válido." },
      { status: 400 }
    );
  }

  const contactUrl = normalizeContactUrl(rawContactUrl);
  if (!contactUrl) {
    return NextResponse.json(
      {
        error:
          "Informe um link de contato válido começando com https://, http:// ou um e-mail.",
      },
      { status: 400 }
    );
  }

  if (bio.length < 30 || bio.length > 1500) {
    return NextResponse.json(
      { error: "A apresentação profissional deve ter entre 30 e 1500 caracteres." },
      { status: 400 }
    );
  }

  if (!isValidPhotoUrl(photoUrl)) {
    return NextResponse.json(
      { error: "A URL da foto deve começar com https:// ou http://." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseClient();
  let persisted = false;

  if (supabase) {
    const { error } = await supabase.from("professionals").insert({
      name,
      specialty,
      license_number: licenseNumber,
      city,
      state,
      is_online: isOnline,
      contact_url: contactUrl,
      bio,
      photo_url: photoUrl || null,
      status: "pending",
    });

    if (error) {
      return NextResponse.json(
        {
          error:
            "Não foi possível registrar seu cadastro agora. Tente novamente em alguns instantes.",
        },
        { status: 500 }
      );
    }

    persisted = true;
  }

  await notifyAdminSafe(
    `[Homem Abusado] Novo cadastro de profissional: ${name} (${specialty})`,
    `
      <h2>Novo cadastro na Rede de Profissionais</h2>
      <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
      <p><strong>Especialidade:</strong> ${escapeHtml(specialty)}</p>
      <p><strong>Registro:</strong> ${escapeHtml(licenseNumber)}</p>
      <p><strong>Localidade:</strong> ${escapeHtml(city)} / ${escapeHtml(state)}</p>
      <p><strong>Atendimento online:</strong> ${isOnline ? "Sim" : "Não"}</p>
      <p><strong>Contato:</strong> ${escapeHtml(contactUrl)}</p>
      ${photoUrl ? `<p><strong>Foto:</strong> ${escapeHtml(photoUrl)}</p>` : ""}
      <p><strong>Apresentação:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(bio)}</p>
      <hr />
      <p>Verifique manualmente o registro profissional antes de aprovar a publicação no Supabase.</p>
    `
  );

  return NextResponse.json(
    {
      ok: true,
      persisted,
      message:
        "Cadastro recebido com sucesso. Nossa equipe fará a verificação manual do seu registro profissional antes de publicar o seu perfil na rede.",
    },
    { status: 201 }
  );
}
