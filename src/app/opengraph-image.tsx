import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "#0a0a0a",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 130,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            display: "flex",
            alignItems: "center",
          }}
        >
          Med Shop
        </div>
        <div style={{ marginTop: 24, fontSize: 46, color: "#d4d4d4" }}>
          {SITE.tagline}
        </div>
        <div
          style={{
            marginTop: 56,
            fontSize: 30,
            color: SITE.themeColor,
            fontWeight: 600,
          }}
        >
          Authentic caps · Cash on delivery across Morocco
        </div>
      </div>
    ),
    size
  );
}
