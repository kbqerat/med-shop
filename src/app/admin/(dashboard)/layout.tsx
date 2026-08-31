import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutIcon } from "@/components/icons";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <aside className="flex flex-shrink-0 flex-col border-b border-surface-border bg-surface lg:w-60 lg:border-b-0 lg:border-r lg:p-6 print:hidden">
        <div className="flex items-center justify-between gap-4 px-4 py-3 lg:p-0">
          <Link
            href="/admin/products"
            className="text-xl font-bold tracking-tight"
          >
            Med Shop
            <span className="ml-1.5 text-sm font-medium text-muted">Admin</span>
          </Link>

          <form action={logout} className="lg:hidden">
            <button
              type="submit"
              aria-label="Déconnexion"
              className="flex items-center rounded-lg p-2 text-muted transition-colors hover:bg-background hover:text-foreground"
            >
              <LogoutIcon className="h-5 w-5" />
            </button>
          </form>
        </div>

        <AdminNav />

        <form action={logout} className="hidden lg:block">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-background hover:text-foreground"
          >
            <LogoutIcon className="h-5 w-5" />
            Déconnexion
          </button>
        </form>
      </aside>

      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 print:p-0">
        {children}
      </main>
    </div>
  );
}
