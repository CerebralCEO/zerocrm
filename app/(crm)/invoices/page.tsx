import type { Metadata } from "next";
import { InvoicesToolbar, InvoicesView } from "@/components/invoices/invoices-view";
import { NewInvoiceDialog } from "@/components/invoices/new-invoice-dialog";

export const metadata: Metadata = {
  title: "Invoices · ZeroCRM",
};

export default function InvoicesPage() {
  return (
    <>
      <InvoicesToolbar />
      <InvoicesView />
      <NewInvoiceDialog />
    </>
  );
}
