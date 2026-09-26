import type { Metadata } from "next";
import { Toolbar } from "@/components/companies/toolbar";
import { CompaniesTable } from "@/components/companies/companies-table";
import { CompanyDetailSheet } from "@/components/companies/company-detail-sheet";
import { NewCompanyDialog } from "@/components/companies/new-company-dialog";
import { SearchCommand } from "@/components/companies/search-command";

export const metadata: Metadata = {
  title: "Companies · ZeroCRM",
};

export default function CompaniesPage() {
  return (
    <>
      <Toolbar />
      <CompaniesTable />
      <CompanyDetailSheet />
      <NewCompanyDialog />
      <SearchCommand />
    </>
  );
}
