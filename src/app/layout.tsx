import type { Metadata } from "next";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { SuperTokensProvider } from "@/components/contexts/supertokensProvider";
import { ThemeProvider } from "@/components/contexts/theme-provider";
import FooterSection from "@/components/sections/footer/default";
import NavbarSection from "@/components/sections/navbar/default";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LOS Lender Portal",
  description: "Loan Origination System Lender Portal",
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
            <NavbarSection />
            <div className="w-full max-w-screen-xl mx-auto p-5">{children}</div>
            <FooterSection />
          </ThemeProvider>
        </SuperTokensProvider>
      </body>
    </html>
  );
}
