import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#021729",
          border: "8px solid #015E57",
          borderRadius: "36px",
          fontFamily: "sans-serif",
          fontSize: "76px",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          color: "#FFFFFF",
        }}
      >
        <span>h</span>
        <span style={{ color: "#2DD4BF" }}>/</span>
        <span>a</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
