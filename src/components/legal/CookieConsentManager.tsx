"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, SlidersHorizontal } from "lucide-react";

const STORAGE_KEY = "ha_lgpd_consent_v1";
const OPEN_EVENT = "ha:open-cookie-preferences";

type ConsentState = "essential" | "analytics" | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function applyGoogleConsent(state: "essential" | "analytics") {
  if (typeof window === "undefined") return;
  const analyticsValue = state === "analytics" ? "granted" : "denied";

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: analyticsValue,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push([
      "consent",
      "update",
      {
        analytics_storage: analyticsValue,
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      },
    ]);
  }
}

export function openCookiePreferences() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_EVENT));
  }
}

export function CookiePreferencesTrigger() {
  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] underline underline-offset-4 transition-colors hover:text-[#2DD4BF] cursor-pointer"
    >
      <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
      <span>Gerenciar cookies (LGPD)</span>
    </button>
  );
}

export function CookieConsentManager() {
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "analytics" || saved === "essential") {
        setConsent(saved);
        applyGoogleConsent(saved);
        setVisible(false);
      } else {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }

    const handleOpen = () => setVisible(true);
    window.addEventListener(OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_EVENT, handleOpen);
  }, []);

  function saveChoice(choice: "essential" | "analytics") {
    setConsent(choice);
    applyGoogleConsent(choice);
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Ignore storage failures in restricted browsing modes.
    }
    setVisible(false);
  }

  if (!mounted || !visible) {
    return null;
  }

  return (
    <aside
      role="dialog"
      aria-live="polite"
      aria-label="Preferências de privacidade e cookies"
      className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-4xl rounded-xl border border-[#015E57] bg-[#112536]/95 p-4 shadow-2xl backdrop-blur-md sm:inset-x-6 sm:bottom-5 sm:p-5 print:hidden"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#2DD4BF]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>Privacidade e LGPD</span>
          </div>
          <p className="text-xs leading-relaxed text-[#CBD5E1] sm:text-sm">
            Usamos cookies essenciais para funcionamento seguro e, somente com
            sua autorização, medição anônima de acessos (Google Analytics 4)
            para melhorar o portal. Suas conversas no H.Aroldo, Termômetro,
            Diário e Plano de Segurança nunca são gravadas em banco de dados.{" "}
            <Link
              href="/privacidade"
              className="font-medium text-[#2DD4BF] underline underline-offset-4 hover:text-white"
            >
              Ler Política de Privacidade
            </Link>
            .
          </p>
          {consent && (
            <p className="text-[11px] text-[#94A3B8]">
              Preferência atual:{" "}
              <strong className="text-white">
                {consent === "analytics"
                  ? "Essenciais + medição (GA4)"
                  : "Apenas essenciais"}
              </strong>
              . Você pode alterar ou revogar a qualquer momento.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
          <button
            type="button"
            onClick={() => saveChoice("essential")}
            className="rounded-lg border border-[#1E3A52] bg-[#021729] px-4 py-2.5 text-xs font-medium text-[#CBD5E1] transition-colors hover:border-[#015E57] hover:text-white cursor-pointer sm:text-sm"
          >
            Apenas essenciais
          </button>
          <button
            type="button"
            onClick={() => saveChoice("analytics")}
            className="rounded-lg bg-[#015E57] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#027A71] cursor-pointer sm:text-sm"
          >
            Aceitar medição (GA4)
          </button>
        </div>
      </div>
    </aside>
  );
}
