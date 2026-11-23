import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/site-url";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Homem Abusado | Apoio, Informação e Acolhimento",
    template: "%s | Homem Abusado",
  },
  description:
    "Espaço seguro de acolhimento, informação e reconstrução para homens que vivem ou viveram relacionamentos abusivos no Brasil.",
  applicationName: "Homem Abusado",
  keywords: [
    "homem abusado",
    "relacionamento abusivo contra homens",
    "abuso psicológico masculino",
    "gaslighting",
    "alienação parental",
    "apoio para homens",
    "saúde mental masculina",
    "terapia para homens",
  ],
  authors: [{ name: "Fábio Zacari" }, { name: "Equipe Homem Abusado" }],
  creator: "Homem Abusado",
  publisher: "Homem Abusado",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Homem Abusado",
    title: "Homem Abusado | Apoio, Informação e Acolhimento",
    description:
      "Informação clara, escuta sigilosa com o H.Aroldo, Termômetro de Sinais, relatos anônimos e diretório de profissionais para homens em relacionamentos abusivos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Homem Abusado | Apoio, Informação e Acolhimento",
    description:
      "Espaço gratuito e sigiloso de informação, escuta e apoio para homens em relacionamentos abusivos.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

const GLOBAL_SCHEMA = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Homem Abusado",
    url: siteUrl,
    description:
      "Hub brasileiro gratuito de informação qualificada, escuta sigilosa e apoio para homens que vivem ou viveram relacionamentos abusivos.",
    sameAs: ["https://homemabusado.substack.com"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Homem Abusado",
    inLanguage: "pt-BR",
    publisher: { "@id": `${siteUrl}/#organization` },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-[#021729] text-white antialiased">
        <JsonLd data={GLOBAL_SCHEMA} />
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-PL6VCBGV"
          strategy="afterInteractive"
        />
        <Script id="google-tag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>
        <a
          href="#conteudo-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#015E57] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Pular para o conteúdo principal
        </a>
        <Header />
        <main id="conteudo-principal" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
