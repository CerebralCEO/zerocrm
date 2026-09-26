import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";
import { ProfileSheet } from "@/components/profile/profile-sheet";

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-app">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        {children}
      </main>
      <ProfileSheet />
    </div>
  );
}
