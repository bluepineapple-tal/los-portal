// app/page.tsx or src/pages/index.tsx (depending on Next.js version)
// OR a component like src/components/HomePage.tsx

"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen justify-between bg-gray-50">
      {/* Header */}
      <header className="w-full p-6 border-b bg-white flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">LOS Portal</h1>
        <Link href="/auth">
          <Button variant="default">Login</Button>
        </Link>
      </header>

      {/* Main Content */}
      <section
        className="flex flex-col items-center justify-center flex-1 px-4 py-10 space-y-8"
        style={{
          backgroundImage: "url('')",
        }}
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          Welcome to Consumer Loan Origination System
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          {[
            {
              title: "Instant Loan Eligibility",
              description:
                "We quickly assess your credit profile and KYC to determine loan eligibility.",
            },
            {
              title: "Seamless KYC & Verification",
              description:
                "Streamlined digital verification for fast onboarding and compliance.",
            },
            {
              title: "Track & Claim Disbursement",
              description:
                "Know your loan status at each step, and claim disbursement easily.",
            },
          ].map((item, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white border-t py-6 px-4 text-center text-sm text-gray-600">
        <div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto">
          <div>
            &copy; {new Date().getFullYear()} LOS Platform. All rights reserved.
          </div>
          <div className="space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
