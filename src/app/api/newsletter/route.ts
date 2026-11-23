import { getSupabaseClient } from "@/lib/supabase";
import { sendEmailSafe } from "@/lib/resend";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let payload: { email?: unknown };
  try {
    payload = (await request.json()) as { email?: unknown };
  } catch {
    return Response.json(
      { error: "Dados inválidos na requisição." },
      { status: 400 }
    );
  }

  const rawEmail = typeof payload.email === "string" ? payload.email.trim() : "";
  const email = rawEmail.toLowerCase();

  if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
    return Response.json(
      { error: "Informe um endereço de e-mail válido." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseClient();
  let alreadySubscribed = false;
  let storedInSupabase = false;

  if (supabase) {
    const { error } = await supabase
      .from("subscribers")
      .insert({ email, active: true });

    if (error) {
      if (error.code === "23505") {
        alreadySubscribed = true;
      } else {
        return Response.json(
          { error: "Não foi possível salvar sua inscrição agora. Tente novamente." },
          { status: 500 }
        );
      }
    } else {
      storedInSupabase = true;
    }
  }

  if (!alreadySubscribed) {
    await sendEmailSafe({
      to: email,
      subject: "Inscrição confirmada na newsletter",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #021729; line-height: 1.6; max-width: 560px;">
          <p>Olá,</p>
          <p>Seu e-mail foi cadastrado para receber novos artigos e guias práticos do portal Homem Abusado.</p>
          <p>Enviamos mensagens de forma discreta e ocasional. Se em qualquer momento preferir sair da lista, basta responder a este e-mail pedindo o descadastro.</p>
          <p>Com respeito,<br />Equipe Homem Abusado</p>
        </div>
      `,
    });
  }

  if (alreadySubscribed) {
    return Response.json(
      {
        ok: true,
        alreadySubscribed: true,
        message: "Este e-mail já está inscrito na nossa lista.",
      },
      { status: 200 }
    );
  }

  return Response.json(
    {
      ok: true,
      previewMode: !storedInSupabase,
      message:
        "Inscrição confirmada. Você receberá nossos próximos textos por e-mail.",
    },
    { status: 201 }
  );
}
