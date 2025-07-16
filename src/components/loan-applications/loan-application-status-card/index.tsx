"use client";

import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { LoanApplicationDTO } from "../loan-application.schema";
import { currency, StatusBadge } from "./ui-snippets";
import { CreditScoreMeter } from "./credit-score-meter";

interface Props {
  app: LoanApplicationDTO;
  creditScore?: number; // will be undefined until external check arrives
  kycStatus?: string;
  note?: string;
}

/* map BE → FE labels --------------------------------------------------- */
function statusLabel(s: string) {
  switch (s) {
    case "draft":
      return "Draft";
    case "submitted":
      return "Submitted";
    case "under_review":
      return "Under review";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "escalated":
      return "Escalated";
    default:
      return s;
  }
}

export function LoanApplicationStatusCard({
  app,
  creditScore,
  kycStatus,
  note,
}: Readonly<Props>) {
  const status = statusLabel(app.status);
  const offer = app.selectedOffer;
  const showNote =
    note && (app.status === "rejected" || app.status === "under_review");

  return (
    <Card className="w-full max-w-3xl space-y-6 rounded-2xl p-4 shadow-xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-2xl">Loan summary</CardTitle>
        <StatusBadge value={status.toLowerCase()} />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Loan details ------------------------------------------------ */}
        {offer && (
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Loan details</h3>
            <table className="w-full divide-y text-sm">
              <thead className="sr-only">
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 font-medium">Amount</td>
                  <td>{currency.format(app.requested_amount)}</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Interest rate</td>
                  <td>{offer.interest_rate}%</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Tenure</td>
                  <td>{offer.tenure_months} months</td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        {/* Credit / KYC panel ---------------------------------------- */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 rounded-xl border bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Credit score</h3>
            {creditScore ? (
              <CreditScoreMeter score={creditScore} />
            ) : (
              <p className="text-muted-foreground text-sm">Pending&nbsp;…</p>
            )}
          </div>

          <div className="flex-1 rounded-xl border bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">KYC status</h3>
            <StatusBadge value={kycStatus ?? "pending"} />
          </div>
        </div>

        {/* Applicant -------------------------------------------------- */}
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">Applicant details</h3>
          <table className="w-full divide-y text-sm">
            <thead className="sr-only">
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1 font-medium">Name</td>
                <td>
                  {app.consumer.user.first_name} {app.consumer.user.last_name}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-medium">PAN</td>
                <td>{app.consumer.pan_number}</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Phone</td>
                <td>{app.consumer.user.phone}</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Monthly income</td>
                <td>{currency.format(app.monthly_income)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {showNote && <p className="text-sm font-medium text-red-600">{note}</p>}
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        Updated&nbsp;
        {new Date(app.updated_at).toLocaleString()}
      </CardFooter>
    </Card>
  );
}
