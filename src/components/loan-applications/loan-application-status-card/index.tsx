"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DownloadIcon, Clock } from "lucide-react";

import { CreditScoreMeter } from "./credit-score-meter";
import {
  currency,
  FormatNumber,
  StatusBadge,
  VerdictBadge,
} from "./ui-snippets";

import { LoanApplicationDTO } from "../loan-application.schema";
import { downloadLoanPdf } from "@/lib/functions/loan-applications.api";

/* helper -------------------------------------------------------------- */
const FieldRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <tr className="border-t">
    <td className="py-1 pr-3 text-sm text-muted-foreground">{label}</td>
    <td className="py-1 text-right font-medium">{value}</td>
  </tr>
);

const readableStatus: Record<LoanApplicationDTO["status"], string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  approved: "Approved",
  rejected: "Rejected",
  escalated: "Escalated",
  claimed: "Claimed",
};

/* -------------------------------------------------------------------- */
interface Props {
  app: LoanApplicationDTO;
  creditScore?: number;
  kycStatus?: string;
  note?: string;
}

export function LoanApplicationStatusCard({
  app,
  creditScore,
  kycStatus,
  note,
}: Readonly<Props>) {
  const { id, status: rawStatus, selectedOffer: offer } = app;
  const status = readableStatus[rawStatus];

  /* ---- quick maths ------------------------------------------------ */
  const P = Number(app.requested_amount);
  const rA = Number(offer?.interest_rate ?? 0);
  const m = Number(offer?.tenure_months ?? 1);
  const fee = Number(offer?.processing_fee ?? 0);

  const intAmt = P * (rA / 100) * (m / 12);
  const total = P + intAmt + fee;
  const emi = total / m;

  // external checks
  const aml = app.externalChecks?.aml;
  // @ts-expect-error runtime shape
  const amlVerdict = aml?.action_required ?? aml?.status;
  // @ts-expect-error runtime shape
  const amlRisk = aml?.risk_category;
  const blockCls =
    "rounded-xl border bg-white p-4 shadow-sm flex flex-col items-center text-center";
  const isApproved = rawStatus === "approved";
  const showNote = note && ["rejected", "under_review"].includes(rawStatus);

  /* ----------------------------------------------------------------- */
  return (
    <Card className="mx-auto w-full max-w-3xl shadow-lg">
      {/* ------------------------ header */}
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <CardTitle>Loan Summary</CardTitle>
          <CardDescription className="space-x-2">
            <StatusBadge value={status.toLowerCase()} />
            <span className="text-xs text-muted-foreground">
              #{id.slice(0, 8)}
            </span>
          </CardDescription>
        </div>

        {isApproved && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="border-dashed hover:bg-muted"
                onClick={() => downloadLoanPdf(id)}
              >
                <DownloadIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download application PDF</TooltipContent>
          </Tooltip>
        )}
      </CardHeader>

      <Separator />

      {/* ------------------------ content */}
      <CardContent className="space-y-8">
        {/* Loan & product */}
        {offer && (
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Loan details</h3>
            <table className="w-full text-sm">
              <tbody>
                <FieldRow label="Amount" value={currency.format(P)} />
                <FieldRow
                  label="Interest rate"
                  value={`${offer.interest_rate}% p.a.`}
                />
                <FieldRow
                  label="Tenure"
                  value={`${offer.tenure_months} months`}
                />
                <FieldRow label="EMI" value={currency.format(emi)} />
              </tbody>
            </table>

            {/* interest accordion */}
            <Accordion type="single" collapsible>
              <AccordionItem value="calc">
                <AccordionTrigger className="justify-start text-sm">
                  Interest calculation
                </AccordionTrigger>
                <AccordionContent>
                  <table className="w-full text-sm">
                    <tbody>
                      <FieldRow
                        label="Loan amount"
                        value={currency.format(P)}
                      />
                      <FieldRow
                        label="Processing fee"
                        value={currency.format(fee)}
                      />
                      <FieldRow
                        label={`Interest (${FormatNumber(
                          (rA * m) / 12,
                          2,
                        )} %)`} /* effective */
                        value={currency.format(intAmt)}
                      />
                      <FieldRow
                        label="Total repayable"
                        value={currency.format(total)}
                      />
                    </tbody>
                  </table>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        )}

        {/* Credit – KYC – AML */}
        <div className="flex gap-4">
          <Card className={`${blockCls} flex-1`}>
            {creditScore ? (
              <CreditScoreMeter score={creditScore} />
            ) : (
              <Clock className="h-6 w-6 text-muted-foreground" />
            )}
          </Card>

          <Card className="flex flex-col items-center justify-start gap-3 p-4 px-6 shadow-sm flex-none">
            <h4 className="text-sm font-medium">KYC status</h4>
            <StatusBadge value={kycStatus ?? "pending"} />
          </Card>

          <Card className="flex flex-col items-center justify-start gap-3 py-4 px-6 shadow-sm flex-none">
            <h4 className="text-sm font-medium">AML status</h4>
            {amlVerdict ? (
              <div className="flex flex-col items-center gap-2">
                <VerdictBadge value={amlVerdict} />
                {amlRisk && (
                  <p className="text-xs text-muted-foreground">({amlRisk})</p>
                )}
              </div>
            ) : (
              <Clock className="h-6 w-6 text-muted-foreground" />
            )}
          </Card>
        </div>

        {/* Applicant */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Applicant</h3>
          <table className="w-full text-sm">
            <tbody>
              <FieldRow
                label="Name"
                value={`${app.consumer.user.first_name} ${app.consumer.user.last_name}`}
              />
              <FieldRow label="PAN" value={app.consumer.pan_number} />
              <FieldRow label="Phone" value={app.consumer.user.phone} />
              <FieldRow
                label="Monthly income"
                value={currency.format(app.monthly_income)}
              />
            </tbody>
          </table>
        </section>

        {/* note / manual-review reason */}
        {showNote && (
          <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {note}
          </p>
        )}

        {/* CTA */}
        {isApproved && (
          <Button size="lg" variant="glow" className="w-full">
            Claim Now
          </Button>
        )}
      </CardContent>

      {/* ------------------------ footer */}
      <CardFooter className="flex flex-col items-start space-y-1">
        <time className="text-xs text-muted-foreground">
          Updated&nbsp;{new Date(app.updated_at).toLocaleString()}
        </time>
        <p className="text-[11px] italic text-muted-foreground">
          Disclaimer: This document is for illustrative purposes only and does
          not constitute a legal commitment.
        </p>
      </CardFooter>
    </Card>
  );
}
