import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";
import { ProfileSheet } from "@/components/profile/profile-sheet";
import { SearchCommand } from "@/components/companies/search-command";
import { CompanyDetailSheet } from "@/components/companies/company-detail-sheet";
import { InvoiceStudio } from "@/components/invoices/invoice-studio";

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-app">
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
    </div>
  );
}
