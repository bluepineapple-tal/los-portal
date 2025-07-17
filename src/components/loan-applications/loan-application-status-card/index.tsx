"use client";

import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { LoanApplicationDTO } from "../loan-application.schema";
import {
  currency,
  FormatNumber,
  StatusBadge,
  VerdictBadge,
} from "./ui-snippets";
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

  /* interest calc -------------------------------------------------- */
  const loanAmount = Number(app.requested_amount);
  const rateAnnual = Number(offer?.interest_rate ?? 0); // %
  const tenure = Number(offer?.tenure_months ?? 1); // months
  const fee = Number(offer?.processing_fee ?? 0);

  const interestPerMonth = rateAnnual / 12;
  const applicableInterest = interestPerMonth * tenure; // %
  const interestAmt = loanAmount * (applicableInterest / 100);
  const finalAmount = loanAmount + interestAmt + fee;
  const emi = finalAmount / tenure;

  /* AML quick verdict --------------------------------------------- */
  const amlVerdict =
    // @ts-expect-error unknown
    app.externalChecks?.aml?.action_required ?? app.externalChecks?.aml?.status; // fallback
  // @ts-expect-error unknown
  const amlRisk = app.externalChecks?.aml?.risk_category;
  const blockCls =
    "rounded-xl border bg-white p-4 shadow-sm flex flex-col items-center text-center";

  const showClaim = app.status === "approved";
  const showNote =
    note && (app.status === "rejected" || app.status === "under_review");

  return (
    <Card className="w-full max-w-3xl space-y-6 rounded-2xl p-4 shadow-xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-2xl">Loan Summary</CardTitle>
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
                <tr>
                  <td className="py-1 font-medium">EMI</td>
                  <td className="font-semibold">{currency.format(emi)}</td>
                </tr>
              </tbody>
            </table>

            {/*interest breakdown ---------------------------------- */}
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">
                View interest calculation
              </summary>
              <table className="mt-2 w-full divide-y text-sm">
                <thead className="sr-only">
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1">Loan amount</td>
                    <td>{currency.format(loanAmount)}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Processing fee</td>
                    <td>{currency.format(fee)}</td>
                  </tr>
                  <tr>
                    <td className="py-1">
                      Effective interest&nbsp;
                      <span className="text-muted-foreground">
                        ({FormatNumber(applicableInterest, 2)}%)
                      </span>
                    </td>
                    <td>{currency.format(interestAmt)}</td>
                  </tr>
                  <tr className="font-semibold">
                    <td className="py-1">Grand total</td>
                    <td>{currency.format(finalAmount)}</td>
                  </tr>
                  <tr className="font-semibold">
                    <td className="py-1">
                      EMI&nbsp;
                      <span className="text-muted-foreground">({tenure}×)</span>
                    </td>
                    <td>{currency.format(emi)}</td>
                  </tr>
                </tbody>
              </table>
            </details>
          </section>
        )}

        {/* Credit / KYC panel ---------------------------------------- */}
        <div className="flex gap-4">
          {/* Credit block grows to fill */}
          <div className={`${blockCls} flex-1`}>
            {/* <h3 className="mb-2 text-lg font-semibold">Credit score</h3> */}
            {creditScore ? (
              <CreditScoreMeter score={creditScore} />
            ) : (
              <p className="text-muted-foreground text-sm">Pending&nbsp;…</p>
            )}
          </div>
          <div className={`${blockCls} flex-none`}>
            <h3 className="mb-2 text-lg font-semibold">KYC status</h3>
            <StatusBadge value={kycStatus ?? "pending"} />
          </div>
          <div className={`${blockCls} flex-none`}>
            <h3 className="mb-2 text-lg font-semibold">AML status</h3>
            {amlVerdict ? (
              <div className="flex items-center gap-2">
                <VerdictBadge value={amlVerdict} />
                {amlRisk && (
                  <span className="text-xs text-muted-foreground">
                    ({amlRisk})
                  </span>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Pending&nbsp;…</p>
            )}
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

        {showClaim && (
          <button
            type="button"
            className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Claim Now
          </button>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-2 text-xs text-muted-foreground">
        <span>
          Updated&nbsp;
          {new Date(app.updated_at).toLocaleString()}
        </span>
        <p className="text-[11px] text-gray-500 italic">
          Disclaimer: This is a placeholder disclaimer.
        </p>
      </CardFooter>
    </Card>
  );
}
