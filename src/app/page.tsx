import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Clock,
  ExternalLink,
  MessageCircle,
  Stethoscope,
  Users,
} from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { NewsletterBanner } from "@/components/ui/NewsletterBanner";
import { formatDatePtBr } from "@/lib/utils";

export const revalidate = 300;

const PILLARS = [
  {
    title: "Informação Qualificada",
    description:
      "Artigos claros sobre gaslighting, controle emocional, paternidade e reconstrução da autoestima.",
    href: "/artigos",
    image: "/images/pillar-info.png",
    icon: BookOpen,
    cta: "Ler artigos",
  },
  {
    title: "Escuta com H.Aroldo",
    description:
      "Um assistente de escuta inicial para organizar seus pensamentos em sigilo, no seu próprio ritmo.",
    href: "/haroldo",
    image: "/images/pillar-haroldo.png",
    icon: MessageCircle,
    cta: "Iniciar conversa",
  },
  {
    title: "Relatos Reais",
    description:
      "Histórias anônimas de homens que reconheceram o abuso e encontraram caminhos possíveis de saída.",
    href: "/relatos",
    image: "/images/pillar-relatos.png",
    icon: Users,
    cta: "Ler relatos",
  },
  {
    title: "Rede de Profissionais",
    description:
      "Diretório curado de psicólogos, advogados, psiquiatras e terapeutas preparados para esse atendimento.",
    href: "/profissionais",
    image: "/images/pillar-profissionais.png",
    icon: Stethoscope,
    cta: "Ver diretório",
  },
];

export default async function HomePage() {
  const allArticles = await getAllArticles();
  const featuredArticles = allArticles.slice(0, 4);

  return (
    <div className="bg-[#021729]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#1E3A52]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-calm.png"
            alt="Ambiente sereno ao amanhecer representando acolhimento e clareza"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#021729]/95 via-[#021729]/85 to-[#021729]/60"
            aria-hidden="true"
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-5xl">
              Sua dor é real. Você merece respeito e paz dentro de casa.
            </h1>

            <p className="mt-5 text-base leading-relaxed text-[#CBD5E1] sm:text-lg">
              Um espaço seguro para homens que vivem ou viveram relacionamentos
              abusivos. Aqui você encontra informação clara, escuta sem
              julgamento e caminhos concretos para recuperar sua autonomia.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/haroldo"
                className={buttonClasses({ variant: "primary", size: "lg" })}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Conversar com o H.Aroldo</span>
              </Link>
              <Link
                href="/termometro"
                className={buttonClasses({ variant: "secondary", size: "lg" })}
              >
                <Activity className="h-4 w-4" aria-hidden="true" />
                <span>Fazer o Termômetro de Sinais</span>
              </Link>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-[#94A3B8]">
              Navegação gratuita e anônima. Pressione ESC a qualquer momento para
              sair imediatamente desta página. Em risco físico imediato, acesse{" "}
              <Link
                href="/ajuda-urgente"
                className="text-[#2DD4BF] underline underline-offset-4 hover:text-white"
              >
                Ajuda Urgente
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Section: Você Não Está Sozinho */}
      <section className="border-b border-[#1E3A52]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
              Quatro frentes de apoio
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Você Não Está Sozinho
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#CBD5E1]">
              Escolha por onde começar conforme o seu momento. Cada ferramenta
              foi pensada para respeitar o seu tempo e a sua privacidade.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Link
                  key={pillar.href}
                  href={pillar.href}
                  className="group flex flex-col overflow-hidden rounded-xl border border-[#1E3A52] bg-[#112536] transition-colors hover:border-[#015E57]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#021729]">
                    <Image
                      src={pillar.image}
                      alt={pillar.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#021729]/85 via-[#021729]/30 to-transparent"
                      aria-hidden="true"
                    />
                    <div className="absolute bottom-3 left-4 flex h-9 w-9 items-center justify-center rounded-md border border-[#015E57] bg-[#021729]/90 text-[#2DD4BF]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-[#2DD4BF]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[#CBD5E1]">
                      {pillar.description}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#2DD4BF] group-hover:text-white">
                      <span>{pillar.cta}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: Artigos em Destaque */}
      <section className="border-b border-[#1E3A52]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
                Leitura essencial
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Artigos em Destaque
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#CBD5E1]">
                Textos diretos para ajudar você a identificar padrões abusivos e
                reorganizar sua vida emocional e prática.
              </p>
            </div>

            <Link
              href="/artigos"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#2DD4BF] transition-colors hover:text-white"
            >
              <span>Ver todos os artigos</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {featuredArticles.map((article) => (
              <article
                key={article.slug}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#1E3A52] bg-[#112536] transition-colors hover:border-[#015E57]"
              >
                <Link
                  href={`/artigos/${article.slug}`}
                  className="relative block aspect-[16/9] w-full overflow-hidden bg-[#021729]"
                >
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#021729]/80 via-[#021729]/25 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-3 left-4">
                    <Badge variant="accent">{article.category}</Badge>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
                    <time dateTime={article.publishedAt}>
                      {formatDatePtBr(article.publishedAt)}
                    </time>
                    <span aria-hidden="true">/</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold leading-snug text-white transition-colors group-hover:text-[#2DD4BF]">
                    <Link href={`/artigos/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#CBD5E1]">
                    {article.excerpt}
                  </p>

                  <div className="mt-6 border-t border-[#1E3A52] pt-4">
                    <Link
                      href={`/artigos/${article.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#2DD4BF] transition-colors hover:text-white"
                    >
                      <span>Ler artigo</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <NewsletterBanner
          title="Receba novos textos com privacidade e discrição"
          description="Garantia de privacidade: seu endereço de e-mail fica protegido, nunca é compartilhado e os envios são discretos, sem spam e com descadastro em um clique."
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1E3A52] bg-[#112536]/60 px-6 py-4 text-xs text-[#94A3B8]">
          <span>
            Prefere acompanhar nossos ensaios também pelo Substack?
          </span>
          <a
            href="https://homemabusado.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-[#2DD4BF] transition-colors hover:text-white"
          >
            <span>Acessar homemabusado.substack.com</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
