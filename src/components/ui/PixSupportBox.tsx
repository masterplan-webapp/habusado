"use client";

import { useState } from "react";
import { Check, Copy, HeartHandshake } from "lucide-react";

const PIX_KEY_RAW = "70115203000109";
const PIX_KEY_DISPLAY = "70.115.203/0001-09";
const PIX_RECIPIENT = "MasterPlan Digital Performance";
const PIX_BANK = "Banco Santander";

interface PixSupportBoxProps {
  variant?: "compact" | "editorial";
}

export function PixSupportBox({ variant = "compact" }: PixSupportBoxProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(PIX_KEY_RAW);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback when clipboard permission is unavailable.
      const input = document.createElement("input");
      input.value = PIX_KEY_RAW;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  if (variant === "editorial") {
    return (
      <div className="mt-8 rounded-xl border border-[#1E3A52] bg-[#112536]/80 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
              <HeartHandshake className="h-4 w-4" aria-hidden="true" />
              <span>Apoio voluntário ao projeto</span>
            </div>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Projeto gratuito e independente
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
              O Homem Abusado é gratuito para alcançar o maior número possível de
              homens. Manter o site, o banco de dados e o atendimento do H.Aroldo
              no ar gera custos mensais de infraestrutura. Se este espaço ajudou
              você e sentir vontade de colaborar, qualquer contribuição via Pix é
              totalmente opcional e bem-vinda.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-[#94A3B8]">
              <span>
                Chave Pix (CNPJ):{" "}
                <strong className="font-mono text-[#E2E8F0]">
                  {PIX_KEY_DISPLAY}
                </strong>
              </span>
              <span>
                Destinatário:{" "}
                <strong className="text-[#E2E8F0]">{PIX_RECIPIENT}</strong>
              </span>
              <span>
                Instituição:{" "}
                <strong className="text-[#E2E8F0]">{PIX_BANK}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleCopy()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#015E57] bg-[#021729] px-4 py-2.5 text-sm font-medium text-[#CBD5E1] transition-colors hover:bg-[#015E57] hover:text-white cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-[#2DD4BF]" aria-hidden="true" />
                <span>Chave copiada</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden="true" />
                <span>Copiar chave Pix</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-xl border border-[#1E3A52] bg-[#112536]/60 px-5 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs leading-relaxed text-[#CBD5E1]">
            <strong className="font-medium text-white">
              Apoie o projeto (opcional):
            </strong>{" "}
            o Homem Abusado é gratuito e independente. Se quiser ajudar nos
            custos de hospedagem e do H.Aroldo, você pode enviar um Pix para a
            chave CNPJ{" "}
            <span className="font-mono text-[#E2E8F0]">{PIX_KEY_DISPLAY}</span>{" "}
            ({PIX_RECIPIENT}, {PIX_BANK}).
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleCopy()}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#1E3A52] bg-[#021729] px-3.5 py-2 text-xs font-medium text-[#CBD5E1] transition-colors hover:border-[#015E57] hover:text-white cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#2DD4BF]" aria-hidden="true" />
              <span>Chave copiada</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Copiar chave Pix</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
