import { PageTitle } from "@/components/contexts/page-title-provider";

export default function LoanApplicationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PageTitle title="Loan Applications" /> {/* sets context on mount */}
      {children}
    </>
  );
}
