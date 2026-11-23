"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import {
  THERMOMETER_MAX_SCORE,
  THERMOMETER_QUESTIONS,
  THERMOMETER_RESULTS,
  type ThermometerTier,
} from "@/data/thermometer-questions";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface ThermometerArticleCard {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
}

interface ThermometerQuizProps {
  articlesBySlug: Record<string, ThermometerArticleCard>;
}

const TIER_META: Record<
  ThermometerTier,
  { label: string; barClass: string; badgeClass: string }
> = {
  low: {
    label: "Sinais pontuais",
    barClass: "bg-[#2DD4BF]",
    badgeClass: "bg-[#015E57]/30 text-[#2DD4BF] border-[#015E57]",
  },
  moderate: {
    label: "Atenção recomendada",
    barClass: "bg-[#14B8A6]",
    badgeClass: "bg-[#015E57]/40 text-[#5EEAD4] border-[#027A71]",
  },
  elevated: {
    label: "Apoio prioritário",
    barClass: "bg-[#027A71]",
    badgeClass: "bg-[#1E3A52] text-[#E2E8F0] border-[#2DD4BF]/50",
  },
};

export function ThermometerQuiz({ articlesBySlug }: ThermometerQuizProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [showResult, setShowResult] = React.useState(false);

  const totalQuestions = THERMOMETER_QUESTIONS.length;
  const currentQuestion = THERMOMETER_QUESTIONS[currentIndex];
  const currentAnswer = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  const answeredCount = Object.keys(answers).length;
  const progressPercent = showResult
    ? 100
    : Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const totalScore = React.useMemo(() => {
    return Object.values(answers).reduce((sum, val) => sum + val, 0);
  }, [answers]);

  function handleSelectOption(score: number) {
    if (!currentQuestion) return;

    const updated = {
      ...answers,
      [currentQuestion.id]: score,
    };
    setAnswers(updated);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  }

  function handleBack() {
    if (showResult) {
      setShowResult(false);
      setCurrentIndex(totalQuestions - 1);
      return;
    }
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  function handleNext() {
    if (currentAnswer === undefined) return;
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  }

  function handleRestart() {
    setAnswers({});
    setCurrentIndex(0);
    setShowResult(false);
  }

  if (showResult) {
    const result = THERMOMETER_RESULTS(totalScore);
    const tierStyle = TIER_META[result.tier];
    const scorePercent = Math.round(
      (result.score / THERMOMETER_MAX_SCORE) * 100
    );
    const haroldoHref = `/haroldo?context=${encodeURIComponent(
      result.haroldoPrompt
    )}`;

    const recommendedArticles = result.recommendedSlugs
      .map((slug) => articlesBySlug[slug])
      .filter((item): item is ThermometerArticleCard => Boolean(item));

    return (
      <div className="space-y-8">
        <Card className="border-[#015E57] bg-[#112536] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E3A52] pb-5">
            <Badge className={tierStyle.badgeClass}>{tierStyle.label}</Badge>
            <span className="text-sm text-[#CBD5E1]">
              Pontuação:{" "}
              <strong className="font-semibold text-white">
                {result.score}
              </strong>{" "}
              de {result.maxScore}
            </span>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {result.title}
            </h2>
            <p className="mt-4 text-base leading-[1.7] text-[#CBD5E1]">
              {result.summary}
            </p>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs text-[#94A3B8]">
              <span>Sinais pontuais</span>
              <span>Desgaste recorrente</span>
              <span>Ambiente hostil</span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-[#021729]"
              role="progressbar"
              aria-valuenow={result.score}
              aria-valuemin={0}
              aria-valuemax={result.maxScore}
              aria-label="Intensidade dos sinais identificados"
            >
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  tierStyle.barClass
                )}
                style={{ width: `${Math.max(4, scorePercent)}%` }}
              />
            </div>
          </div>

          <div className="mt-8 border-t border-[#1E3A52] pt-6">
            <h3 className="text-base font-semibold text-white">
              Caminhos práticos para agora
            </h3>
            <ul className="mt-4 space-y-3">
              {result.guidance.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[#CBD5E1]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2DD4BF]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-[#1E3A52] pt-6 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={haroldoHref}
              className={buttonClasses({
                variant: "primary",
                size: "lg",
                className: "w-full sm:w-auto",
              })}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Levar este contexto para o H.Aroldo
            </Link>

            <Link
              href="/profissionais"
              className={buttonClasses({
                variant: "outline",
                size: "lg",
                className: "w-full sm:w-auto",
              })}
            >
              Conhecer profissionais
            </Link>

            <Button
              variant="ghost"
              size="md"
              onClick={handleRestart}
              className="sm:ml-auto"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Refazer questionário
            </Button>
          </div>

          {result.tier === "elevated" && (
            <div className="mt-6 rounded-lg border border-[#1E3A52] bg-[#021729] p-4 text-sm text-[#CBD5E1]">
              Se você estiver em situação de risco imediato ou crise aguda,{" "}
              <Link
                href="/ajuda-urgente"
                className="font-medium text-[#2DD4BF] underline underline-offset-4 hover:text-white"
              >
                consulte os canais de ajuda urgente
              </Link>{" "}
              disponíveis 24 horas.
            </div>
          )}
        </Card>

        {recommendedArticles.length > 0 && (
          <section aria-labelledby="recommended-articles-heading">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen
                className="h-4 w-4 text-[#2DD4BF]"
                aria-hidden="true"
              />
              <h3
                id="recommended-articles-heading"
                className="text-lg font-semibold text-white"
              >
                Leituras recomendadas para o seu momento
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {recommendedArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/artigos/${article.slug}`}
                  className="group block focus:outline-none"
                >
                  <Card
                    interactive
                    className="flex h-full flex-col justify-between border-[#1E3A52] bg-[#112536] p-6 group-focus-visible:border-[#2DD4BF]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="accent">{article.category}</Badge>
                        {article.readTime && (
                          <span className="text-xs text-[#94A3B8]">
                            {article.readTime}
                          </span>
                        )}
                      </div>
                      <h4 className="mt-4 text-lg font-semibold leading-snug text-white transition-colors group-hover:text-[#2DD4BF]">
                        {article.title}
                      </h4>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#CBD5E1]">
                        {article.excerpt}
                      </p>
                    </div>
                    <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#2DD4BF]">
                      Ler artigo
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="text-xs leading-relaxed text-[#94A3B8]">
          Este termômetro tem finalidade educativa e reflexiva. Ele não substitui
          avaliação psicológica, médica ou jurídica. Suas respostas ficam apenas
          nesta tela e não são salvas em servidor.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-white">
            Pergunta {currentIndex + 1} de {totalQuestions}
          </span>
          <span className="text-xs text-[#94A3B8]">
            {progressPercent}% concluído
          </span>
        </div>

        <div
          className="h-2 w-full overflow-hidden rounded-full bg-[#112536]"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalQuestions}
          aria-label="Progresso do termômetro"
        >
          <div
            className="h-full rounded-full bg-[#2DD4BF] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {currentQuestion && (
        <Card className="border-[#1E3A52] bg-[#112536] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="accent">{currentQuestion.category}</Badge>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8]">
              <ShieldCheck
                className="h-3.5 w-3.5 text-[#2DD4BF]"
                aria-hidden="true"
              />
              100% anônimo
            </span>
          </div>

          <h2 className="mt-5 text-xl font-semibold leading-snug text-white sm:text-2xl">
            {currentQuestion.question}
          </h2>

          <div
            className="mt-7 grid gap-3"
            role="radiogroup"
            aria-label={currentQuestion.question}
          >
            {currentQuestion.options.map((option) => {
              const isSelected = currentAnswer === option.score;
              return (
                <button
                  key={option.label}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectOption(option.score)}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between rounded-lg border-[1.5px] px-4 py-3.5 text-left text-sm font-medium transition-colors sm:text-base",
                    isSelected
                      ? "border-[#2DD4BF] bg-[#015E57]/35 text-white"
                      : "border-[#015E57] bg-[#021729] text-[#E2E8F0] hover:border-[#2DD4BF] hover:bg-[#015E57]/20"
                  )}
                >
                  <span>{option.label}</span>
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                      isSelected
                        ? "border-[#2DD4BF] bg-[#015E57] text-white"
                        : "border-[#1E3A52] bg-transparent"
                    )}
                    aria-hidden="true"
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#1E3A52] pt-5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar
            </Button>

            <div className="flex items-center gap-3">
              {answeredCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleRestart}>
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Reiniciar
                </Button>
              )}

              {currentAnswer !== undefined && (
                <Button variant="primary" size="sm" onClick={handleNext}>
                  {currentIndex === totalQuestions - 1
                    ? "Ver resultado"
                    : "Próxima"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
