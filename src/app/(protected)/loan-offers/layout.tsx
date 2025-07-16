import { PageTitle } from "@/components/contexts/page-title-provider";

export default function LoanOffersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PageTitle title="Loan Offers" /> {/* sets context on mount */}
      {children}
    </>
  );
}
