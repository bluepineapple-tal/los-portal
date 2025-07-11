import type { Metadata } from "next";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { AppSidebar } from "@/components/app-sidebar";
import AuthProvider from "@/components/contexts/auth-provider";
import { SuperTokensProvider } from "@/components/contexts/supertokensProvider";
import { ThemeProvider } from "@/components/contexts/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { PageTitleProvider } from "@/components/contexts/page-title-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LOS Portal",
  description: "Loan Origination System Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background antialiased`}
      >
        <SuperTokensProvider>
          <ThemeProvider>
            <NextTopLoader />

            <AuthProvider>
              <SidebarProvider>
                <AppSidebar variant="inset" />

                <SidebarInset>
                  <PageTitleProvider>
                    <SiteHeader />

                    <div className="flex flex-1 flex-col">{children}</div>
                  </PageTitleProvider>
                </SidebarInset>
              </SidebarProvider>
            </AuthProvider>

            <Toaster />
          </ThemeProvider>
        </SuperTokensProvider>
      </body>
    </html>
  );
}
