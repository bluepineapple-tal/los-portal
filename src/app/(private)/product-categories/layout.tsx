import { PageTitle } from "@/components/contexts/page-title-provider";

export default function ProductCategoriesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PageTitle title="Product Categories" /> {/* sets context on mount */}
      {children}
    </>
  );
}
