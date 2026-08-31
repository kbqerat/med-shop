import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";

export const alt = "Product preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  const name = product?.name ?? SITE.name;
  const brand = product?.category.name ?? "";
  const price = product ? formatPrice(product.priceCents) : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0a0a0a",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            display: "flex",
            alignItems: "center",
          }}
        >
          Med Shop
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {brand ? (
            <div
              style={{
                fontSize: 30,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#a3a3a3",
              }}
            >
              {brand}
            </div>
          ) : null}
          <div
            style={{
              marginTop: 16,
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            {name}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 52, fontWeight: 700, color: SITE.themeColor }}>
            {price}
          </div>
          <div style={{ fontSize: 26, color: "#d4d4d4" }}>
            Cash on delivery · Morocco
          </div>
        </div>
      </div>
    ),
    size
  );
}
