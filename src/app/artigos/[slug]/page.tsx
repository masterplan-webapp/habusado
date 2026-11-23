import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, Calendar, Clock, MessageCircle, User } from "lucide-react";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { buildCanonicalUrl, getSiteUrl } from "@/lib/site-url";
import { formatDatePtBr } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { NewsletterBanner } from "@/components/ui/NewsletterBanner";
import { ArticleReader } from "@/components/articles/ArticleReader";

export const dynamicParams = true;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artigo não encontrado",
    };
  }

  const canonicalUrl = buildCanonicalUrl(`/artigos/${article.meta.slug}`);
  const imageUrl = article.meta.coverImage.startsWith("http")
    ? article.meta.coverImage
    : `${getSiteUrl()}${article.meta.coverImage}`;

  return {
    title: article.meta.title,
    description: article.meta.excerpt,
    keywords: article.meta.tags,
    authors: [{ name: article.meta.author }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      url: canonicalUrl,
      title: article.meta.title,
      description: article.meta.excerpt,
      publishedTime: article.meta.publishedAt,
      section: article.meta.category,
      tags: article.meta.tags,
      images: [
        {
          url: imageUrl,
          width: 1600,
          height: 900,
          alt: article.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.meta.title,
      description: article.meta.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function ArtigoSlugPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { meta, content } = article;
  const siteUrl = getSiteUrl();
  const articleUrl = buildCanonicalUrl(`/artigos/${meta.slug}`);
  const coverUrl = meta.coverImage.startsWith("http")
    ? meta.coverImage
    : `${siteUrl}${meta.coverImage}`;

  const articleJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: meta.title,
      description: meta.excerpt,
      image: [coverUrl],
      datePublished: meta.publishedAt,
      dateModified: meta.publishedAt,
      inLanguage: "pt-BR",
      articleSection: meta.category,
      keywords: meta.tags.join(", "),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": articleUrl,
      },
      author: {
        "@type": "Person",
        name: meta.author,
        ...(meta.authorCredentials ? { jobTitle: meta.authorCredentials } : {}),
      },
      publisher: {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Homem Abusado",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Início",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Artigos",
          item: `${siteUrl}/artigos`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: meta.title,
          item: articleUrl,
        },
      ],
    },
  ];

  return (
    <article className="bg-[#021729]">
      <JsonLd data={articleJsonLd} />
      <header className="border-b border-[#1E3A52]">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/artigos"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#2DD4BF] transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Voltar para todos os artigos</span>
          </Link>

          <div className="mb-4">
            <Badge variant="accent">{meta.category}</Badge>
          </div>

          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {meta.title}
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-[#CBD5E1]">
            {meta.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#1E3A52] pt-5 text-sm text-[#94A3B8]">
            <span className="inline-flex flex-wrap items-center gap-2">
              <User className="h-4 w-4 text-[#2DD4BF]" aria-hidden="true" />
              <span className="text-[#CBD5E1]">{meta.author}</span>
              {meta.authorCredentials && (
                <span className="rounded-md border border-[#1E3A52] bg-[#112536] px-2 py-0.5 text-xs text-[#2DD4BF]">
                  {meta.authorCredentials}
                </span>
              )}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#2DD4BF]" aria-hidden="true" />
              <time dateTime={meta.publishedAt}>
                {formatDatePtBr(meta.publishedAt)}
              </time>
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#2DD4BF]" aria-hidden="true" />
              <span>{meta.readTime}</span>
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#1E3A52] bg-[#112536]">
          <Image
            src={meta.coverImage}
            alt={meta.title}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#021729]/65 via-[#021729]/20 to-transparent"
            aria-hidden="true"
          />
        </div>

        <ArticleReader>
          <MDXRemote source={content} />
        </ArticleReader>

        {meta.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-[#1E3A52] pt-6">
            <span className="mr-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
              Temas:
            </span>
            {meta.tags.map((tag) => (
              <Badge key={tag} variant="neutral">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {meta.authorBio && (
          <aside
            aria-label="Sobre o autor"
            className="mt-8 rounded-xl border border-[#1E3A52] bg-[#112536] p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#2DD4BF]">
              Sobre quem escreveu
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold text-white">
                {meta.author}
              </p>
              {meta.authorCredentials && (
                <span className="rounded-md border border-[#015E57]/60 bg-[#021729] px-2.5 py-0.5 text-xs text-[#2DD4BF]">
                  {meta.authorCredentials}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
              {meta.authorBio}
            </p>
          </aside>
        )}

        <div className="mt-10 flex flex-col justify-between gap-6 rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-xl">
            <h2 className="text-lg font-semibold text-white">
              Esse texto lembrou situações que você tem vivido?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
              Você pode organizar o que está sentindo em uma conversa privada
              com o H.Aroldo ou responder ao Termômetro de Sinais para avaliar
              seu momento atual com calma.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/haroldo"
              className={buttonClasses({ variant: "primary", size: "md" })}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>Falar com o H.Aroldo</span>
            </Link>
            <Link
              href="/termometro"
              className={buttonClasses({ variant: "secondary", size: "md" })}
            >
              <span>Termômetro de Sinais</span>
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <NewsletterBanner
            title="Receba novos textos com discrição"
            description="Enviamos novos artigos sobre limites, saúde emocional e reconstrução direto no seu e-mail, sem expor seus dados."
          />
        </div>
      </div>
    </article>
  );
}
