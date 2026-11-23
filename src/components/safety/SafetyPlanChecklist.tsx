"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  Download,
  Lock,
  Printer,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { SAFETY_PLAN_CATEGORIES } from "@/data/safety-plan";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export function SafetyPlanChecklist() {
  const [checkedIds, setCheckedIds] = React.useState<Record<string, boolean>>(
    {}
  );
  const [notesByCategory, setNotesByCategory] = React.useState<
    Record<string, string>
  >({});
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  const totalItems = React.useMemo(
    () =>
      SAFETY_PLAN_CATEGORIES.reduce(
        (sum, category) => sum + category.items.length,
        0
      ),
    []
  );

  const completedCount = React.useMemo(
    () => Object.values(checkedIds).filter(Boolean).length,
    [checkedIds]
  );

  const progressPercent =
    totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const hasAnyContent =
    completedCount > 0 ||
    Object.values(notesByCategory).some((note) => note.trim().length > 0);

  function toggleItem(itemId: string) {
    setCheckedIds((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
    setStatusMessage(null);
  }

  function updateCategoryNote(categoryId: string, value: string) {
    setNotesByCategory((prev) => ({
      ...prev,
      [categoryId]: value,
    }));
    setStatusMessage(null);
  }

  function handleClearAll() {
    setCheckedIds({});
    setNotesByCategory({});
    setStatusMessage(
      "Todas as marcações e anotações foram apagadas da memória."
    );
  }

  function handlePrint() {
    window.print();
  }

  function handleDownloadTxt() {
    const now = new Date();
    const dateStamp = now.toISOString().slice(0, 10);
    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(now);

    const lines: string[] = [
      "PLANO DE SEGURANCA PESSOAL",
      `Gerado em: ${formattedDate}`,
      `Progresso: ${completedCount} de ${totalItems} itens concluidos (${progressPercent}%)`,
      "Arquivo gerado localmente no navegador.",
      "",
      "========================================",
      "",
    ];

    for (const category of SAFETY_PLAN_CATEGORIES) {
      lines.push(category.title.toUpperCase());
      lines.push(category.description);
      lines.push("");

      for (const item of category.items) {
        const mark = checkedIds[item.id] ? "[x]" : "[ ]";
        lines.push(`${mark} ${item.text}`);
        if (item.tip) {
          lines.push(`    Dica: ${item.tip}`);
        }
      }

      const note = notesByCategory[category.id]?.trim();
      if (note) {
        lines.push("");
        lines.push("Anotacoes desta secao:");
        lines.push(note);
      }

      lines.push("");
      lines.push("========================================");
      lines.push("");
    }

    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `plano-de-seguranca-${dateStamp}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setStatusMessage(
      "Plano baixado em .txt. Salve o arquivo em um local que apenas você acessa."
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 rounded-xl border border-[#015E57] bg-[#112536] p-5 text-sm leading-relaxed text-[#CBD5E1] print:hidden">
        <Lock
          className="mt-0.5 h-5 w-5 shrink-0 text-[#2DD4BF]"
          aria-hidden="true"
        />
        <div>
          <p className="font-semibold text-white">
            Privacidade total: este checklist fica apenas na memória do seu
            navegador.
          </p>
          <p className="mt-1">
            Nenhuma marcação ou anotação é enviada para servidores. Ao sair da
            página ou clicar em limpar, tudo desaparece imediatamente.
          </p>
        </div>
      </div>

      <Card className="border-[#1E3A52] bg-[#112536] p-5 sm:p-6 print:border-slate-300 print:bg-white print:text-black">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-white print:text-black">
                Progresso do plano: {completedCount} de {totalItems} itens
              </span>
              <span className="text-xs font-medium text-[#2DD4BF] print:text-slate-700">
                {progressPercent}%
              </span>
            </div>
            <div
              className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#021729] print:bg-slate-200"
              role="progressbar"
              aria-valuenow={completedCount}
              aria-valuemin={0}
              aria-valuemax={totalItems}
              aria-label="Progresso do plano de segurança"
            >
              <div
                className="h-full rounded-full bg-[#2DD4BF] transition-all duration-300 print:bg-slate-800"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            <Button variant="primary" size="sm" onClick={handleDownloadTxt}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Baixar plano (.txt)
            </Button>

            <Button variant="secondary" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4" aria-hidden="true" />
              Imprimir / Salvar PDF
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={!hasAnyContent}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Limpar tudo agora
            </Button>
          </div>
        </div>
      </Card>

      {statusMessage && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-lg border border-[#015E57] bg-[#015E57]/20 px-4 py-3 text-sm text-[#E2E8F0] print:hidden"
        >
          <ShieldCheck
            className="h-4 w-4 shrink-0 text-[#2DD4BF]"
            aria-hidden="true"
          />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {SAFETY_PLAN_CATEGORIES.map((category, categoryIndex) => {
          const categoryChecked = category.items.filter(
            (item) => checkedIds[item.id]
          ).length;

          return (
            <Card
              key={category.id}
              className="border-[#1E3A52] bg-[#112536] p-6 sm:p-7 print:break-inside-avoid print:border-slate-300 print:bg-white print:text-black"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#1E3A52] pb-4 print:border-slate-300">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#2DD4BF] print:text-slate-600">
                    Etapa {categoryIndex + 1}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-white print:text-black">
                    {category.title}
                  </h2>
                </div>
                <span className="text-xs text-[#94A3B8] print:text-slate-600">
                  {categoryChecked} de {category.items.length} concluídos
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1] print:text-slate-700">
                {category.description}
              </p>

              <ul className="mt-5 space-y-3">
                {category.items.map((item) => {
                  const isChecked = Boolean(checkedIds[item.id]);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={isChecked}
                        onClick={() => toggleItem(item.id)}
                        className={cn(
                          "flex w-full cursor-pointer items-start gap-3.5 rounded-lg border p-4 text-left transition-colors print:border-slate-300 print:bg-white",
                          isChecked
                            ? "border-[#015E57] bg-[#015E57]/20"
                            : "border-[#1E3A52] bg-[#021729] hover:border-[#015E57]"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                            isChecked
                              ? "border-[#2DD4BF] bg-[#015E57] text-white print:border-black print:bg-black"
                              : "border-[#015E57] bg-transparent print:border-slate-500"
                          )}
                          aria-hidden="true"
                        >
                          {isChecked && <Check className="h-3.5 w-3.5" />}
                        </span>

                        <span className="flex-1">
                          <span
                            className={cn(
                              "block text-sm leading-relaxed",
                              isChecked
                                ? "text-[#94A3B8] line-through print:text-slate-500"
                                : "text-white print:text-black"
                            )}
                          >
                            {item.text}
                          </span>
                          {item.tip && (
                            <span className="mt-1.5 block text-xs leading-relaxed text-[#94A3B8] print:text-slate-600">
                              Dica: {item.tip}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 border-t border-[#1E3A52] pt-4 print:border-slate-200">
                <div className="print:hidden">
                  <Textarea
                    label="Anotações locais desta etapa (opcional)"
                    rows={2}
                    placeholder="Ex.: local onde guardei as cópias, contato de confiança ou lembrete pessoal..."
                    value={notesByCategory[category.id] ?? ""}
                    onChange={(e) =>
                      updateCategoryNote(category.id, e.target.value)
                    }
                  />
                </div>
                {notesByCategory[category.id]?.trim() && (
                  <div className="hidden print:block">
                    <p className="text-xs font-semibold uppercase text-slate-600">
                      Anotações desta etapa
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm text-black">
                      {notesByCategory[category.id]}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <section
        aria-label="Recursos complementares"
        className="grid gap-4 border-t border-[#1E3A52] pt-8 sm:grid-cols-3 print:hidden"
      >
        <Link
          href="/privacidade-digital"
          className={buttonClasses({
            variant: "secondary",
            size: "md",
            className: "justify-between",
          })}
        >
          <span>Privacidade Digital</span>
          <span className="text-xs text-[#2DD4BF]">Abrir</span>
        </Link>

        <Link
          href="/diario"
          className={buttonClasses({
            variant: "secondary",
            size: "md",
            className: "justify-between",
          })}
        >
          <span>Diário de Episódios</span>
          <span className="text-xs text-[#2DD4BF]">Abrir</span>
        </Link>

        <Link
          href="/ajuda-urgente"
          className={buttonClasses({
            variant: "outline",
            size: "md",
            className: "justify-between",
          })}
        >
          <span>Ajuda Urgente</span>
          <span className="text-xs">188 / 190</span>
        </Link>
      </section>
    </div>
  );
}
