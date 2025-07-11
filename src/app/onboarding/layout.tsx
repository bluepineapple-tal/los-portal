import { PageTitle } from "@/components/contexts/page-title-provider";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PageTitle title="Onboarding" /> {/* sets context on mount */}
      {children}
    </>
  );
}
