"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
// import { CardContent } from "@/components/ui/card";
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

type Status = "approved" | "rejected" | "pending" | "claimed";
type KYC = "verified" | "failed" | "pending";

interface LoanDetails {
  amount: string;
  interestRate: string;
  tenure: string;
  emiAmount: string;
}

interface ApplicantDetails {
  name: string;
  panNumber: string;
  phoneNumber: string;
}

interface ConfirmationCardProps {
  creditScore: number;
  kycStatus: KYC;
  loanStatus: Status;
  loanRejectionReason?: string;
  loanDetails: LoanDetails;
  applicantDetails: ApplicantDetails;
}

const statusColor = {
  approved: "bg-green-200 text-green-800",
  rejected: "bg-red-200 text-red-800",
  pending: "bg-yellow-200 text-yellow-800",
  claimed: "bg-blue-200 text-blue-800",
  verified: "bg-green-200 text-green-800",
  failed: "bg-red-200 text-red-800",
};

export const ConfirmationCard = ({
  creditScore,
  kycStatus,
  loanStatus,
  loanDetails,
  applicantDetails,
  loanRejectionReason,
}: ConfirmationCardProps) => {
  const isAutoRejected = kycStatus === "failed" || creditScore < 350;
  const initialLoanStatus: Status = isAutoRejected ? "rejected" : loanStatus;
  const finalRejectionReason =
    initialLoanStatus === "rejected" ? loanRejectionReason || "Unknown" : null;

  // const [claimed, setClaimed] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [currentStatus, setCurrentStatus] = useState<Status>(initialLoanStatus);

  const handleConfirmClaim = () => {
    // setClaimed(true);
    setCurrentStatus("claimed");
    setClaimMessage(
      "Thank you! We will get in touch with you for more details.",
    );
    setShowDialog(false);
  };

  // Credit Score Meter Logic
  const minScore = 400;
  const maxScore = 900;
  const scorePercent = Math.min(
    100,
    Math.max(0, ((creditScore - minScore) / (maxScore - minScore)) * 100),
  );
  const isPoorScore = creditScore < 350;

  return (
    <Card className="w-full max-w-3xl shadow-xl rounded-2xl p-4 space-y-6">
      {/* Header with Title and Claim Button */}
      <div className="flex justify-between items-center px-4 pt-4">
        <CardTitle className="text-2xl">Loan Summary</CardTitle>
        <Button
          variant="default"
          size="lg"
          className="rounded-xl"
          onClick={() => setShowDialog(true)}
          disabled={currentStatus === "rejected" || currentStatus === "claimed"}
        >
          Claim
        </Button>
      </div>

      {/* Loan Status at Top */}
      <div className="flex flex-col gap-2 border p-4 rounded-xl bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Loan Status:</span>
          <Badge className={`text-lg px-4 py-1 ${statusColor[currentStatus]}`}>
            {currentStatus.toUpperCase()}
          </Badge>
        </div>
        {currentStatus === "rejected" && (
          <div className="text-sm text-red-600 font-medium pl-1">
            Reason: {finalRejectionReason}
          </div>
        )}
        {claimMessage && (
          <div className="text-sm text-green-600 font-medium pt-2">
            {claimMessage}
          </div>
        )}
      </div>

      {/* Claim Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to claim this loan?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              No
            </Button>
            <Button variant="default" onClick={handleConfirmClaim}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loan Details Section */}
      <div className="border rounded-xl p-4 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Loan Details</h3>
        <table className="w-full text-left table-auto">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-2 font-medium">Amount</td>
              <td>{loanDetails.amount}</td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Interest Rate</td>
              <td>{loanDetails.interestRate}</td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Tenure</td>
              <td>{loanDetails.tenure}</td>
            </tr>
            <tr>
              <td className="py-2 font-medium">EMI Amount</td>
              <td className="font-bold">{loanDetails.emiAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Credit Score Meter */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Credit Score Meter</h3>
        <div className="relative w-full h-4 bg-gray-200 rounded-full">
          <div
            className={`absolute top-0 h-4 rounded-full ${
              isPoorScore ? "bg-red-500" : "bg-blue-500"
            }`}
            style={{ width: `${scorePercent}%` }}
          />
          <div
            className={`absolute w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent ${
              isPoorScore ? "border-t-red-600" : "border-t-black"
            }`}
            style={{ left: `calc(${scorePercent}% - 8px)`, top: "20px" }}
          />
          <div className="absolute top-6 left-0 w-full flex justify-between text-xs font-medium">
            <span>400</span>
            <span>900</span>
          </div>
        </div>
        <p
          className={`text-center font-medium ${
            isPoorScore ? "text-red-600" : "text-gray-700"
          }`}
        >
          Your Score: {creditScore}
        </p>
      </div>

      {/* KYC and Credit Score Info */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 border rounded-xl p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Credit Score</h3>
          <p
            className={`text-3xl font-bold ${isPoorScore ? "text-red-600" : "text-black"}`}
          >
            {creditScore}
          </p>
        </div>

        <div className="flex-1 border rounded-xl p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-2">KYC Status</h3>
          <Badge className={`text-lg px-4 py-1 ${statusColor[kycStatus]}`}>
            {kycStatus.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Applicant Details Section */}
      <div className="border rounded-xl p-4 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Applicant Details</h3>
        <table className="w-full text-left table-auto">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-2 font-medium">Name</td>
              <td>{applicantDetails.name}</td>
            </tr>
            <tr>
              <td className="py-2 font-medium">PAN Number</td>
              <td>{applicantDetails.panNumber}</td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Phone Number</td>
              <td>{applicantDetails.phoneNumber}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};
