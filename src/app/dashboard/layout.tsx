import { PageTitle } from "@/components/contexts/page-title-provider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PageTitle title="Dashboard" /> {/* sets context on mount */}
      {children}
    </>
  );
}
