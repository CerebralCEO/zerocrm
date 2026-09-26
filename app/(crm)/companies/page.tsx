import type { Metadata } from "next";
import { Toolbar } from "@/components/companies/toolbar";
import { CompaniesTable } from "@/components/companies/companies-table";
import { NewCompanyDialog } from "@/components/companies/new-company-dialog";

export const metadata: Metadata = {
  title: "Companies · ZeroCRM",
};

export default function CompaniesPage() {
  return (
    <>
      <Toolbar />
      <CompaniesTable />
      <NewCompanyDialog />
    </>
  );
}
