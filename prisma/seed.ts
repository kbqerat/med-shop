import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CATEGORY_NAMES = ["Gucci", "Nike", "Adidas", "New Era", "Balenciaga"];

type SeedProduct = {
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  category: string;
  accentFrom: string;
  accentTo: string;
  variants: { size: string; stock: number }[];
};

const products: SeedProduct[] = [
  {
    slug: "gucci-gg-canvas-snapback",
    name: "GG Canvas Snapback",
    description:
      "Structured six-panel snapback in tan canvas with logo detailing on the front panel.",
    priceCents: 45000,
    category: "Gucci",
    accentFrom: "#e8d4a0",
    accentTo: "#b8895a",
    variants: [{ size: "Standard", stock: 12 }],
  },
  {
    slug: "gucci-web-stripe-cap",
    name: "Web Stripe Cap",
    description:
      "Cotton cap featuring the brand's signature stripe trim and a leather back strap.",
    priceCents: 48000,
    category: "Gucci",
    accentFrom: "#eee2c9",
    accentTo: "#5a8a5a",
    variants: [{ size: "Standard", stock: 9 }],
  },
  {
    slug: "nike-heritage86-cap",
    name: "Heritage86 Cap",
    description:
      "Adjustable cotton cap with an embroidered logo, built for everyday wear.",
    priceCents: 18000,
    category: "Nike",
    accentFrom: "#eaf1fb",
    accentTo: "#7fa8d9",
    variants: [{ size: "Standard", stock: 40 }],
  },
  {
    slug: "nike-dri-fit-club-cap",
    name: "Dri-FIT Club Cap",
    description:
      "Lightweight structured cap with moisture-wicking fabric for hot days.",
    priceCents: 20000,
    category: "Nike",
    accentFrom: "#dbe4fb",
    accentTo: "#3d4f99",
    variants: [{ size: "Standard", stock: 35 }],
  },
  {
    slug: "adidas-trefoil-cap",
    name: "Trefoil Cap",
    description: "Curved-brim cap in black with an embroidered logo.",
    priceCents: 17000,
    category: "Adidas",
    accentFrom: "#f0f0f0",
    accentTo: "#5c5c5c",
    variants: [{ size: "Standard", stock: 38 }],
  },
  {
    slug: "adidas-baseball-cap",
    name: "Baseball Cap",
    description:
      "Structured 6-panel cap with adjustable strap and mesh underbrim.",
    priceCents: 15000,
    category: "Adidas",
    accentFrom: "#f5f5f0",
    accentTo: "#3d4f99",
    variants: [{ size: "Standard", stock: 30 }],
  },
  {
    slug: "new-era-59fifty-fitted",
    name: "59FIFTY Fitted",
    description: "Fitted structured cap with a flat brim for a classic look.",
    priceCents: 28000,
    category: "New Era",
    accentFrom: "#fbdfc9",
    accentTo: "#d97a3f",
    variants: [
      { size: "S/M", stock: 12 },
      { size: "L/XL", stock: 10 },
    ],
  },
  {
    slug: "new-era-9forty-adjustable",
    name: "9FORTY Adjustable",
    description: "Curved brim adjustable cap with a low-profile crown.",
    priceCents: 23000,
    category: "New Era",
    accentFrom: "#e6e6e6",
    accentTo: "#9a9a9a",
    variants: [{ size: "Standard", stock: 27 }],
  },
  {
    slug: "balenciaga-logo-cap",
    name: "Logo Cap",
    description: "Oversized-fit cap in black cotton with an embroidered logo.",
    priceCents: 55000,
    category: "Balenciaga",
    accentFrom: "#4a4a4a",
    accentTo: "#7a7a7a",
    variants: [{ size: "Standard", stock: 6 }],
  },
  {
    slug: "balenciaga-destroyed-cap",
    name: "Destroyed Cap",
    description: "Distressed-finish cap for a worn-in, vintage look.",
    priceCents: 52000,
    category: "Balenciaga",
    accentFrom: "#9a9a9a",
    accentTo: "#c4c4c4",
    variants: [{ size: "Standard", stock: 5 }],
  },
];

async function main() {
  // Seed the order-number sequence. createOrder increments before use, so 1000
  // here means the first real order is VOLT-1001.
  await prisma.counter.upsert({
    where: { name: "order" },
    update: {},
    create: { name: "order", value: 1000 },
  });

  const categoryIds = new Map<string, string>();

  for (const name of CATEGORY_NAMES) {
    const slug = slugify(name);
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    categoryIds.set(name, category.id);
  }

  for (const { category, variants, ...product } of products) {
    const categoryId = categoryIds.get(category);
    if (!categoryId) throw new Error(`Unknown category: ${category}`);

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...product,
        categoryId,
        variants: {
          deleteMany: {},
          create: variants.map((variant, position) => ({ ...variant, position })),
        },
      },
      create: {
        ...product,
        categoryId,
        variants: {
          create: variants.map((variant, position) => ({ ...variant, position })),
        },
      },
    });
  }
  console.log(`Seeded ${categoryIds.size} categories and ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
