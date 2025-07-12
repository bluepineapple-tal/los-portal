import { PageTitle } from "@/components/contexts/page-title-provider";

export default function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PageTitle title="Users" /> {/* sets context on mount */}
      {children}
    </>
  );
}
