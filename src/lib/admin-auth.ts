import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "ha_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

const DEV_FALLBACK_PASSWORD = "admin-dev";

function getAdminSecret(): string | null {
  const configured = process.env.ADMIN_PASSWORD?.trim();
  if (configured) {
    return configured;
  }
  if (process.env.NODE_ENV !== "production") {
    return DEV_FALLBACK_PASSWORD;
  }
  return null;
}

export function isAdminDevFallbackEnabled(): boolean {
  return (
    !process.env.ADMIN_PASSWORD?.trim() &&
    process.env.NODE_ENV !== "production"
  );
}

function safeEqualStrings(a: string, b: string): boolean {
  const digestA = crypto.createHash("sha256").update(a, "utf8").digest();
  const digestB = crypto.createHash("sha256").update(b, "utf8").digest();
  return crypto.timingSafeEqual(digestA, digestB);
}

export function verifyAdminPassword(input: string): boolean {
  const secret = getAdminSecret();
  if (!secret || typeof input !== "string" || input.length === 0) {
    return false;
  }
  return safeEqualStrings(input, secret);
}

function signPayload(payload: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(payload, "utf8")
    .digest("hex");
}

export function createAdminSessionCookieValue(): string {
  const secret = getAdminSecret();
  if (!secret) {
    throw new Error("ADMIN_PASSWORD não configurada em produção.");
  }
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = `${timestamp}.${nonce}`;
  const signature = signPayload(payload, secret);
  return `${payload}.${signature}`;
}

export function verifyAdminSessionCookieValue(
  val: string | undefined
): boolean {
  const secret = getAdminSecret();
  if (!secret || !val) {
    return false;
  }

  const parts = val.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const [timestampStr, nonce, providedSignature] = parts;
  if (!timestampStr || !nonce || !providedSignature) {
    return false;
  }

  const timestamp = Number(timestampStr);
  if (!Number.isFinite(timestamp)) {
    return false;
  }

  const ageMs = Date.now() - timestamp;
  const maxAgeMs = ADMIN_SESSION_MAX_AGE_SECONDS * 1000;
  if (ageMs < -60_000 || ageMs > maxAgeMs) {
    return false;
  }

  const expectedSignature = signPayload(`${timestampStr}.${nonce}`, secret);
  return safeEqualStrings(providedSignature, expectedSignature);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionCookieValue(cookieValue);
}
