import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: SITE.themeColor,
          color: "#ffffff",
          fontSize: 340,
          fontWeight: 800,
          letterSpacing: "-0.05em",
        }}
      >
        k
      </div>
    ),
    size
  );
}
