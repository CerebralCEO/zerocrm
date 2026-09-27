import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";
import { ProfileSheet } from "@/components/profile/profile-sheet";
import { SearchCommand } from "@/components/companies/search-command";
import { CompanyDetailSheet } from "@/components/companies/company-detail-sheet";
import { InvoiceStudio } from "@/components/invoices/invoice-studio";
import { DbHydrate, StoreSync } from "@/components/shell/store-sync";
import { auth } from "@clerk/nextjs/server";
import { loadProfile, loadSnapshot } from "@/db/load";
import { ProfileGate } from "@/components/profile/profile-gate";
import { AUTH_ENABLED } from "@/lib/auth";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  // Live workspace from Neon when DATABASE_URL is set; otherwise the built-in demo data.
  const [snapshot, userId] = await Promise.all([loadSnapshot(), AUTH_ENABLED ? auth().then((a) => a.userId) : Promise.resolve(null)]);
  // Signed-in users complete onboarding once; their profile lives in Neon.
  const profile = snapshot && userId ? await loadProfile(userId) : null;
  return (
    <div className="flex h-dvh overflow-hidden bg-app">
      <DbHydrate snapshot={snapshot} />
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        {children}
      </main>
      {/* App-wide overlays: reachable from every page (⌘K, notifications, deal → company). */}
      <ProfileSheet />
      <SearchCommand />
      <CompanyDetailSheet />
      <InvoiceStudio />
      {AUTH_ENABLED && <ProfileGate profile={profile} required={!!snapshot && !!userId} />}
      <StoreSync mode={snapshot ? "db" : "memory"} loadedAt={snapshot?.loadedAt ?? null} />
    </div>
  );
}
