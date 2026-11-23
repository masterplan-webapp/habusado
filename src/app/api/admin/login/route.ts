import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionCookieValue,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: { password?: unknown };
  try {
    payload = (await request.json()) as { password?: unknown };
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const password = typeof payload.password === "string" ? payload.password : "";

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Senha inválida." }, { status: 401 });
  }

  const sessionValue = createAdminSessionCookieValue();
  const response = NextResponse.json({ ok: true }, { status: 200 });

  response.cookies.set(ADMIN_COOKIE_NAME, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  return response;
}
