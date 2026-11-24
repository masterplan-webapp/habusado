import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { getSupabaseClient } from "@/lib/supabase";

export interface DemoVisibilitySettings {
  showDemoTestimonials: boolean;
  showDemoProfessionals: boolean;
}

export const DEFAULT_DEMO_VISIBILITY: DemoVisibilitySettings = {
  showDemoTestimonials: true,
  showDemoProfessionals: true,
};

const SETTINGS_KEY = "demo_visibility";

export async function getDemoVisibilitySettings(): Promise<DemoVisibilitySettings> {
  const supabase = getSupabaseAdminClient() ?? getSupabaseClient();
  if (!supabase) {
    return DEFAULT_DEMO_VISIBILITY;
  }

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", SETTINGS_KEY)
      .maybeSingle();

    if (error || !data || typeof data.value !== "object" || data.value === null) {
      return DEFAULT_DEMO_VISIBILITY;
    }

    const val = data.value as Partial<DemoVisibilitySettings>;
    return {
      showDemoTestimonials:
        typeof val.showDemoTestimonials === "boolean"
          ? val.showDemoTestimonials
          : true,
      showDemoProfessionals:
        typeof val.showDemoProfessionals === "boolean"
          ? val.showDemoProfessionals
          : true,
    };
  } catch {
    return DEFAULT_DEMO_VISIBILITY;
  }
}

export async function saveDemoVisibilitySettings(
  next: DemoVisibilitySettings
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { ok: true };
  }

  const { error } = await supabase.from("site_settings").upsert(
    {
      key: SETTINGS_KEY,
      value: next,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("[site-settings] Supabase upsert error:", error);
    return {
      ok: false,
      error:
        "Não foi possível salvar a preferência. Verifique se a tabela site_settings foi criada no Supabase.",
    };
  }

  return { ok: true };
}
