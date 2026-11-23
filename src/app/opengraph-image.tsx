import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Homem Abusado | Apoio, Informação e Acolhimento";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#021729",
          padding: "72px 80px",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
          borderTop: "10px solid #015E57",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
            }}
          >
            h/a
          </div>
          <div
            style={{
              fontSize: "18px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#2DD4BF",
            }}
          >
            homem abusado
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "960px",
          }}
        >
          <div
            style={{
              fontSize: "54px",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#FFFFFF",
            }}
          >
            Informação clara, escuta sigilosa e apoio para homens em
            relacionamentos abusivos.
          </div>
          <div
            style={{
              fontSize: "24px",
              lineHeight: 1.5,
              color: "#CBD5E1",
            }}
          >
            Artigos, Termômetro de Sinais, H.Aroldo, Plano de Segurança, Guia de
            Direitos e Diretório de Profissionais no Brasil.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #1E3A52",
            paddingTop: "24px",
            fontSize: "20px",
            color: "#94A3B8",
          }}
        >
          <span>Gratuito, sigiloso e sem julgamento</span>
          <span style={{ color: "#2DD4BF" }}>Emergência: CVV 188 | PM 190</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
