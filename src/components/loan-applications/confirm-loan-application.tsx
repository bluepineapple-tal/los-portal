"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  // DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { KycStatus, applicationStatusEnum } from "./loan-application.schema";

export interface ConfirmationCardProps {
  creditScore: number;
  kycStatus: KycStatus;
  loanStatus: typeof applicationStatusEnum._type;
  loanRejectionReason?: string;

  loanDetails: {
    amount: number; // use numbers, not strings
    interestRate: number; // e.g. 12.5
    tenureMonths: number;
    emiAmount: number;
  };

  applicant: {
    name: string;
    panNumber: string;
    phoneNumber: string;
    monthlyIncome?: number;
    sourceOfIncome?: string;
  };
}

/* StatusBadge ----------------------------------------------------------- */
const statusStyles: Record<string, string> = {
  approved: "bg-green-200 text-green-800",
  rejected: "bg-red-200 text-red-800",
  pending: "bg-yellow-200 text-yellow-800",
  claimed: "bg-blue-200 text-blue-800",
  verified: "bg-green-200 text-green-800",
  failed: "bg-red-200 text-red-800",
};

function StatusBadge({ value }: Readonly<{ value: string }>) {
  return (
    <Badge className={`px-4 py-1 text-sm ${statusStyles[value]}`}>
      {value.toUpperCase()}
    </Badge>
  );
}

/* Credit score meter ---------------------------------------------------- */
function CreditScoreMeter({ score }: Readonly<{ score: number }>) {
  const pct = Math.min(100, Math.max(0, ((score - 400) / 500) * 100));
  const poor = score < 350;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Credit Score Meter</h3>
      <div className="relative h-4 w-full rounded-full bg-gray-200">
        <div
          className={`h-4 rounded-full absolute top-0 ${poor ? "bg-red-500" : "bg-blue-500"}`}
          style={{ width: `${pct}%` }}
        />
        <div
          className={`absolute h-0 w-0 border-l-8 border-r-8 border-t-8 border-transparent ${poor ? "border-t-red-600" : "border-t-black"}`}
          style={{ left: `calc(${pct}% - 8px)`, top: "20px" }}
        />
        <div className="absolute top-6 flex w-full justify-between text-xs font-medium">
          <span>400</span>
          <span>900</span>
        </div>
      </div>
      <p
        className={`text-center font-medium ${poor ? "text-red-600" : "text-gray-700"}`}
      >
        Your score: {score}
      </p>
    </div>
  );
}

/* Table helpers --------------------------------------------------------- */
const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function LoanDetailsTable({
  l,
}: Readonly<{ l: ConfirmationCardProps["loanDetails"] }>) {
  return (
    <table className="w-full table-auto divide-y divide-gray-200">
      <thead className="sr-only">
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" className="py-2 font-medium text-left">
            Amount
          </th>
          <td>{currency.format(l.amount)}</td>
        </tr>
        <tr>
          <th scope="row" className="py-2 font-medium text-left">
            Interest rate
          </th>
          <td>{l.interestRate}%</td>
        </tr>
        <tr>
          <th scope="row" className="py-2 font-medium text-left">
            Tenure
          </th>
          <td>{l.tenureMonths} months</td>
        </tr>
        <tr>
          <th scope="row" className="py-2 font-medium text-left">
            EMI amount
          </th>
          <td>{currency.format(l.emiAmount)}</td>
        </tr>
      </tbody>
    </table>
  );
}

function ApplicantTable({
  a,
}: Readonly<{ a: ConfirmationCardProps["applicant"] }>) {
  return (
    <table className="w-full table-auto divide-y divide-gray-200">
      <tbody>
        <tr>
          <td className="py-2 font-medium">Name</td>
          <td>{a.name}</td>
        </tr>
        <tr>
          <td className="py-2 font-medium">PAN</td>
          <td>{a.panNumber}</td>
        </tr>
        <tr>
          <td className="py-2 font-medium">Phone</td>
          <td>{a.phoneNumber}</td>
        </tr>
        {a.monthlyIncome && (
          <tr>
            <td className="py-2 font-medium">Monthly income</td>
            <td>{currency.format(a.monthlyIncome)}</td>
          </tr>
        )}
        {a.sourceOfIncome && (
          <tr>
            <td className="py-2 font-medium">Income source</td>
            <td>{a.sourceOfIncome}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export function ConfirmationCard(props: Readonly<ConfirmationCardProps>) {
  const {
    creditScore,
    kycStatus,
    loanStatus,
    loanDetails,
    applicant,
    loanRejectionReason,
  } = props;

  const autoRejected = kycStatus === "failed" || creditScore < 350;
  const initialStatus = autoRejected ? "rejected" : loanStatus;

  /* local state ---------------------------------------------------- */
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  function confirmClaim() {
    setStatus("claimed");
    setMessage("Thank you! We will get in touch with you for more details.");
    setShow(false);
  }

  return (
    <Card className="w-full max-w-3xl space-y-6 rounded-2xl p-4 shadow-xl">
      {/* header ------------------------------------------------------ */}
      <div className="flex items-center justify-between px-4 pt-4">
        <CardTitle className="text-2xl">Loan summary</CardTitle>

        <Button
          disabled={status === "rejected" || status === "claimed"}
          onClick={() => setShow(true)}
        >
          Claim
        </Button>
      </div>

      {/* status panel ------------------------------------------------ */}
      <div className="space-y-2 rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Loan status:</span>
          <StatusBadge value={status} />
        </div>

        {status === "rejected" && (
          <p className="pl-1 text-sm font-medium text-red-600">
            Reason: {loanRejectionReason ?? "Unknown"}
          </p>
        )}
        {message && (
          <p className="pt-2 text-sm font-medium text-green-600">{message}</p>
        )}
      </div>

      {/* claim dialog ------------------------------------------------ */}
      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm claim?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShow(false)}>
              No
            </Button>
            <Button onClick={confirmClaim}>Yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* loan details ----------------------------------------------- */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Loan details</h3>
        <LoanDetailsTable l={loanDetails} />
      </div>

      {/* credit score + kyc ----------------------------------------- */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1 rounded-xl border bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">Credit score</h3>
          <p className="text-3xl font-bold">{creditScore}</p>
        </div>

        <div className="flex-1 rounded-xl border bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">KYC status</h3>
          <StatusBadge value={kycStatus} />
        </div>
      </div>

      <CreditScoreMeter score={creditScore} />

      {/* applicant --------------------------------------------------- */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Applicant details</h3>
        <ApplicantTable a={applicant} />
      </div>
    </Card>
  );
}
