import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Homem Abusado | Apoio, Informação e Acolhimento",
    short_name: "Homem Abusado",
    description:
      "Hub gratuito de informação qualificada, escuta sigilosa, ferramentas práticas e rede de apoio para homens em relacionamentos abusivos.",
    start_url: "/",
    display: "standalone",
    background_color: "#021729",
    theme_color: "#021729",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
