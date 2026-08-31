"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoxIcon, ReceiptIcon, TagIcon } from "@/components/icons";

const LINKS = [
  { href: "/admin/products", label: "Produits", icon: BoxIcon },
  { href: "/admin/categories", label: "Catégories", icon: TagIcon },
  { href: "/admin/orders", label: "Commandes", icon: ReceiptIcon },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto px-2 pb-2 lg:mt-8 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname?.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-shrink-0 items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-accent/10 text-accent"
                : "text-foreground hover:bg-background"
            }`}
          >
            <Icon className={`h-5 w-5 ${active ? "text-accent" : "text-muted"}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
