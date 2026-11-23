"use client";

import { useEffect, useState } from "react";
import { Check, Pause, Play, RotateCcw, Wind } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface BreathingPhase {
  id: "inhale" | "hold" | "exhale";
  label: string;
  shortLabel: string;
  duration: number;
  helper: string;
}

const PHASES: BreathingPhase[] = [
  {
    id: "inhale",
    label: "Inspire devagar (4s)",
    shortLabel: "Inspire",
    duration: 4,
    helper: "Puxe o ar pelo nariz com calma, expandindo o abdômen.",
  },
  {
    id: "hold",
    label: "Segure suavemente (4s)",
    shortLabel: "Segure",
    duration: 4,
    helper: "Mantenha o ar nos pulmões sem tensionar os ombros.",
  },
  {
    id: "exhale",
    label: "Solte o ar pela boca (6s)",
    shortLabel: "Solte o ar",
    duration: 6,
    helper: "Expire devagar, deixando o corpo baixar o ritmo.",
  },
];

interface GroundingStep {
  id: string;
  count: number;
  title: string;
  prompt: string;
}

const GROUNDING_STEPS: GroundingStep[] = [
  {
    id: "see-5",
    count: 5,
    title: "5 coisas que você vê agora",
    prompt: "Olhe ao redor e nomeie mentalmente cinco objetos ou cores no ambiente.",
  },
  {
    id: "touch-4",
    count: 4,
    title: "4 coisas que você sente ao toque",
    prompt: "Perceba os pés no chão, o tecido da roupa, a cadeira ou a temperatura do ar.",
  },
  {
    id: "hear-3",
    count: 3,
    title: "3 sons que você ouve",
    prompt: "Note ruídos próximos ou distantes, sem precisar julgá-los.",
  },
  {
    id: "smell-2",
    count: 2,
    title: "2 cheiros que você percebe",
    prompt: "Se não notar nenhum cheiro forte, perceba o aroma neutro do ambiente ou da pele.",
  },
  {
    id: "anchor-1",
    count: 1,
    title: "1 coisa boa ou neutra neste momento",
    prompt: "Pode ser simples: um copo de água, o silêncio deste instante ou estar respirando com calma.",
  },
];

export function BreathingGuide() {
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PHASES[0].duration);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const currentPhase = PHASES[phaseIndex];

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        const nextIndex = (phaseIndex + 1) % PHASES.length;
        setPhaseIndex(nextIndex);
        if (nextIndex === 0) {
          setCompletedCycles((cycles) => cycles + 1);
        }
        return PHASES[nextIndex].duration;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, phaseIndex]);

  function handleReset() {
    setIsRunning(false);
    setPhaseIndex(0);
    setSecondsLeft(PHASES[0].duration);
    setCompletedCycles(0);
  }

  function toggleGroundingStep(id: string) {
    setCheckedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  const checkedCount = Object.values(checkedSteps).filter(Boolean).length;

  const progressPercent = isRunning
    ? ((currentPhase.duration - secondsLeft + 1) / currentPhase.duration) * 100
    : 0;

  const visualScaleClass = !isRunning
    ? "scale-90 opacity-80"
    : currentPhase.id === "inhale"
      ? "scale-100 opacity-100"
      : currentPhase.id === "hold"
        ? "scale-100 opacity-95"
        : "scale-75 opacity-80";

  return (
    <div className="space-y-12">
      {/* 4-4-6 Breathing Card */}
      <section
        aria-labelledby="respiracao-guiada-titulo"
        className="rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:p-10"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E3A52] pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
              <Wind className="h-4 w-4" aria-hidden="true" />
              <span>Respiração 4-4-6</span>
            </div>
            <h2
              id="respiracao-guiada-titulo"
              className="mt-1.5 text-xl font-semibold text-white sm:text-2xl"
            >
              Guia de ritmo respiratório
            </h2>
          </div>

          <div className="rounded-lg border border-[#1E3A52] bg-[#021729] px-4 py-2 text-xs text-[#CBD5E1]">
            Ciclos concluídos:{" "}
            <span className="font-semibold text-[#2DD4BF]">
              {completedCycles}
            </span>
          </div>
        </div>

        {/* Visual geometric breathing indicator */}
        <div className="my-10 flex flex-col items-center text-center">
          <div className="relative flex h-52 w-52 items-center justify-center sm:h-60 sm:w-60">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-xl border border-[#1E3A52] bg-[#021729]"
            />
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-4 rounded-lg border-2 border-[#015E57] bg-[#015E57]/20 transition-all duration-1000 ease-in-out motion-reduce:scale-100 motion-reduce:transition-none",
                visualScaleClass
              )}
            />
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-10 rounded-lg border border-[#2DD4BF]/50 bg-[#021729]/90 transition-all duration-1000 ease-in-out motion-reduce:scale-100 motion-reduce:transition-none",
                visualScaleClass
              )}
            />

            <div className="relative z-10 flex flex-col items-center px-4">
              <span
                aria-live="polite"
                className="text-4xl font-semibold tabular-nums text-white sm:text-5xl"
              >
                {secondsLeft}s
              </span>
              <span className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
                {isRunning ? currentPhase.shortLabel : "Pronto"}
              </span>
            </div>
          </div>

          <p
            aria-live="polite"
            className="mt-8 text-xl font-semibold text-white sm:text-2xl"
          >
            {isRunning
              ? currentPhase.label
              : "Pressione iniciar quando estiver confortável"}
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[#CBD5E1]">
            {isRunning
              ? currentPhase.helper
              : "Três ou quatro ciclos já ajudam a desacelerar a frequência cardíaca após um episódio tenso."}
          </p>

          {/* Calm progress bar */}
          <div className="mt-6 w-full max-w-md">
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-[#021729]"
              role="progressbar"
              aria-label="Progresso da etapa atual"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPercent)}
            >
              <div
                className="h-full rounded-full bg-[#2DD4BF] transition-all duration-700 ease-linear motion-reduce:transition-none"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              {PHASES.map((phase, idx) => {
                const isActive = isRunning && idx === phaseIndex;
                return (
                  <div
                    key={phase.id}
                    className={cn(
                      "rounded-md border px-2.5 py-2 text-center transition-colors",
                      isActive
                        ? "border-[#015E57] bg-[#015E57]/30 font-semibold text-[#2DD4BF]"
                        : "border-[#1E3A52] bg-[#021729] text-[#94A3B8]"
                    )}
                  >
                    {phase.shortLabel} ({phase.duration}s)
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsRunning((prev) => !prev)}
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" aria-hidden="true" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" aria-hidden="true" />
                  <span>{completedCycles > 0 ? "Continuar" : "Iniciar"}</span>
                </>
              )}
            </Button>

            <Button variant="secondary" size="lg" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Reiniciar</span>
            </Button>
          </div>
        </div>
      </section>

      {/* 5-4-3-2-1 Grounding Checklist */}
      <section
        aria-labelledby="aterramento-titulo"
        className="rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:p-10"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#1E3A52] pb-5">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
              Técnica de aterramento 5-4-3-2-1
            </p>
            <h2
              id="aterramento-titulo"
              className="mt-1.5 text-xl font-semibold text-white sm:text-2xl"
            >
              Traga a atenção de volta para o presente
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
              Toque em cada etapa conforme concluir. Nada fica salvo no
              navegador.
            </p>
          </div>

          {checkedCount > 0 && (
            <button
              type="button"
              onClick={() => setCheckedSteps({})}
              className="rounded-lg border border-[#1E3A52] bg-[#021729] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] transition-colors hover:border-[#015E57] hover:text-white cursor-pointer"
            >
              Limpar marcações ({checkedCount}/5)
            </button>
          )}
        </div>

        <ul className="mt-6 space-y-3">
          {GROUNDING_STEPS.map((step) => {
            const isChecked = Boolean(checkedSteps[step.id]);
            return (
              <li key={step.id}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  onClick={() => toggleGroundingStep(step.id)}
                  className={cn(
                    "flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-colors cursor-pointer sm:p-5",
                    isChecked
                      ? "border-[#015E57] bg-[#015E57]/20"
                      : "border-[#1E3A52] bg-[#021729] hover:border-[#015E57]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-sm font-semibold transition-colors",
                      isChecked
                        ? "border-[#2DD4BF] bg-[#015E57] text-white"
                        : "border-[#1E3A52] bg-[#112536] text-[#2DD4BF]"
                    )}
                    aria-hidden="true"
                  >
                    {isChecked ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.count
                    )}
                  </span>

                  <span className="flex-1">
                    <span
                      className={cn(
                        "block text-base font-semibold transition-colors",
                        isChecked ? "text-[#2DD4BF]" : "text-white"
                      )}
                    >
                      {step.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-[#CBD5E1]">
                      {step.prompt}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
